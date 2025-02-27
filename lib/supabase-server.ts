import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// This function should only be called in server components or API routes
export const createServerSupabaseClient = () => {
  try {
    return createServerComponentClient({ cookies });
  } catch (error) {
    console.error('Error creating server Supabase client:', error);
    return null;
  }
};

export async function getSession() {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) return null;
    
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