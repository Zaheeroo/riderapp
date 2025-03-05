import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Define valid status transitions
const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

// PATCH to update ride status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { rideId, status } = body;

    if (!rideId || !status) {
      return NextResponse.json({ error: 'Ride ID and status are required' }, { status: 400 });
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // First get the current ride status
    const { data: currentRide, error: fetchError } = await supabase
      .from('rides')
      .select('status')
      .eq('id', rideId)
      .single();

    if (fetchError) {
      console.error('Error fetching ride:', fetchError);
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    // Prevent updating completed or cancelled rides
    if (currentRide.status === 'Completed' || currentRide.status === 'Cancelled') {
      return NextResponse.json({ error: 'Cannot update completed or cancelled rides' }, { status: 400 });
    }

    // Update the ride status
    const { data, error } = await supabase
      .from('rides')
      .update({ status })
      .eq('id', rideId)
      .select(`
        *,
        customer:customers(*),
        driver:drivers(*)
      `)
      .single();

    if (error) {
      console.error('Error updating ride status:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 