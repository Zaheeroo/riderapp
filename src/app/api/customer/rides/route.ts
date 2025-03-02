import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET rides for a specific customer
export async function GET(request: NextRequest) {
  // Get the customer ID from the query parameters
  const url = new URL(request.url);
  const customerId = url.searchParams.get('customerId');

  if (!customerId) {
    return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get all rides for the customer
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        driver:drivers(*)
      `)
      .eq('customer_id', customerId)
      .order('pickup_date', { ascending: true })
      .order('pickup_time', { ascending: true });

    if (error) {
      console.error('Error fetching customer rides:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 