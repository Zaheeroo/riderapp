import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// PATCH to update ride details by driver
export async function PATCH(request: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { rideId, driverId, updates } = body;

    if (!rideId || !driverId) {
      return NextResponse.json({ error: 'Ride ID and driver ID are required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // First verify that this ride belongs to the driver
    const { data: ride, error: fetchError } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .eq('driver_id', driverId)
      .single();

    if (fetchError || !ride) {
      console.error('Error fetching ride:', fetchError);
      return NextResponse.json({ error: 'Ride not found or unauthorized' }, { status: 404 });
    }

    // Check if ride can be edited (not completed or cancelled)
    if (ride.status === 'Completed' || ride.status === 'Cancelled') {
      return NextResponse.json({ error: 'Cannot update completed or cancelled rides' }, { status: 400 });
    }

    // Filter updates to only allow specific fields
    const allowedFields = ['current_location', 'estimated_arrival_time', 'driver_notes'];
    const filteredUpdates: any = {};
    
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    // If ride is in progress, only allow updating current_location and estimated_arrival_time
    if (ride.status === 'In Progress') {
      delete filteredUpdates.driver_notes;
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Update the ride with filtered updates
    const { data: updatedRide, error: updateError } = await supabase
      .from('rides')
      .update(filteredUpdates)
      .eq('id', rideId)
      .eq('driver_id', driverId)
      .select(`
        *,
        customer:customers(*),
        driver:drivers(*)
      `)
      .single();

    if (updateError) {
      console.error('Error updating ride:', updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ data: updatedRide });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 