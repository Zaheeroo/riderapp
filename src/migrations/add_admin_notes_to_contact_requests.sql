-- Add admin_notes column to contact_requests table if it doesn't exist
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT; 