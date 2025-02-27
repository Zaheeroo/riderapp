import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yrlmworxjpihnwiapjnm.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybG13b3J4anBpaG53aWFwam5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDUyMzAzNiwiZXhwIjoyMDU2MDk5MDM2fQ.fhIKYeu9vx_xddRUMvipuWcBzfI5L_Gqm7Et_WeT31U'

async function testAuthAdmin() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Test 1: Create a test user with admin privileges
    console.log('Test 1: Creating test user with admin...')
    const testEmail = 'test.admin@example.com'
    const testPassword = 'TestAdmin123!@#'
    
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        user_type: 'customer'
      }
    })

    if (createError) {
      console.error('User creation Error:', createError)
    } else {
      console.log('User creation successful:', {
        user: userData.user.email,
        id: userData.user.id,
        metadata: userData.user.user_metadata
      })
    }

    // Test 2: List all users to check configuration
    console.log('\nTest 2: Listing users...')
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('List users Error:', listError)
    } else {
      console.log('Users:', users.map(u => ({
        email: u.email,
        confirmed: u.email_confirmed_at ? 'Yes' : 'No',
        lastSignIn: u.last_sign_in_at,
        metadata: u.user_metadata
      })))
    }

  } catch (error) {
    console.error('Test failed:', error)
  }
}

testAuthAdmin() 