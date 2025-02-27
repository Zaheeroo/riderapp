import fetch from 'node-fetch'

const projectRef = 'yrlmworxjpihnwiapjnm'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/"/g, '')

if (!supabaseKey) {
  console.error('Missing service role key')
  process.exit(1)
}

async function checkConfig() {
  try {
    // Check auth settings
    const authResponse = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!authResponse.ok) {
      throw new Error(`HTTP error! status: ${authResponse.status}`)
    }

    const authConfig = await authResponse.json()
    console.log('Auth Configuration:', authConfig)

    // Check project settings
    const settingsResponse = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!settingsResponse.ok) {
      throw new Error(`HTTP error! status: ${settingsResponse.status}`)
    }

    const projectSettings = await settingsResponse.json()
    console.log('Project Settings:', projectSettings)

  } catch (error) {
    console.error('Error:', error)
  }
}

checkConfig() 