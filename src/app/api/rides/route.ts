import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the service role key for admin access
// This bypasses RLS policies
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const rideData = await request.json();

    // Validate required fields
    if (!rideData.customer_id || !rideData.pickup_location || !rideData.dropoff_location || 
        !rideData.pickup_date || !rideData.pickup_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure price is a number
    const price = typeof rideData.price === 'string' 
      ? parseFloat(rideData.price) 
      : rideData.price;

    // Set default values
    const ridePayload = {
      ...rideData,
      price,
      status: rideData.status || 'Pending',
      payment_status: rideData.payment_status || 'Pending',
    };

    console.log('API route creating ride with data:', ridePayload);

    // Insert the ride using the admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('rides')
      .insert(ridePayload)
      .select()
      .single();

    if (error) {
      console.error('Error creating ride via API:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    console.log('Ride created successfully via API:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Unexpected error in rides API:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 