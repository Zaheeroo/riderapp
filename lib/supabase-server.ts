import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerSupabaseClient = () => 
  createServerComponentClient({ cookies });

export async function getSession() {
  const supabase = createServerSupabaseClient();
  try {
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
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  
  return session.user;
} 