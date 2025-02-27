import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/"/g, '')
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/"/g, '')

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

console.log('Using URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkSettings() {
  try {
    // Try to get project settings
    const { data: settings, error: settingsError } = await supabase
      .from('_config')
      .select('*')

    if (settingsError) {
      console.error('Error fetching settings:', settingsError)
    } else {
      console.log('Project settings:', settings)
    }

    // Try to get auth config
    const { data: authData, error: authError } = await supabase
      .from('auth')
      .select('config')

    if (authError) {
      console.error('Error fetching auth config:', authError)
    } else {
      console.log('Auth config:', authData)
    }

    // Try to get CORS settings
    const { data: corsData, error: corsError } = await supabase
      .rpc('get_cors_settings')

    if (corsError) {
      console.error('Error fetching CORS settings:', corsError)
    } else {
      console.log('CORS settings:', corsData)
    }

  } catch (error) {
    console.error('Error:', error.message)
  }
}

checkSettings() 