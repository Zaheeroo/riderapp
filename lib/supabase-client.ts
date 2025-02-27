'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabase as supabaseDirectClient } from './supabase';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a dummy client for non-browser environments
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

// Client component Supabase client - this will use cookies and browser environment
// Only create if we're in a browser environment and required env vars are available
let clientInstance;

if (isBrowser) {
  try {
    // Check if environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      clientInstance = createClientComponentClient();
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