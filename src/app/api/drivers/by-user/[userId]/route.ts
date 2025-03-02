import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

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

    const supabase = createClient();
    
    // Get driver profile by user_id
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (error) {
      console.error("Error fetching driver:", error);
      return NextResponse.json(
        { error: "Failed to fetch driver profile" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 