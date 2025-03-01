-- Drop existing policies if they exist
DROP POLICY IF EXISTS admin_select_contact_requests ON contact_requests;
DROP POLICY IF EXISTS admin_update_contact_requests ON contact_requests;

-- Create updated policies that don't rely on the users table
CREATE POLICY admin_select_contact_requests ON contact_requests
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY admin_update_contact_requests ON contact_requests
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin'); 