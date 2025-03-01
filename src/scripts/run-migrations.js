// Script to run SQL migrations on Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Running migration: ${path.basename(filePath)}`);
    console.log(`SQL: ${sql}`);
    
    const { error } = await supabase.rpc('setup_rls_policies', { sql });
    
    if (error) {
      console.error(`Error running migration ${path.basename(filePath)}:`, error);
      return false;
    }
    
    console.log(`Migration ${path.basename(filePath)} completed successfully`);
    return true;
  } catch (error) {
    console.error(`Error reading or executing migration ${path.basename(filePath)}:`, error);
    return false;
  }
}

async function main() {
  // Path to migrations directory
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  
  // Get all SQL files in the migrations directory
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => path.join(migrationsDir, file));
  
  console.log(`Found ${migrationFiles.length} migration files`);
  
  // Run migrations in sequence
  let successCount = 0;
  for (const file of migrationFiles) {
    const success = await runMigration(file);
    if (success) successCount++;
  }
  
  console.log(`Completed ${successCount} of ${migrationFiles.length} migrations`);
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 