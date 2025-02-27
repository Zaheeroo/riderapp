import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Check if we're in a build/SSG environment
const isBuildTime = process.env.NODE_ENV === 'production' && typeof process.env.NEXT_PUBLIC_SUPABASE_URL === 'undefined';

// Create a dummy client for build time
const dummyServerClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  },
  from: () => ({
    select: async () => ({ data: null, error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
};

// This function should only be called in server components or API routes
export const createServerSupabaseClient = () => {
  // If we're in build time, return the dummy client
  if (isBuildTime) {
    return dummyServerClient;
  }

  try {
    return createServerComponentClient({ cookies });
  } catch (error) {
    console.error('Error creating server Supabase client:', error);
    return dummyServerClient;
  }
};

export async function getSession() {
  try {
    const supabase = createServerSupabaseClient();
    
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getUserDetails() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error('Error getting user details:', error);
    return null;
  }
} 