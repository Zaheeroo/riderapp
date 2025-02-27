'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabase as supabaseDirectClient } from './supabase';

// Client component Supabase client
export const supabaseClient = createClientComponentClient();

// For direct API access (not using cookies)
export const supabaseDirect = supabaseDirectClient; 