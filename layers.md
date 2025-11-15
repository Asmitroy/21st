# Layers Overview — 21st (Blooming Digital Love Journey)

This document names and describes each layer of the 21st website experience, including the intro and the seven main layers. It also notes key interactions and transitions so developers and QA can align on behavior.

## Intro — “For You”

- Purpose: Welcome screen that sets tone and invites the visitor to begin.
- Visuals: Soft gradient background; title in Playfair Display; gentle copy.
- Interaction: “Begin” button starts the journey.
- Code: Shown when `showIntro === true` in `App.tsx`.

## Layer 1 — Essence

- Purpose: Establishes the intimate, reflective mood; sets emotional foundation.
- Visuals/Style: Typographic and motion elements that ease in.
- Interaction: Concludes with a call-to-action that advances to the next layer.
- Code: `Layer1Essence` rendered when `currentLayer === 0`.

## Layer 2 — Journey

- Purpose: Deepens the narrative and progression through shared moments.
- Visuals/Style: Continuation of typographic rhythm and subtle motion.
- Interaction: CTA triggers transition overlay, then advances layer.
- Code: `Layer2Journey` rendered when `currentLayer === 1`.

## Layer 3 — Words

- Purpose: Focus on language and promise; invites engagement.
- Visuals/Style: Text-forward layout with smooth entrance animations.
- Interaction: Action button (e.g., “Feel the Promise”) continues the journey.
- Code: `Layer3Words` rendered when `currentLayer === 2`.

## Layer 4 — Horizon

- Purpose: Builds to the reveal of letters; sets anticipation.
- Visuals/Style: Poetic lines and a highlighted CTA.
- Interaction: “Read My Letters” advances to the letters layer.
- Code: `Layer4Horizon` rendered when `currentLayer === 3`.

## Layer 5 — Letters

- Purpose: Unlockable letters grid with bookmarking and typewriter reveal.
- Data: Loaded from Supabase with local fallbacks; user states mirrored to localStorage.
- Visuals/Style: Soft gradient background; cards animate in; modal overlay for reading.
- Interactions:
  - Click unlocked card to open letter modal and typewriter reveal.
  - Bookmark toggle on each card.
  - "Continue Ahead" button to proceed.
- Code: `Layer5Letters` rendered when `currentLayer === 4`.

## Layer 6 — Lantern Walk

- Purpose: A corridor of memory, promise, and light. Interactive passage where the visitor walks a road of lanterns revealing intimate messages.
- Visuals/Style: Midnight-blue gradient background; warm rose/gold/purple glows; parallax sky/fog/particles; gentle bobbing.
- Data: Lantern content from `src/data/content.ts` (`lanterns`, `lockedLanterns`, `goldenLanterns`, `hiddenLanterns`, `revelationLanterns`).
- Interactions:
  - Hover to brighten and scale.
  - Click unlocked lanterns to open modal with typewriter reveal.
  - Locked lanterns unlock after 90 seconds spent on the page (time-gated).
  - Golden lanterns are gated and become visible only after threshold (default 3).
  - Hidden lanterns appear after opening ≥3; Revelation lanterns appear after opening ≥5.
  - Revelations appear only after all hidden and locked secrets have been revealed.
  - Opening shows badges; revelation may trigger atmosphere shift or optional skip.
  - "Continue" button is enabled after opening 2+; labels reflect progression.
- Code: `LanternWalk` rendered when `currentLayer === 5`; modal in `LanternModal.tsx`.
- State:
  - `openedLanternCount` derived from `openedIds`; resets to 0 on each visit.
  - `revealedSecrets` resets to 0 on each visit.
  - Local persistence mirrors counters but resets at mount (`lanternWalk_openedIds`, `lanternWalk_openedCount`, `lanternWalk_revealedSecrets`).

### Secrets
- Secrets are revealed by opening these lantern types:
  - Hidden (3): "The Forgotten Moment", "In the Quiet Hours", "The Fear I Carry"
  - Revelation (2): "The Truth Unspoken", "The Path Forward"
  - Locked (3): "Not Yet...", "The Next Step", "The Final Promise" (time-gated at 90s)
- Golden lanterns are not counted as secrets; they are gated by opens.

## Layer 7 — Whisper Field (Final ambience)

- Purpose: Ambient, drifting poetic fragments as the closing layer of the journey.
- Visuals/Style: Whisper spans drift slowly with subtle opacity and motion; pointer-events disabled.
- Data: Whisper strings from `src/data/content.ts` (`whispers` array).
- Interaction: Non-interactive background ambience (can be tuned for reduced motion).
- Code: `WhisperField` rendered when `currentLayer === 6`.

## Cross-layer features

- `ParticleBackground`: Canvas-based particles positioned behind content.
- `AudioPlayer`: Background audio controls.
- `SequenceTransition`: Short overlay between layer transitions to create visual continuity.
- `SilenceReward`: Stillness-triggered overlay (25s inactivity) with poems and petals.

## Layer index map (App.tsx)

- Intro: `showIntro === true`
- Layer 1: `currentLayer === 0` → `Layer1Essence`
- Layer 2: `currentLayer === 1` → `Layer2Journey`
- Layer 3: `currentLayer === 2` → `Layer3Words`
- Layer 4: `currentLayer === 3` → `Layer4Horizon`
- **Layer 5: `currentLayer === 4` → `Layer5Letters`**
- **Layer 6: `currentLayer === 5` → `LanternWalk`**
- **Layer 7: `currentLayer === 6` → `WhisperField`**
### Secret Colours & Unlock Animation
- Hidden: teal glow (`teal` gradient) when visible; ghostly slate when hidden.
- Locked: rose/red glow (`rose` gradient); unlocks at 90s.
- Revelation: violet/purple glow (`purple` gradient) with pulse.
- On secret unlock: a subtle burst ring animation appears around the lantern.
