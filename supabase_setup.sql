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

-- Sample letters (optional - can be edited/deleted)
INSERT INTO letters (letter_key, title, content, unlock_type, unlock_date, position_order) VALUES
  ('letter_welcome', 'Welcome to Your Journey', 'This letter is available immediately to greet you.', 'relative', '0', 1),
  ('letter_7days', 'Seven Days Later', 'This letter unlocks 7 days after your first visit.', 'relative', '7', 2),
  ('letter_future', 'A Future Promise', 'This letter will be ready on a special date.', 'absolute', '2026-01-14', 3)
ON CONFLICT DO NOTHING;
