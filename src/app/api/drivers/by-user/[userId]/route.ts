import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(
  request: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = await context.params;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // First verify that the user exists and has a driver role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, role, email')
      .eq('id', userId)
      .maybeSingle();
    
    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    if (!userData) {
      console.error("User not found in users table:", userId);
      return NextResponse.json(
        { error: "User profile not found. Please complete your profile setup." },
        { status: 404 }
      );
    }

    if (userData.role !== 'driver') {
      console.error("User is not a driver:", userId);
      return NextResponse.json(
        { error: "User is not authorized as a driver" },
        { status: 403 }
      );
    }
    
    // Get driver profile by user_id
    const { data: driverData, error: driverError } = await supabase
      .from("drivers")
      .select(`
        id,
        user_id,
        name,
        email,
        phone,
        status,
        vehicle_model,
        vehicle_year,
        vehicle_plate,
        vehicle_color,
        rating,
        total_rides,
        created_at,
        updated_at
      `)
      .eq("user_id", userId)
      .maybeSingle();
    
    if (driverError) {
      console.error("Error fetching driver:", driverError);
      return NextResponse.json(
        { error: "Failed to fetch driver profile" },
        { status: 500 }
      );
    }

    if (!driverData) {
      console.error("Driver profile not found for user:", userId);
      return NextResponse.json(
        { error: "Driver profile not found. Please complete your driver registration." },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      data: {
        ...driverData,
        user: {
          id: userData.id,
          email: userData.email,
          role: userData.role
        }
      }
    });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 