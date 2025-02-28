import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET all customers
export async function GET(request: Request) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get all customers from the customers table
    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Add preferences to match the UI expectations
    const customersWithPreferences = customers.map(customer => ({
      ...customer,
      preferences: {
        language: 'English',
        currency: 'USD',
        notifications: 'Email'
      }
    }));

    return NextResponse.json(customersWithPreferences);
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 