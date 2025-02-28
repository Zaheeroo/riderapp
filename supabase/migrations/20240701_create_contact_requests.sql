-- Create contact_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS contact_requests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  user_type TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS but allow all operations for service role
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contact_requests
CREATE POLICY "Admins can view all contact requests"
  ON contact_requests FOR SELECT
  USING (auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Admins can insert contact requests"
  ON contact_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update contact requests"
  ON contact_requests FOR UPDATE
  USING (auth.jwt() ->> 'user_type' = 'admin');

-- Create a stored procedure to create the contact_requests table
CREATE OR REPLACE FUNCTION create_contact_requests_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS contact_requests (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    user_type TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Enable RLS
  ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

  -- Create policies if they don't exist
  -- Check if the select policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contact_requests' 
    AND policyname = 'Admins can view all contact requests'
  ) THEN
    CREATE POLICY "Admins can view all contact requests"
      ON contact_requests FOR SELECT
      USING (auth.jwt() ->> 'user_type' = 'admin');
  END IF;

  -- Check if the insert policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contact_requests' 
    AND policyname = 'Admins can insert contact requests'
  ) THEN
    CREATE POLICY "Admins can insert contact requests"
      ON contact_requests FOR INSERT
      WITH CHECK (true);
  END IF;

  -- Check if the update policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contact_requests' 
    AND policyname = 'Admins can update contact requests'
  ) THEN
    CREATE POLICY "Admins can update contact requests"
      ON contact_requests FOR UPDATE
      USING (auth.jwt() ->> 'user_type' = 'admin');
  END IF;
END;
$$; 