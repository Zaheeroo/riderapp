import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET all rides for admin
export async function GET(request: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get all rides with customer and driver information
    const { data, error } = await supabase
      .from('rides')
      .select(`
        *,
        customer:customers(*),
        driver:drivers(*)
      `)
      .order('pickup_date', { ascending: true })
      .order('pickup_time', { ascending: true });

    if (error) {
      console.error('Error fetching rides:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// POST to create a new ride
export async function POST(request: NextRequest) {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['customer_id', 'pickup_location', 'dropoff_location', 'pickup_date', 'pickup_time', 'price', 'status', 'trip_type', 'vehicle_type', 'passengers', 'payment_status'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }
    
    // Get the user ID from the request (in a real app, this would come from auth)
    // For now, we'll use a placeholder user ID
    const userId = 'a4a6c260-92c5-4ee9-b5e0-0d4edeb5f79b'; // Placeholder admin user ID
    
    // Create the ride
    const { data, error } = await supabase
      .from('rides')
      .insert([{
        customer_id: body.customer_id,
        driver_id: body.driver_id || null, // Driver can be optional
        pickup_location: body.pickup_location,
        dropoff_location: body.dropoff_location,
        pickup_date: body.pickup_date,
        pickup_time: body.pickup_time,
        price: body.price,
        status: body.status,
        trip_type: body.trip_type,
        vehicle_type: body.vehicle_type,
        passengers: body.passengers,
        payment_status: body.payment_status,
        special_requirements: body.special_requirements || null,
        admin_notes: body.admin_notes || null,
        created_by: userId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating ride:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get the complete ride data with customer and driver information
    const { data: rideWithRelations, error: fetchError } = await supabase
      .from('rides')
      .select(`
        *,
        customer:customers(*),
        driver:drivers(*)
      `)
      .eq('id', data.id)
      .single();

    if (fetchError) {
      console.error('Error fetching created ride:', fetchError);
      // Still return the created ride even if we couldn't fetch the relations
      return NextResponse.json({ data });
    }

    return NextResponse.json({ data: rideWithRelations });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 