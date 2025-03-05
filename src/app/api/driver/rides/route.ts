import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get driverId from query params
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driverId');
    
    if (!driverId) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    console.log('Fetching rides for driver:', driverId);

    // First, verify the driver exists
    const { data: driverData, error: driverError } = await supabase
      .from("drivers")
      .select("id")
      .eq("id", driverId)
      .maybeSingle();

    if (driverError) {
      console.error("Error checking driver:", driverError);
      return NextResponse.json(
        { error: "Failed to verify driver" },
        { status: 500 }
      );
    }

    if (!driverData) {
      console.error("Driver not found:", driverId);
      return NextResponse.json(
        { error: "Driver not found" },
        { status: 404 }
      );
    }

    // Get all rides for this driver
    console.log('Querying rides table...');
    const { data: rides, error: ridesError } = await supabase
      .from("rides")
      .select(`
        id,
        driver_id,
        customer_id,
        pickup_location,
        dropoff_location,
        pickup_date,
        pickup_time,
        status,
        trip_type,
        vehicle_type,
        passengers,
        price,
        payment_status,
        special_requirements,
        admin_notes,
        created_at,
        updated_at
      `)
      .eq("driver_id", driverId)
      .order('pickup_date', { ascending: true });
    
    if (ridesError) {
      console.error("Error fetching rides:", ridesError);
      return NextResponse.json(
        { error: `Failed to fetch rides: ${ridesError.message}` },
        { status: 500 }
      );
    }

    console.log('Successfully fetched rides:', rides);
    return NextResponse.json({ data: rides });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 