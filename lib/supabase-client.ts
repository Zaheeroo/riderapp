'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabase as supabaseDirectClient } from './supabase';

// Client component Supabase client - this will use cookies and browser environment
export const supabaseClient = createClientComponentClient();

// For direct API access (not using cookies)
export const supabaseDirect = supabaseDirectClient; 