import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from './database.types';
import { createClient as createClientBase } from '@supabase/supabase-js';

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClientBase<Database>(supabaseUrl, supabaseKey);
};

export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies });
}; 