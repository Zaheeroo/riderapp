-- Create contact_requests table
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('driver', 'customer', 'general')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all contact requests
CREATE POLICY admin_select_contact_requests ON contact_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create policy for admins to update contact requests
CREATE POLICY admin_update_contact_requests ON contact_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Create policy for anyone to insert contact requests
CREATE POLICY insert_contact_requests ON contact_requests
  FOR INSERT
  WITH CHECK (true);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS contact_requests_created_at_idx ON contact_requests (created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS contact_requests_status_idx ON contact_requests (status);

-- Create index on request_type for filtering
CREATE INDEX IF NOT EXISTS contact_requests_type_idx ON contact_requests (request_type); 