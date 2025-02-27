// Direct Supabase client (no cookies)
export { supabase } from './supabase';

// Client-side Supabase client (with cookies)
export { supabaseClient, supabaseDirect } from './supabase-client';

// Server-side exports - only use these in server components or API routes
// Do not import these in client components
export { createServerSupabaseClient, getSession, getUserDetails } from './supabase-server'; 