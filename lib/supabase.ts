import { createClient } from '@supabase/supabase-js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Default to empty strings during build time, will be replaced with actual values at runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client for build time
const dummyClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({ data: null, error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
  }),
};

// Only create the client if we have the required values
let supabaseInstance;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.warn('Supabase environment variables are missing. Using dummy client.');
    supabaseInstance = dummyClient;
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  supabaseInstance = dummyClient;
}

export const supabase = supabaseInstance; 