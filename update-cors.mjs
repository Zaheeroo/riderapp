import fetch from 'node-fetch'

const projectRef = 'yrlmworxjpihnwiapjnm'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/"/g, '')

if (!supabaseKey) {
  console.error('Missing service role key')
  process.exit(1)
}

const corsSettings = {
  "config": {
    "ALLOW_EMPTY_PASSWORD": false,
    "DISABLE_SIGNUP": false,
    "JWT_EXP": 3600,
    "SITE_URL": "https://riderapp.vercel.app",
    "ADDITIONAL_REDIRECT_URLS": [
      "https://riderapp.vercel.app/**",
      "http://localhost:3000/**"
    ],
    "CORS_ALLOWED_ORIGINS": [
      "http://localhost:3000",
      "https://riderapp.vercel.app"
    ]
  }
}

async function updateSettings() {
  try {
    // Update auth settings using management API
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/auth-config`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(corsSettings)
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${error}`)
    }

    const result = await response.json()
    console.log('Settings updated successfully:', result)

  } catch (error) {
    console.error('Error updating settings:', error)
    // If it's a 401 error, the service role key might not have management API access
    if (error.message.includes('401')) {
      console.log('\nNote: To update settings via API, you need to use a service role key with management API access.')
      console.log('You can find this in your Supabase dashboard under Project Settings > API > Management API settings.')
    }
  }
}

updateSettings() 