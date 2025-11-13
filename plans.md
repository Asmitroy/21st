# Whisper Field — Plan

This document describes the design and implementation plan for the "Whisper Field" — an ambient, final layer that displays short poetic fragments (whispers) drawn from the site and slowly drifting across the viewport. The goal is to match the project's aesthetic: soft, intimate, typographic, and unobtrusive. Implementation will use the site's existing stack (React + TypeScript + Tailwind + Framer Motion).

## Visual concept

- Atmosphere: soft, warm gradient (rose/ivory undertone) with high typographic contrast for legibility.
- Typography: serif display (Playfair Display) for whispers; light weight and generous letter-spacing.
- Motion: very slow drift and fade (30–60s), occasional subtle scale/brightness pops to mimic recognition.
- Depth: layered opacity + small blur variations to imply distance.

## Technical approach

Implement as a small, self-contained React component `WhisperField.tsx` placed under `src/components/` in the `21st` site. The component will:

- Accept a `whispers: string[]` prop (or load from `src/data/content.ts`) and an optional `count` prop for how many items to render.
- Render `count` absolutely-positioned whisper elements within a full-viewport container.
- Use CSS/Tailwind for base styles and Framer Motion for motion/entrance/exit and coordinated transitions.
- Respect `prefers-reduced-motion` and pause animations when the tab is not visible (page hidden).

### Files to add / edit

- `src/components/WhisperField.tsx` — main component (React + TSX)
- `src/components/WhisperField.css` or tailwind utilities in `index.css` — small helper styles / keyframes
- `src/data/content.ts` — (optional) export `whispers` array if centralized data is preferred
- `src/App.tsx` — import and mount `WhisperField` in the desired layer (final layer / route)

## Implementation sketch (React + Tailwind + Framer Motion)

High-level component contract:

- Props: { whispers?: string[]; count?: number; seed?: number }
- Behavior: deterministic placement per seed, graceful mount/unmount, pause on interaction.

Rendering notes:

- Use CSS variables and inline styles for per-element delay, size and position so we can vary them without recreating components.
- For performance: render raw DOM spans (not heavy subtrees) and use CSS transforms (translate3d) driven by Framer Motion where needed.

Example usage (conceptual):

```tsx
<WhisperField whispers={whispers} count={18} />
```

## Styling notes (keep to Tailwind where possible)

- Container: `fixed inset-0 pointer-events-none -z-10` (we usually render background ambience under interactive UI)
- Whisper element base classes: `absolute font-playfair text-base text-rose-900/70 select-none` with inline style overrides for fontSize/top/left/animationDelay
- Keyframes: keep motion long and smooth (30–60s). Use opacity and translate transforms instead of changing layout.

If you prefer an isolated CSS block (in `index.css`):

```css
@keyframes whisper-float {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(40px, -120px, 0);
  }
}
@keyframes whisper-fade {
  0%,
  100% {
    opacity: 0;
  }
  20%,
  80% {
    opacity: 0.9;
  }
}
.whisper {
  animation: whisper-float 45s linear infinite, whisper-fade 12s ease-in-out
      infinite;
}
```

## Accessibility & performance

- Respect `prefers-reduced-motion` by disabling/translating animations to a subtle cross-fade.
- Limit total DOM nodes (default 12–24 whispers) to avoid repaint pressure.
- Use `will-change: transform, opacity` sparingly and test on low-end devices.
- Pause animation on `document.visibilitychange` or when `IntersectionObserver` indicates the component is offscreen.

## Data source & harvesting

- Prefer static array in `src/data/content.ts` for predictable builds and for server-side content. Example:

```ts
export const whispers = [
  "you were light, even when I forgot the sun",
  "time folds where love lingers",
  "the silence kept your shape",
  "letters breathe when no one reads them",
  "some things bloom in memory alone",
];
```

- Optional dynamic harvesting: collect visible lines from earlier layers on first mount (use cautiously — avoid reflows). If implemented, cache results in sessionStorage.

## Interaction

- Pointer interaction should be minimal: hovering or focusing a whisper can temporarily pause it and increase opacity (a small micro-interaction), but all elements must remain `pointer-events: none` by default — only enable pointer-events for the hovered element after a short delay to avoid accidental interruptions.

## Transition / sequencing

- When the Whisper Field mounts as the final layer, fade it in with a short overlay (use `framer-motion` enter animation) and stagger the initial appearance of whispers for a gentle emergence.

## Testing & QA

- Visual: test on mobile (small screens), tablet and desktop. Check for clipping and readable line lengths.
- Perf: Lighthouse check, ensure 60fps on modern devices and graceful fallback on slower ones.
- Accessibility: test `prefers-reduced-motion` and ensure focusable controls (if any) are reachable with keyboard.

## Implementation tasks (suggested)

1. Create `WhisperField.tsx` component and export it.
2. Add `whispers` to `src/data/content.ts` and import in the component.
3. Style with Tailwind + a small keyframe set in `index.css`.
4. Mount in the final layer (update `src/App.tsx` or the Layer component responsible for the final screen).
5. Run manual QA: dev server, slow network/throttled CPU, mobile viewport.

---

If you want, I can implement a minimal `WhisperField.tsx` now (React + TypeScript + Tailwind + framer-motion) and wire it into the `21st` site so you can preview immediately. I can also include a small demo `whispers` list in `src/data/content.ts`. Which would you prefer — "implement now" or "just the plan"?
