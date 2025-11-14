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
  - `openedLanternCount` derived from `openedIds` on mount, persists count to match IDs.
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
- Locked: visible but disabled until `openedCount >= 3`.
- Golden: invisible until `openedCount >= unlockThreshold` (default 3).
- Hidden: invisible until `openedCount >= 3`.
- Revelation: invisible until `openedCount >= 5`; may trigger atmosphere shift or skip.

## Verification
- Typecheck: `npm run typecheck` — passed.
- Dev server: `npm run dev` — running at http://localhost:5174/.
- Lint: contains existing unrelated errors; changes do not introduce new functional issues.

## Status
- Completed — Layers aligned, golden lanterns gated, runtime warnings resolved, and Supabase visit insert hardened.