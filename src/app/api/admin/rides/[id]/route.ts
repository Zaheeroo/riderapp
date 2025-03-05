import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET a specific ride by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  try {
    // Await the params object before destructuring
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Ride ID is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the ride with customer and driver information
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        customer:customers(*),
        driver:drivers(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching ride:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PATCH to update a ride
export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  try {
    // Await the params object before destructuring
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: 'Ride ID is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const updates = await request.json();
    
    // Update the ride
    const { data, error } = await supabase
      .from('rides')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        driver:drivers(*)
      `)
      .single();

    if (error) {
      console.error('Error updating ride:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 