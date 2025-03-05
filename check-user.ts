import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yrlmworxjpihnwiapjnm.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybG13b3J4anBpaG53aWFwam5tIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDUyMzAzNiwiZXhwIjoyMDU2MDk5MDM2fQ.fhIKYeu9vx_xddRUMvipuWcBzfI5L_Gqm7Et_WeT31U";

const userId = "06f75a0c-67f5-4590-9920-4950ea68a4ec";
const driverId = 10;

async function debugQueries() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log("1. Testing users table query...");
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, role, email')
    .eq('id', userId)
    .maybeSingle();

  console.log("Users query result:", { data: userData, error: userError });

  console.log("\n2. Testing drivers table query...");
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

  console.log("Drivers query result:", { data: driverData, error: driverError });

  console.log("\n3. Testing rides table structure...");
  const { data: ridesData, error: ridesError } = await supabase
    .from("rides")
    .select("*")
    .limit(1);

  console.log("Rides table structure check:", { 
    data: ridesData ? Object.keys(ridesData[0] || {}).join(', ') : null, 
    error: ridesError 
  });

  console.log("\n4. Testing rides query with driver_id...");
  const { data: driverRides, error: driverRidesError } = await supabase
    .from("rides")
    .select(`
      id,
      driver_id,
      user_id,
      pickup_location,
      dropoff_location,
      pickup_date,
      pickup_time,
      price,
      status,
      trip_type,
      feedback,
      created_at,
      updated_at
    `)
    .eq("driver_id", driverId);

  console.log("Driver rides query result:", { data: driverRides, error: driverRidesError });

  // Test the actual API endpoint
  console.log("\n5. Testing the actual API endpoint...");
  try {
    const response = await fetch(`http://localhost:3000/api/driver/rides?driverId=${driverId}`);
    const responseText = await response.text();
    console.log("API Response Status:", response.status);
    console.log("API Response Headers:", response.headers);
    console.log("API Raw Response:", responseText);
    
    try {
      const jsonData = JSON.parse(responseText);
      console.log("API Parsed JSON:", jsonData);
    } catch (e) {
      console.log("Failed to parse response as JSON:", e);
    }
  } catch (error) {
    console.error("Error calling API:", error);
  }
}

debugQueries(); 