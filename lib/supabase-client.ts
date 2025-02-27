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
// Only create if we're in a browser environment
export const supabaseClient = isBrowser 
  ? createClientComponentClient()
  : dummyClient;

// For direct API access (not using cookies)
export const supabaseDirect = supabaseDirectClient || dummyClient; 