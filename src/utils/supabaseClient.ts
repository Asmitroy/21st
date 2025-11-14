import { createClient } from "@supabase/supabase-js";
import { letterContent } from "../data/content";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export const ensureUserVisit = async (userIdentifier: string) => {
  try {
    const { data, error } = await supabase
      .from("user_visits")
      .select("first_visit_at")
      .eq("user_identifier", userIdentifier)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const nowIso = new Date().toISOString();
      const { error: insertError } = await supabase
        .from("user_visits")
        .insert({
          user_identifier: userIdentifier,
          first_visit_at: nowIso,
        });

      if (insertError) {
        const code = (insertError as any)?.code;
        if (code !== "23505") {
          throw insertError;
        }
        const { data: existing } = await supabase
          .from("user_visits")
          .select("first_visit_at")
          .eq("user_identifier", userIdentifier)
          .maybeSingle();
        if (existing?.first_visit_at) {
          try {
            localStorage.setItem("first_visit_date", existing.first_visit_at);
          } catch (e) {}
          return new Date(existing.first_visit_at);
        }
      }
      try {
        localStorage.setItem("first_visit_date", nowIso);
      } catch (e) {
        // ignore
      }
      return new Date(nowIso);
    }

    try {
      if (data.first_visit_at)
        localStorage.setItem("first_visit_date", data.first_visit_at);
    } catch (e) {
      // ignore localStorage errors
    }

    return new Date(data.first_visit_at);
  } catch (error) {
    console.error("Error ensuring user visit:", error);
    return new Date();
  }
};

export const fetchLetters = async () => {
  try {
    const { data, error } = await supabase
      .from("letters")
      .select("*")
      .order("position_order", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data;

    // Fallback sample letters (useful for local/dev when DB is empty)
    const sample = [
      {
        letter_key: "letter_local_1",
        title: "My First Letter",
        content: letterContent,
        unlock_type: "relative",
        unlock_date: "0",
        position_order: 1,
      },
      {
        letter_key: "letter_local_2",
        title: "A Future Note",
        content: "This letter unlocks in the future.",
        unlock_type: "absolute",
        unlock_date: "2099-01-01",
        position_order: 2,
      },
    ];

    return sample;
  } catch (error) {
    console.error("Error fetching letters:", error);
    return [];
  }
};

export const fetchUserLetterStates = async (userIdentifier: string) => {
  try {
    const { data, error } = await supabase
      .from("user_letter_state")
      .select("*")
      .eq("user_identifier", userIdentifier);

    if (error) throw error;
    if (data && data.length > 0) return data;

    // Fallback to localStorage-stored states if DB empty/unavailable
    try {
      const raw = localStorage.getItem(`user_letter_states:${userIdentifier}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }

    return [];
  } catch (error) {
    console.error("Error fetching user letter states:", error);
    try {
      const raw = localStorage.getItem(`user_letter_states:${userIdentifier}`);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return [];
  }
};

export const updateLetterState = async (
  userIdentifier: string,
  letterKey: string,
  updates: { is_opened?: boolean; is_bookmarked?: boolean; opened_at?: string }
) => {
  try {
    const { error } = await supabase.from("user_letter_state").upsert({
      user_identifier: userIdentifier,
      letter_key: letterKey,
      ...updates,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;
    // persist to localStorage as a mirror for offline/dev
    try {
      const key = `user_letter_states:${userIdentifier}`;
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      const idx = arr.findIndex((r: any) => r.letter_key === letterKey);
      const newRecord = {
        user_identifier: userIdentifier,
        letter_key: letterKey,
        is_opened: updates.is_opened ?? false,
        is_bookmarked: updates.is_bookmarked ?? false,
        opened_at: updates.opened_at ?? null,
        updated_at: new Date().toISOString(),
      };

      if (idx >= 0) arr[idx] = { ...arr[idx], ...newRecord };
      else arr.push(newRecord);

      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
      // ignore localStorage errors
    }
  } catch (error) {
    console.error("Error updating letter state:", error);
    // On error, persist to localStorage so UI changes aren't lost
    try {
      const key = `user_letter_states:${userIdentifier}`;
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      const idx = arr.findIndex((r: any) => r.letter_key === letterKey);
      const newRecord = {
        user_identifier: userIdentifier,
        letter_key: letterKey,
        is_opened: updates.is_opened ?? false,
        is_bookmarked: updates.is_bookmarked ?? false,
        opened_at: updates.opened_at ?? null,
        updated_at: new Date().toISOString(),
      };

      if (idx >= 0) arr[idx] = { ...arr[idx], ...newRecord };
      else arr.push(newRecord);

      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
      // ignore
    }
  }
};
