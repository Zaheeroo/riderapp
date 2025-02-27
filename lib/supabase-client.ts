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

try {
  if (isBrowser && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    clientInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          storage: {
            getItem: (key) => {
              try {
                if (typeof window !== 'undefined') {
                  return Promise.resolve(localStorage.getItem(key));
                }
                return Promise.resolve(null);
              } catch {
                return Promise.resolve(null);
              }
            },
            setItem: (key, value) => {
              try {
                if (typeof window !== 'undefined') {
                  localStorage.setItem(key, value);
                }
                return Promise.resolve();
              } catch {
                return Promise.resolve();
              }
            },
            removeItem: (key) => {
              try {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem(key);
                }
                return Promise.resolve();
              } catch {
                return Promise.resolve();
              }
            },
          },
        },
        global: {
          headers: {
            'X-Client-Info': 'supabase-js-web'
          }
        }
      }
    );
  } else {
    console.warn('Using dummy client - environment variables missing or not in browser');
    clientInstance = dummyClient;
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  clientInstance = dummyClient;
}

export const supabaseClient = clientInstance;

// For direct API access (not using cookies)
export const supabaseDirect = supabaseDirectClient || dummyClient; 