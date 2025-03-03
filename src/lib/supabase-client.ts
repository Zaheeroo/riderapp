'use client';

// Direct import of createClient to have more control over initialization
import { createClient } from '@supabase/supabase-js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a more complete dummy client for non-browser environments or when env vars are missing
const dummyClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signUp: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: (table: string) => {
    const selectBuilder = (query?: string) => {
      const result = {
        data: [],
        error: null,
        order: (column: string, { ascending }: { ascending: boolean }) => {
          return Promise.resolve({ data: [], error: null });
        },
        eq: (column: string, value: any) => {
          return {
            select: (query?: string) => Promise.resolve({ data: [], error: null }),
            single: () => Promise.resolve({ data: null, error: null })
          };
        },
        single: () => Promise.resolve({ data: null, error: null })
      };
      return result;
    };

    return {
      select: selectBuilder,
      insert: (data: any) => ({
        select: (query?: string) => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: (query?: string) => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: null, error: null })
      }),
    };
  }
};

// Create a client instance with proper error handling
let clientInstance;

try {
  if (isBrowser && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log('Initializing Supabase client with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    clientInstance = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
      }
    );
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Using dummy client - environment variables missing or not in browser');
    clientInstance = dummyClient;
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  clientInstance = dummyClient;
}

export const supabaseClient = clientInstance; 