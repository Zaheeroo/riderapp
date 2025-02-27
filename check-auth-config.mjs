import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkConfig() {
  try {
    // Get auth settings
    const { data, error } = await supabase
      .from('auth.config')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching auth config:', error)
      return
    }

    console.log('Auth Configuration:', data)

    // Get CORS settings
    const { data: settings, error: settingsError } = await supabase
      .from('auth.settings')
      .select('*')
      .single()

    if (settingsError) {
      console.error('Error fetching auth settings:', settingsError)
      return
    }

    console.log('Auth Settings:', settings)
  } catch (error) {
    console.error('Error:', error)
  }
}

checkConfig() 