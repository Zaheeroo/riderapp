import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function PATCH(request: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { rideId, customerId, ...updateData } = body;

    if (!rideId || !customerId) {
      return NextResponse.json({ error: 'Ride ID and customer ID are required' }, { status: 400 });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First, verify that this ride belongs to the customer
    const { data: existingRide, error: verificationError } = await supabase
      .from('rides')
      .select('status, pickup_date, pickup_time')
      .eq('id', rideId)
      .eq('customer_id', customerId)
      .single();

    if (verificationError || !existingRide) {
      return NextResponse.json({ error: 'Ride not found or unauthorized' }, { status: 404 });
    }

    // Check if ride can be edited (not completed or cancelled)
    if (['Completed', 'Cancelled'].includes(existingRide.status)) {
      return NextResponse.json({ error: 'Cannot edit completed or cancelled rides' }, { status: 400 });
    }

    // If ride is in progress, only allow updating special requirements
    if (existingRide.status === 'In Progress') {
      const { special_requirements } = updateData;
      if (Object.keys(updateData).length > 1 || !special_requirements) {
        return NextResponse.json({ error: 'Only special requirements can be updated for rides in progress' }, { status: 400 });
      }
    }

    // Filter out any fields that customers shouldn't be able to update
    const allowedFields = ['pickup_time', 'pickup_date', 'passengers', 'special_requirements'];
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
    );

    // Update the ride
    const { data: updatedRide, error: updateError } = await supabase
      .from('rides')
      .update(filteredUpdateData)
      .eq('id', rideId)
      .eq('customer_id', customerId) // Extra safety check
      .select(`
        *,
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