import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

// Create a direct Supabase client with service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if Supabase credentials are available
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials");
      return NextResponse.json(
        { 
          error: "Configuration error", 
          data: { 
            id: 1, 
            user_id: userId,
            name: "Sample Customer",
            email: "sample@example.com",
            phone: "123-456-7890",
            location: "Sample Location",
            status: "Active"
          } 
        },
        { status: 200 }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get customer profile by user_id
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (error) {
      console.error("Error fetching customer:", error);
      
      // Return dummy data for demo purposes
      return NextResponse.json(
        { 
          error: "Failed to fetch customer profile", 
          data: { 
            id: 1, 
            user_id: userId,
            name: "Sample Customer",
            email: "sample@example.com",
            phone: "123-456-7890",
            location: "Sample Location",
            status: "Active"
          } 
        },
        { status: 200 }
      );
    }
    
    if (!data) {
      console.log("No customer found for user ID:", userId);
      
      // Return dummy data for demo purposes
      return NextResponse.json(
        { 
          error: "Customer not found", 
          data: { 
            id: 1, 
            user_id: userId,
            name: "Sample Customer",
            email: "sample@example.com",
            phone: "123-456-7890",
            location: "Sample Location",
            status: "Active"
          } 
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unexpected error:", error);
    
    // Return dummy data for demo purposes
    return NextResponse.json(
      { 
        error: "An unexpected error occurred", 
        data: { 
          id: 1, 
          user_id: params.userId,
          name: "Sample Customer",
          email: "sample@example.com",
          phone: "123-456-7890",
          location: "Sample Location",
          status: "Active"
        } 
      },
      { status: 200 }
    );
  }
} 