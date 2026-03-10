/*
  # Kids Pocket Money Tracker Schema
 
  1. New Tables
    - `kids`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `current_balance` (decimal, default 0)
      - `created_at` (timestamptz, default now)
      
    - `transactions`
      - `id` (uuid, primary key)
      - `kid_id` (uuid, foreign key to kids)
      - `amount` (decimal, not null) - positive for credit, negative for debit
      - `description` (text, not null)
      - `transaction_date` (timestamptz, default now)
      - `created_at` (timestamptz, default now)
      
    - `recurring_transactions`
      - `id` (uuid, primary key)
      - `kid_id` (uuid, foreign key to kids)
      - `amount` (decimal, not null)
      - `description` (text, not null)
      - `frequency` (text, not null) - 'weekly', 'monthly', 'yearly'
      - `day_of_week` (integer) - for weekly (0=Sunday, 6=Saturday)
      - `day_of_month` (integer) - for monthly (1-31)
      - `month` (integer) - for yearly (1-12)
      - `day_of_year` (integer) - for yearly day of month
      - `last_executed` (timestamptz)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now)
      
    - `goals`
      - `id` (uuid, primary key)
      - `kid_id` (uuid, foreign key to kids)
      - `title` (text, not null)
      - `target_amount` (decimal, not null)
      - `is_completed` (boolean, default false)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a personal app, not multi-user)
*/

-- Create kids table
CREATE TABLE IF NOT EXISTS kids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  current_balance decimal(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE kids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to kids"
  ON kids
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kid_id uuid NOT NULL REFERENCES kids(id) ON DELETE CASCADE,
  amount decimal(10, 2) NOT NULL,
  description text NOT NULL,
  transaction_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to transactions"
  ON transactions
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create recurring_transactions table
CREATE TABLE IF NOT EXISTS recurring_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kid_id uuid NOT NULL REFERENCES kids(id) ON DELETE CASCADE,
  amount decimal(10, 2) NOT NULL,
  description text NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'yearly')),
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  day_of_month integer CHECK (day_of_month >= 1 AND day_of_month <= 31),
  month integer CHECK (month >= 1 AND month <= 12),
  day_of_year integer CHECK (day_of_year >= 1 AND day_of_year <= 31),
  last_executed timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to recurring_transactions"
  ON recurring_transactions
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kid_id uuid NOT NULL REFERENCES kids(id) ON DELETE CASCADE,
  title text NOT NULL,
  target_amount decimal(10, 2) NOT NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to goals"
  ON goals
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_kid_id ON transactions(kid_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_recurring_kid_id ON recurring_transactions(kid_id);
CREATE INDEX IF NOT EXISTS idx_goals_kid_id ON goals(kid_id);