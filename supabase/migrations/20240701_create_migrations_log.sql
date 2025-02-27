-- Create migrations log table if it doesn't exist
CREATE TABLE IF NOT EXISTS _migrations_log (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS but allow all operations for service role
ALTER TABLE _migrations_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do all operations on migrations log"
  ON _migrations_log
  USING (true)
  WITH CHECK (true); 