-- Create drivers table if it doesn't exist
CREATE TABLE IF NOT EXISTS drivers (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  vehicle_model TEXT,
  vehicle_year TEXT,
  vehicle_plate TEXT,
  vehicle_color TEXT,
  rating DECIMAL(3,1) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  rating DECIMAL(3,1) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for drivers
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can view their own profile"
  ON drivers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all driver profiles"
  ON drivers FOR SELECT
  USING (auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Admins can insert driver profiles"
  ON drivers FOR INSERT
  WITH CHECK (auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Admins can update driver profiles"
  ON drivers FOR UPDATE
  USING (auth.jwt() ->> 'user_type' = 'admin');

-- Create RLS policies for customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own profile"
  ON customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all customer profiles"
  ON customers FOR SELECT
  USING (auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Admins can insert customer profiles"
  ON customers FOR INSERT
  WITH CHECK (auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Admins can update customer profiles"
  ON customers FOR UPDATE
  USING (auth.jwt() ->> 'user_type' = 'admin'); 