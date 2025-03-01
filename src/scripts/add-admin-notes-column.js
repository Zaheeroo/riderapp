// Script to add admin_notes column to contact_requests table
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addAdminNotesColumn() {
  try {
    console.log('Adding admin_notes column to contact_requests table...');
    
    // Execute raw SQL query
    const { error } = await supabase.rpc('setup_rls_policies', { 
      sql: 'ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS admin_notes TEXT;' 
    });
    
    if (error) {
      console.error('Error adding admin_notes column:', error);
      return false;
    }
    
    console.log('Successfully added admin_notes column to contact_requests table');
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

async function main() {
  const success = await addAdminNotesColumn();
  if (success) {
    console.log('Migration completed successfully');
  } else {
    console.error('Migration failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 