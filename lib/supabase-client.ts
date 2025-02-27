'use client';

// Direct import of createClient to have more control over initialization
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseDirectClient } from './supabase';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a dummy client for non-browser environments or when env vars are missing
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
    select: () => Promise.resolve({ data: null, error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  }),
};

// Create a client instance with proper error handling
let clientInstance;

if (isBrowser) {
  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      // Create client directly instead of using createClientComponentClient
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      console.log('Supabase client initialized successfully');
    } else {
      console.warn('Supabase environment variables are missing. Using dummy client.');
      clientInstance = dummyClient;
    }
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    clientInstance = dummyClient;
  }
} else {
  clientInstance = dummyClient;
}

export const supabaseClient = clientInstance;

// For direct API access (not using cookies)
export const supabaseDirect = supabaseDirectClient || dummyClient; 