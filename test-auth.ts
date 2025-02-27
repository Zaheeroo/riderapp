import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yrlmworxjpihnwiapjnm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybG13b3J4anBpaG53aWFwam5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MjMwMzYsImV4cCI6MjA1NjA5OTAzNn0.d0BlqS_M3Jqj0oDxlmLEgXJZtyNUBly3jfTY3M0ROL4'

async function testAuth() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // Test 1: Get session
    console.log('Test 1: Checking session...')
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Session Error:', sessionError)
    } else {
      console.log('Session check successful:', sessionData)
    }

    // Test 2: Create a test user
    console.log('\nTest 2: Creating test user...')
    const testEmail = `test${Date.now()}@example.com`
    const testPassword = 'Test123!@#'
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          user_type: 'customer'
        }
      }
    })

    if (signUpError) {
      console.error('Sign up Error:', signUpError)
    } else {
      console.log('Sign up successful:', {
        user: signUpData.user?.email,
        session: signUpData.session ? 'Session established' : 'No session'
      })
    }

    // Test 3: Try to sign in with the new user
    console.log('\nTest 3: Attempting sign in with new user...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (signInError) {
      console.error('Sign in Error:', signInError)
    } else {
      console.log('Sign in successful:', {
        user: signInData.user?.email,
        session: signInData.session ? 'Session established' : 'No session'
      })
    }

  } catch (error) {
    console.error('Test failed:', error)
  }
}

testAuth() 