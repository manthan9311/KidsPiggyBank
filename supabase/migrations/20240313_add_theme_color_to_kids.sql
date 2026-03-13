-- Add theme_color column to kids table
ALTER TABLE kids ADD COLUMN IF NOT EXISTS theme_color text DEFAULT 'pink';
