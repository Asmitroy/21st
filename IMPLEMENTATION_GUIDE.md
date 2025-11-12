# Silence Rewards & Unlockable Letters System - Implementation Guide

## Overview
This implementation adds two emotional layers to your site:
1. **Silence Rewards**: When someone sits still for 25 seconds, rotating poetic messages appear
2. **Unlockable Letters**: A 5th layer featuring floating envelope cards with time-based unlocking

## Features Implemented

### 1. Stillness Detection
- Tracks user inactivity (mouse, keyboard, touch)
- 25-second timeout before silence reward triggers
- Works globally across all layers
- **File**: `src/hooks/useStillnessDetector.ts`

### 2. Silence Reward Modal
- Dimmed backdrop with poetic whispers
- 6 rotating poems (changes every 7 seconds)
- Falling petal animations
- Triggered by inactivity, exited by any movement
- **File**: `src/components/SilenceReward.tsx`

### 3. Letter System with Dual Unlock Types
- **Absolute Dates**: Fixed calendar dates (e.g., "2026-01-14")
- **Relative Dates**: Days after first visit (e.g., "3" = 3 days from first visit)
- **Unlock Utilities**:
  - `isLetterUnlocked()` - Check if letter is available
  - `getDaysUntilUnlock()` - Calculate countdown
  - `formatUnlockDate()` - Display formatted unlock date
- **Files**: `src/utils/unlockUtils.ts`

### 4. Layer 5: Letterbox Interface
- Beautiful floating envelope cards
- Glowing effect for opened letters
- Dimmed appearance for locked letters
- Typewriter reveal animation when reading
- Bookmark functionality (glows on next visit)
- **File**: `src/components/Layer5Letters.tsx`

### 5. Supabase Integration
- User visit tracking (first visit timestamp)
- Letter metadata storage
- User letter state tracking (opened/bookmarked)
- Persistent data across sessions
- **Files**: `src/utils/supabaseClient.ts`

### 6. Data Models
- `SilencePoem` - Poetic messages
- `Letter` - Letter with unlock metadata
- `UserVisit` - First visit tracking
- `UserLetterState` - Read/bookmark status
- **File**: `src/types/index.ts`

## Setup Instructions

### Step 1: Create Supabase Tables

Copy and run this SQL in your Supabase SQL editor:

```sql
-- User visits table
CREATE TABLE IF NOT EXISTS user_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text UNIQUE NOT NULL,
  first_visit_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Letters table
CREATE TABLE IF NOT EXISTS letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  letter_key text UNIQUE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  unlock_type text NOT NULL DEFAULT 'absolute',
  unlock_date text NOT NULL,
  position_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User letter state table
CREATE TABLE IF NOT EXISTS user_letter_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text NOT NULL,
  letter_key text NOT NULL,
  is_opened boolean DEFAULT false,
  is_bookmarked boolean DEFAULT false,
  opened_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_identifier, letter_key)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_visits_identifier ON user_visits(user_identifier);
CREATE INDEX IF NOT EXISTS idx_user_letter_state_identifier ON user_letter_state(user_identifier);
CREATE INDEX IF NOT EXISTS idx_letters_position ON letters(position_order);
```

### Step 2: Add Letters to Database

Insert your letters into the database:

```sql
INSERT INTO letters (letter_key, title, content, unlock_type, unlock_date, position_order) VALUES
  ('letter_1', 'My First Letter', 'Letter content here...', 'relative', '1', 1),
  ('letter_2', 'My Second Letter', 'Letter content here...', 'absolute', '2026-01-14', 2),
  ('letter_3', 'My Third Letter', 'Letter content here...', 'relative', '7', 3);
```

### Step 3: Configure Unlock Dates

**Absolute Unlock (Calendar Date)**:
- Use format: `"2026-01-14"`
- Letter becomes available on that exact date
- `unlock_type`: `'absolute'`

**Relative Unlock (Days After First Visit)**:
- Use format: `"3"` (as string)
- Letter becomes available 3 days after first visit
- `unlock_type`: `'relative'`

Example configuration:
```sql
-- Unlocks on January 14, 2026
UPDATE letters SET unlock_type = 'absolute', unlock_date = '2026-01-14' WHERE letter_key = 'letter_1';

-- Unlocks 7 days after first visit
UPDATE letters SET unlock_type = 'relative', unlock_date = '7' WHERE letter_key = 'letter_2';
```

## Code Organization

```
src/
├── components/
│   ├── Layer5Letters.tsx        # Letterbox interface
│   ├── SilenceReward.tsx        # Silence reward modal
│   └── [existing layers]
├── hooks/
│   └── useStillnessDetector.ts  # Inactivity detection hook
├── utils/
│   ├── unlockUtils.ts          # Unlock logic & date calculations
│   └── supabaseClient.ts        # Supabase queries
├── data/
│   └── content.ts              # Silence poems
├── types/
│   └── index.ts                # TypeScript interfaces
└── App.tsx                     # Main integration
```

## Editing Guide

### Add More Silence Poems
Edit `src/data/content.ts`:
```typescript
export const silencePoems: SilencePoem[] = [
  {
    id: 'silence-7',
    content: 'Your new poem here.\nCan span multiple lines.',
  },
  // Add more...
];
```

### Change Stillness Timeout
In `src/App.tsx`, look for:
```typescript
useStillnessDetector(
  () => setSilenceActive(true),
  () => setSilenceActive(false),
  25000  // milliseconds - change this value
);
```

### Modify Letter Colors/Styling
Edit `src/components/Layer5Letters.tsx` to change:
- Card backgrounds: Look for `bg-gradient-to-br from-...`
- Text colors: Look for `text-gray-...` or `text-blue-...`
- Glow effects: Look for `boxShadow` animations

### Add/Update Letters
Use Supabase dashboard or SQL:
```sql
INSERT INTO letters (letter_key, title, content, unlock_type, unlock_date, position_order)
VALUES ('letter_4', 'Letter Title', 'Full content...', 'relative', '14', 4);
```

### Edit Poem Rotation Speed
In `src/components/SilenceReward.tsx`:
```typescript
useEffect(() => {
  if (!isActive) return;

  const rotationInterval = setInterval(() => {
    setCurrentPoemIndex((prev) => (prev + 1) % silencePoems.length);
  }, 7000);  // Change 7000 to desired milliseconds
```

## Testing

### Test Stillness Feature
1. Run `npm run dev`
2. Sit still for 25 seconds - you should see the silence reward appear
3. Move mouse/keyboard to exit

### Test Letter Unlocking
1. Set a letter to `unlock_type = 'relative'` and `unlock_date = '0'` to unlock immediately
2. Test with absolute date: `'2025-11-11'` (should be unlocked now)
3. Test with future date: `'2099-01-01'` (should be locked)

### Test Bookmark Feature
1. Open a letter
2. Click bookmark button
3. Close and refresh - bookmark should persist

## Important Notes

- **User Identifier**: Generated automatically and stored in localStorage
- **First Visit Date**: Stored in localStorage and Supabase for consistency
- **Offline Fallback**: Uses localStorage if Supabase is temporarily unavailable
- **Local Deployment**: Works perfectly locally - Supabase is cloud-hosted
- **Browser Storage**: Each browser/device has its own visit date and letter states

## File Changes Summary

**New Files**:
- `src/components/Layer5Letters.tsx`
- `src/components/SilenceReward.tsx`
- `src/hooks/useStillnessDetector.ts`
- `src/utils/unlockUtils.ts`
- `src/utils/supabaseClient.ts`

**Modified Files**:
- `src/App.tsx` - Added Layer5, silence detector, Supabase integration
- `src/components/Layer4Horizon.tsx` - Added onComplete prop and "Read My Letters" button
- `src/types/index.ts` - Added new interfaces
- `src/data/content.ts` - Added silence poems

## Future Enhancements

### Layer Unlocking
The unlock system is designed to scale. To unlock entire layers:
1. Add `unlock_type` and `unlock_date` to layer metadata
2. Check layer unlock status in `App.tsx` before rendering
3. Use same `isLetterUnlocked()` utility for consistency

### Custom Poems Per Layer
Modify `silencePoems` in content.ts to include `layer` property and filter by current layer in `SilenceReward.tsx`

### More Interactive Features
- Letter reactions (heart, star)
- Reply functionality
- Photo attachments in letters
