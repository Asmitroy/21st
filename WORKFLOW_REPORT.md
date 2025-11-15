# 21st Project – WhisperField Implementation Report & 21stAlpha Status

**Date:** 2025-11-13 (Session 2 — WhisperField; Session 3 — Fix & Layer 6)  
**Previous Session:** 2025-11-12 (21stAlpha stillness/SilenceReward/Layer 5)  
**Status:** Resolved — WhisperField visible; migrated to Layer 6; dev server running.

---

# Workflow Summary — 21st (For You)

## Scope
- Align layer order: Letters before Lantern Walk; Whisper Field final.
- Implement Lantern Walk progression and gating rules.
- Fix runtime issues (update-depth warning, Supabase duplicate key).
- Add visual polish (secret colours, unlock animation).
- Refresh counters on visit; adjust timers.
- Update documentation and site title.

## Final Layer Order
- Layer 4 (`currentLayer === 3`): `Layer4Horizon`
- Layer 5 (`currentLayer === 4`): `Layer5Letters`
- Layer 6 (`currentLayer === 5`): `LanternWalk`
- Layer 7 (`currentLayer === 6`): `WhisperField`

## Lantern Walk Mechanics
- Opened count: derived from `openedIds`; resets to 0 on each visit.
- Secrets revealed: tracks openings of `hidden`, `locked`, and `revelation` lanterns; resets to 0 on each visit.
- Golden lanterns: gated by opens (`unlockThreshold` default 3); not counted as secrets.
- Hidden lanterns: visible after `openedCount >= 3`.
- Locked lanterns: time-gated; unlock after 90 seconds on page.
- Revelations: appear only after all hidden and locked secrets are revealed; special pulse effect; may trigger atmosphere shift or optional skip button.

## Visuals & Animation
- Secret type colours:
  - Hidden: teal glow (visible), ghostly slate when not yet visible.
  - Locked: rose/red glow.
  - Revelation: violet/purple glow with pulse.
  - Golden: yellow gradient.
- Unlock animation: subtle burst ring appears around lantern for ~1.2s when a secret unlocks.
- Parallax atmosphere shifts with revealed secrets.

## Runtime Fixes
- Maximum update depth warning: memoized lantern arrays/maps to stabilize `useEffect` dependencies in Lantern Walk.
- Supabase duplicate key (user_visits): insert now catches `23505` and returns existing `first_visit_at` without error.

## Timers & Persistence
- Locked timer: 90 seconds; enables locked lanterns after elapsed.
- Local persistence mirrors state but resets on mount:
  - `lanternWalk_openedIds` → []
  - `lanternWalk_openedCount` → 0
  - `lanternWalk_revealedSecrets` → []
- `first_visit_date` remains persisted for visit tracking.

## Site Title
- Updated title to `For You` in `index.html`.

## Documentation
- `layers.md`: updated layer order, secret colours, gating rules, 90s lock timer, and counter resets.
- `WORKFLOW_REPORT.md`: appended detailed section summarizing the re-alignment and fixes.

## Verification
- Typecheck: passes (`npm run typecheck`).
- Dev server: runs (`npm run dev`) and serves at local port.
- Lint: pre-existing issues remain elsewhere; changes verified functionally.

## Status
- Completed — Layers aligned, lantern rules implemented, secrets gating enforced, timers and counters adjusted, visuals polished, title updated, and docs refreshed.

---

## Update – Relative Letters and First Visit Offset (2025-11-15)

### Changes
- Added two relative letters that unlock 21 and 42 days after first visit; positioned at the bottom.
- Styled these two letters with distinct accents (violet and emerald) while keeping the theme.
- Offset first visit recording by +2 days to satisfy schedule requirements:
  - Local first visit date set to day after tomorrow.
  - Supabase `user_visits.first_visit_at` inserted as day after tomorrow for new visitors.

### Files
- `src/data/letters.ts`: added `letter_rel_21` and `letter_rel_42` with `unlock_type: 'relative'` and accents.
- `src/types/index.ts`: `Letter.accent?: 'violet' | 'emerald' | 'default'`.
- `src/components/Layer5Letters.tsx`: accent-based colour mapping; sorted by `position_order` keeps relative letters at bottom.
- `src/utils/unlockUtils.ts`: first visit date defaults to +2 days.
- `src/utils/supabaseClient.ts`: inserts first visit as +2 days for new entries.

### Supabase Notes
- No schema changes required in SQL. We now apply the +2 days offset only to relative letters at the application level.
- First visit is recorded as actual current timestamp in `user_visits`.

### Verification
- Typecheck passes.
- Letters layer shows one immediate letter, absolute-date letters, and two relative letters at the bottom.
## Session 3 Overview – WhisperField Visibility Fix & Final Layer Migration (2025-11-13)

### Summary

- Raised `WhisperField` container z-index from `z-0` to `z-[5]` to render above Layer 5 gradient and below interactive UI.
- Moved `WhisperField` from Layer 5 to new Layer 6 (final ambience).
- Updated `src/App.tsx` to render `WhisperField` when `currentLayer === 5`; kept `Layer5Letters` unchanged on `currentLayer === 4`.
- Verified in Vite dev server (`http://localhost:5173/`): drifting whispers render on Layer 6 as intended.
- Authored `layers.md` documenting Intro and Layers 1–6 for team clarity.

### Files Modified (Session 3)

| File                              | Change                                | Status      |
| --------------------------------- | ------------------------------------- | ----------- |
| `src/components/WhisperField.tsx` | Update z-index to `z-[5]`             | ✅ Compiles |
| `src/App.tsx`                     | Move WhisperField to new Layer 6      | ✅ Compiles |
| `layers.md`                       | Created — document Intro + Layers 1–6 | ✅ Complete |

### Notes

- `WhisperField` remains non-interactive (`pointer-events-none`) and uses Playfair Display with rose-toned text.
- Layer 5 continues to host the letters experience; Layer 6 is purely ambient.
- Density currently set to `count={18}`; opacity and timing can be tuned later.

---
## Session 2 Overview – WhisperField Implementation (2025-11-13)

### Objective

Implement a new `WhisperField` component in the `21st` project (main/public site) that renders drifting ambient whispers behind the final interaction layer, based on the design in `plans.md`.

### What Was Accomplished

1. **Data Layer:** Added `whispers: string[]` array to `src/data/content.ts` with sample whisper text.
2. **Component:** Created `src/components/WhisperField.tsx`
   - React functional component using framer-motion for animations
   - Generates 14 drifting whisper items with random positions, delays, durations
   - Each item: `motion.span` with vertical linear animation (y: 0 → -40, repeating mirror)
   - Styling: fixed positioning, inset-0, pointer-events-none, z-0, Playfair Display serif, rose-900/65
3. **File Recovery:** Corrected file corruption from multiple edits (47→0 TypeScript errors)
4. **Integration:** Mounted in `src/App.tsx` Layer 5 section
5. **Validation:**
   - ✅ TypeScript compilation (exit code 0, no errors)
   - ✅ Vite dev server (started at http://localhost:5173/)

### Current Status

- **Expected:** Drifting whisper text visible in final layer, semi-transparent rose tones
- **Actual:** Not visually visible in browser (cause undiagnosed)
- **Blockers:** Requires browser inspection/debugging to identify root cause (z-index, opacity, positioning, animation trigger, or environment-specific issue)

### Files Modified

| File                              | Change               | Status      |
| --------------------------------- | -------------------- | ----------- |
| `src/components/WhisperField.tsx` | Created              | ✅ Compiles |
| `src/data/content.ts`             | Added whispers array | ✅ Complete |
| `src/App.tsx`                     | Mounted component    | ✅ Compiles |

### Next Steps (When Resuming)

1. Open http://localhost:5173/ in browser, navigate to final layer
2. Use DevTools Inspector to check WhisperField DOM and computed styles
3. Add temporary debug border/logging if needed to isolate visibility issue

---

## Previous Session Summary – 21stAlpha (2025-11-12)

This document also includes a summary of work I performed to implement and debug the "Stillness / Silence Reward" and "Layer 5 - Unlockable Letters" features in the 21stAlpha project.

---

## High-level summary

Goal: When the visitor sits still for 25 seconds, show a graceful modal with 6 rotating poems and falling petals; Layer 5 should show unlockable floating letter cards (absolute + relative unlocks) with typewriter reveal and bookmark persistence.

Work performed: I searched, inspected, and edited multiple files across the project, implemented fallbacks for Supabase, rewrote and hardened the stillness detector, improved SilenceReward UI and rendering, and added debugging and local persistence for letter states.

Result: Layer 5 now works locally (letters load, one letter unlocked, bookmarks persist). The stillness detection logic fires reliably (console logs show the 25s detection). However, you report you cannot see the overlay visually in your browser — despite the logs confirming it mounted. I made many fixes intended to resolve rendering/surface issues (including portal-based rendering), but your environment still does not show the overlay onscreen. The issue is currently unresolved from the UI visibility perspective.

---

## Actions taken (detailed)

I performed the following actions and edits. Files are given relative to the project root `21stAlpha/`.

1. Inventory & initial read

   - Inspected: `package.json`, `vite.config.ts`, `tsconfig.*`, `index.html`, `tailwind.config.js`, `postcss.config.js`, `src/main.tsx`, `src/App.tsx`.
   - Read `IMPLEMENTATION_GUIDE.md` to get the intended schema and design.

2. Supabase & DB

   - Created `supabase_setup.sql` in the project root with the required tables and optional sample letters (user_visits, letters, user_letter_state) and indexes.
   - Edited `src/utils/supabaseClient.ts`:
     - Persist `first_visit_at` to `localStorage` when available.
     - Provide local fallback sample letters when the DB returns no rows (useful for dev/or empty DBs).
     - Implement localStorage fallback for `fetchUserLetterStates` and mirroring writes in `updateLetterState` so bookmarks and opened states persist offline.
   - Verified (via runtime logs) that earlier Supabase errors were due to missing tables in the new Supabase project; after running SQL (manual step on your side), Layer 5 loads data.

3. Layer 5 behavior

   - Verified `Layer5Letters.tsx` for unlock logic integrations using `unlockUtils.ts`.
   - Verified bookmarks persist (with localStorage mirror). You confirmed Layer 5 works and one letter was unlocked.

4. Stillness detector & SilenceReward

   - Rewrote `src/hooks/useStillnessDetector.ts` to a simpler, robust implementation:
     - Single timer cleared on activity, added pointer + wheel + scroll listeners and passive listeners for performance.
     - Logs a console message when the 25s timer fires: `[Stillness] 25 seconds of inactivity detected!`.
   - Reworked `src/components/SilenceReward.tsx` multiple times:
     - First added exit animation for petals, rotation of poems every 7s.
     - Then implemented inline styles to avoid Tailwind/z-index conflicts.
     - Final approach: render the overlay into `document.body` via `createPortal()` so it sits outside any stacking context created by the app root. This is intended to avoid CSS stacking issues.
   - Added console logs to confirm when the overlay renders: `[SilenceReward] Rendering overlay - isActive=true` (and removed/kept others during cleanup).

5. Type checking & dev server
   - Ran `npm install`, `npm run typecheck` (TS checks passed after fixes), and `npm run dev` (Vite runs — by default port 5173; if occupied Vite tries another port such as 5174).

---

## What worked (successes)

- Layer 5 letters now render locally. Bookmarks and opened state persist (localStorage mirror implemented). I verified this behavior and you confirmed it.
- Supabase integration: errors showed clearly in logs earlier (missing tables). After creating tables in your Supabase project (you ran SQL in dashboard), the DB queries no longer fail for missing tables.
- The stillness detection logic (timer) reliably fired (console logs confirm it). I observed repeated logs such as:
  - `[Stillness] 25 seconds of inactivity detected!`
  - The SilenceReward overlay mount log was observed: `[SilenceReward] Rendering overlay - isActive=true` (meaning React attempted to render it).
- TypeScript typechecking passed after edits.

---

## What failed (remaining issue)

- Visual rendering of the SilenceReward overlay for you: even though the stillness hook fires and the SilenceReward component renders (verified by console logs), you still do not see the overlay on the screen.

  Likely causes I tried to address (but issue persists):

  - CSS stacking context / z-index conflicts (I moved the overlay into a portal attached to `document.body`, applied inline styles with very high z-index).
  - Another element covering the overlay (canvas `ParticleBackground`, other fixed elements). I checked `ParticleBackground` — it uses `style={{ zIndex: 0 }}` for the canvas, so it should not cover the overlay rendered at zIndex `9999`.
  - Transform or 3D contexts on parent elements creating a new stacking context — rendering in portal should avoid this.
  - Browser-specific or extension interference (adblocker/extension or devtools overlay). I asked you to check in DevTools; console logs are available and show activation.

  Because the overlay now renders into `document.body` with inline styles and a huge z-index, inline fallback should force visibility. Since you still do not see it, the cause may be environment-specific (browser zoom, display scaling, OS-level overlay, or some CSS in global `index.css` that affects `body` or `html` sizes) or the overlay may be off-screen due to some transform/viewport mismatch. I couldn't reproduce this final symptom in my environment because logs showed activation and I expected visible overlay.

---

## Evidence & logs

- Runtime logs (Vite console) show the stillness detection messages and SilenceReward activation logs. Examples collected during the session:

  - `[Stillness] 25 seconds of inactivity detected!`
  - `[SilenceReward] Rendering overlay - isActive=true`

- Supabase runtime logs earlier showed errors when the DB was missing tables (PGRST205). This was resolved by creating the required tables via SQL.

---

## Files created/edited during this work

- Created: `supabase_setup.sql` — SQL to create tables + sample letters.
- Created: `WORKFLOW_REPORT.md` (this file).

- Edited (major changes):
  - `src/utils/supabaseClient.ts` — local fallback for letters, persist first visit to localStorage, local mirror for user letter states (fetch/update).
  - `src/hooks/useStillnessDetector.ts` — simplified and hardened stillness detection logic with additional listeners and console logs.
  - `src/components/SilenceReward.tsx` — rewritten to portal-based overlay with inline styles and falling-petal animations / poem rotation.
  - `src/App.tsx` — small change (removed `className="relative"` on app root wrapper to avoid stacking contexts interfering with global overlay; ensured `SilenceReward` is mounted early in tree).

---

## How to reproduce locally (quick)

1. Open a terminal in `d:\Codebase\21stAlpha`
2. Install deps (only if needed):

```powershell
npm install
```

3. Start dev server:

```powershell
npm run dev
```

Open the Local URL printed by Vite (e.g., `http://localhost:5174/`).

4. To test letters (Layer 5): progress through app layers until Layer 5 or set `currentLayer` in `App.tsx` to `4` for quick jump (temporary testing). You should see sample letters if your Supabase project is empty.

5. To test stillness (primary issue):
   - Open DevTools → Console
   - Sit completely still (no mouse/keyboard/touch/scroll) for 25 seconds
   - Look for console messages:
     - `[Stillness] 25 seconds of inactivity detected!` (the timer fired)
     - If you see the second message (or a SilenceReward message) it means React attempted to render the overlay
   - If overlay appears then click to dismiss — you should see falling petals exit animation.

---

## Recommended next steps / future goals

Pick 1–2 immediate actions (I can implement them):

1. Add a manual debug trigger and keyboard shortcut (e.g., press `Shift+S`) to open the SilenceReward overlay instantly — this helps verify display vs detection quickly.
2. Add a temporary visible test button (fixed on screen) to toggle the SilenceReward so you can visually confirm rendering without waiting 25s.
3. Add deeper DOM/debug logs to dump bounding rectangles and computed styles when the overlay mounts — this will tell us if the overlay is off-screen or has `display:none` or 0/hidden opacity.
4. Add unit tests for `src/utils/unlockUtils.ts` (isLetterUnlocked, getDaysUntilUnlock, formatUnlockDate).
5. Add a small GitHub Actions workflow to run `npm ci` → `npm run lint` → `npm run typecheck` on PRs.

If you want me to continue: I suggest implementing (1) and/or (2) first to positively confirm whether the problem is detection-only or rendering-only.

---

## Quick debugging checklist for you (things to try now)

- Open DevTools → Console and confirm you see the stillness log. If you see it but not the overlay, the issue is rendering/visibility, not detection.
- Try disabling the `ParticleBackground` temporarily (comment out `<ParticleBackground />` in `App.tsx`) and re-test; this can rule out the canvas or its CSS interfering.
- Try opening the page in an incognito/private window (no extensions) to rule out extension interference.
- Check `document.body` size in the console — run `document.body.getBoundingClientRect()` to verify full screen dimensions.
- Manually run this in console to test portal rendering:
  ```js
  // create a red box via portal to see if any overlay becomes visible
  const el = document.createElement("div");
  el.style.position = "fixed";
  el.style.inset = "0";
  el.style.zIndex = "99999";
  el.style.backgroundColor = "rgba(255,0,0,0.3)";
  document.body.appendChild(el);
  ```
  If you cannot see this red overlay, something in your environment is blocking overlays or the page is constrained by CSS.

---

## Corrections Implemented (Follow-up)

- Added keyboard shortcuts: `Shift+S` to activate and `Shift+X` to deactivate the SilenceReward overlay.
- Added a visible debug button (`Test Silence Reward`) fixed at the top-left to trigger the overlay instantly.
- Added diagnostic logs in `SilenceReward` to report bounding rectangles and computed styles when the overlay mounts.

### Transition Animation Improvements (2025-11-12)

- Reworked the sequence transition shown after clicking “Continue” between layers.
- Removed `mix-blend-mode: screen` and randomized sparkles (caused inconsistent rendering in Chrome).
- Implemented a Chrome-safe overlay using only `opacity`/`transform` animations:
  - Full-screen radial bloom with subtle glow.
  - Two diagonal sweep lines with ease-in-out motion.
- Added `will-change: transform, opacity` and `translateZ(0)` to encourage GPU acceleration.
- Result: smoother, consistent transition in Trae preview and expected parity in Chrome.

---

## Final Resolution (2025-11-12)

Status: Resolved — overlay appears and persists after idle; text renders correctly.

Changes that achieved stability and correct rendering:

- `App.tsx`: Memoized `handleStillness` and `handleMovement` with `useCallback` to provide stable references to the stillness hook (prevents effect reinitialization that caused immediate dismissal).
- `useStillnessDetector.ts`:
  - Removed calling `onMovement` during timer resets; movement now only triggers on actual user activity while in the still state.
  - Extended synthetic-activity suppression window to `2000ms` right after stillness activation to avoid premature dismissal.
  - Reduced noisy event listeners by removing `pointermove`/`wheel` which were causing false movement detections.
- `SilenceReward.tsx`:
  - Ensured the overlay container renders with `opacity: 1` and high `z-index` via inline styles.
  - Kept poem text transitions within a nested `motion.div` so content fades in smoothly while the container stays visible.

Verification:

- Observed `[Stillness] 25 seconds of inactivity detected!` followed by `[SilenceReward] Rendering overlay - isActive=true`.
- Overlay remains visible until real user activity (mousemove/keydown/click/touch) occurs.
- Poem content from `silencePoems` renders in white, with a “Move to return” hint and animated petals.

Notes:

- Keyboard shortcuts (`Shift+S` / `Shift+X`) and the debug button continue to function for quick checks.
- Diagnostic style/rect logs remain available for future troubleshooting.

## References and places to look later

- Files I edited:

  - `src/hooks/useStillnessDetector.ts`
  - `src/components/SilenceReward.tsx`
  - `src/utils/supabaseClient.ts`
  - `src/App.tsx`
  - `supabase_setup.sql` (created)

- Guidance for Supabase tables: see `supabase_setup.sql` in the project root or copy SQL from `IMPLEMENTATION_GUIDE.md`.
- To run lint/typecheck/build: `npm run lint`, `npm run typecheck`, `npm run build`.

---

## Final note

I made many targeted changes to address the symptoms you reported. The stillness detector is now robust and fires as expected. The overlay rendering has been moved to a portal and forced with inline styles and a very high z-index to avoid stacking-context issues. Because you still report no visible overlay, the problem is very likely environment-specific (extensions, browser, global CSS, or unusual OS display scaling) or requires a small manual trigger to experiment further.

If you want, I will:

- Implement a manual on-screen debug button and a keyboard shortcut to toggle the SilenceReward overlay immediately (fast, reversible change).
- Add DOM bounding-box and computed-style dumps when the overlay mounts so we can conclusively see why it might be invisible.

Tell me which follow-up you'd like (manual trigger vs deeper telemetry vs I stop here).

---

## Recent updates (2025-11-12 — latest)

- Removed the on-screen debug "Test Silence Reward" button from `src/App.tsx`. The keyboard shortcuts (`Shift+S` / `Shift+X`) remain available for quick testing.
- Added `SequenceTransition` (`src/components/SequenceTransition.tsx`) — a short sparkle overlay that runs between layer transitions. `App.tsx` now triggers this overlay via `handleLayerComplete` and advances the layer when the overlay completes.
- Improved `ParticleBackground.tsx`: added devicePixelRatio scaling, responsive resize handling, and increased particle count/visibility. The canvas is set behind the UI (z-index: -1) to avoid covering overlays.

---

# Workflow – Lantern Walk and Letters Alignment (2025-11-15)

## Summary
- Reordered layers so Letters precede Lantern Walk.
- Fixed lantern visibility and progression rules (golden/hidden/revelation).
- Resolved Supabase duplicate-key error for `user_visits`.
- Eliminated render-loop warnings by stabilizing memoized dependencies.

## Layer Order — Final
- Layer 4 (`currentLayer === 3`): `Layer4Horizon`
- Layer 5 (`currentLayer === 4`): `Layer5Letters`
- Layer 6 (`currentLayer === 5`): `LanternWalk`
- Layer 7 (`currentLayer === 6`): `WhisperField`

## Changes Implemented
- App routing:
  - Letters moved to `currentLayer === 4` and gated by `isLoading` in `src/App.tsx`.
  - Lantern Walk moved to `currentLayer === 5`.
- LanternWalk logic:
  - `openedLanternCount` resets and derives from `openedIds` on each visit.
  - Golden lanterns visible only after `unlockThreshold` (default 3).
  - Hidden appear at ≥3 opens; Revelation at ≥5 opens.
  - Arrays/maps memoized to avoid `useEffect` dependency churn.
- Supabase `user_visits`:
  - Insert now catches code `23505` (unique violation) and returns existing date.

## Keys and Persistence
- `lanternWalk_openedIds`: JSON array of opened standard lantern IDs.
- `lanternWalk_openedCount`: numeric mirror of `openedIds.length`.
- `lanternWalk_revealedSecrets`: JSON array of revealed secret IDs.
- `first_visit_date`: ISO string of initial visit.

## Unlock Thresholds
- Locked: time-gated at `timeUnlockMs = 45000` (visible but disabled until elapsed).
- Golden: invisible until `openedCount >= unlockThreshold` (default 3).
- Hidden: invisible until `openedCount >= 3`.
- Revelation: invisible until `openedCount >= 5`; may trigger atmosphere shift or skip.

## Verification
- Typecheck: `npm run typecheck` — passed.
- Dev server: `npm run dev` — running at http://localhost:5174/.
- Lint: contains existing unrelated errors; functional changes verified.

## Status
- Completed — Layers aligned, golden lanterns gated, runtime warnings resolved, Supabase visit insert hardened, and time-based locked secrets added.
- Enhanced `SilenceReward.tsx` with a sparkle burst on poem change (small radial sparkles) in addition to the existing falling-petal animation.

These changes were tested with the dev server (Vite) and TypeScript typecheck. If you want any of the debug helpers reintroduced (temporary test button or additional logging), I can add them behind a debug flag so they aren't visible in normal runs.
