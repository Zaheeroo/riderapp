import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { name, email, phone, password, vehicle } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !password || !vehicle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the user with driver role in metadata
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        user_type: 'driver',
        name,
        phone
      }
    });

    if (userError) {
      console.error('Error creating driver user:', userError);
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    // Create driver profile in the drivers table
    const { error: profileError } = await supabase
      .from('drivers')
      .insert({
        user_id: userData.user.id,
        name,
        email,
        phone,
        status: 'Active',
        vehicle_model: vehicle.model,
        vehicle_year: vehicle.year,
        vehicle_plate: vehicle.plate,
        vehicle_color: vehicle.color,
        rating: 5.0,
        total_rides: 0
      });

    if (profileError) {
      console.error('Error creating driver profile:', profileError);
      
      // If profile creation fails, delete the auth user to maintain consistency
      await supabase.auth.admin.deleteUser(userData.user.id);
      
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Driver created successfully',
      driver: {
        id: userData.user.id,
        email: userData.user.email,
        name,
        phone
      }
    });
  } catch (error: any) {
    console.error('Error creating driver:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 