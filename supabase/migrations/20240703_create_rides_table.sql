-- Create rides table
CREATE TABLE IF NOT EXISTS rides (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Confirmed, In Progress, Completed, Cancelled
  trip_type TEXT NOT NULL, -- Airport Transfer, Guided Tour, Point to Point Transfer, Hourly Charter
  vehicle_type TEXT NOT NULL,
  passengers INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Paid, Partial
  special_requirements TEXT,
  admin_notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for rides
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can view all rides"
  ON rides FOR SELECT
  USING (auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Admins can insert rides"
  ON rides FOR INSERT
  WITH CHECK (auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Admins can update rides"
  ON rides FOR UPDATE
  USING (auth.jwt() ->> 'user_type' = 'admin');

CREATE POLICY "Admins can delete rides"
  ON rides FOR DELETE
  USING (auth.jwt() ->> 'user_type' = 'admin');

-- Customers can view their own rides
CREATE POLICY "Customers can view their own rides"
  ON rides FOR SELECT
  USING (
    auth.jwt() ->> 'user_type' = 'customer' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = rides.customer_id
      AND customers.user_id = auth.uid()
    )
  );

-- Customers can create rides
CREATE POLICY "Customers can insert rides"
  ON rides FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'user_type' = 'customer' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = rides.customer_id
      AND customers.user_id = auth.uid()
    ) AND
    created_by = auth.uid()
  );

-- Customers can update their own rides (only if not completed or cancelled)
CREATE POLICY "Customers can update their own rides"
  ON rides FOR UPDATE
  USING (
    auth.jwt() ->> 'user_type' = 'customer' AND
    EXISTS (
      SELECT 1 FROM customers
      WHERE customers.id = rides.customer_id
      AND customers.user_id = auth.uid()
    ) AND
    status NOT IN ('Completed', 'Cancelled')
  );

-- Drivers can view rides assigned to them
CREATE POLICY "Drivers can view their assigned rides"
  ON rides FOR SELECT
  USING (
    auth.jwt() ->> 'user_type' = 'driver' AND
    EXISTS (
      SELECT 1 FROM drivers
      WHERE drivers.id = rides.driver_id
      AND drivers.user_id = auth.uid()
    )
  );

-- Drivers can update rides assigned to them (only status)
CREATE POLICY "Drivers can update their assigned rides"
  ON rides FOR UPDATE
  USING (
    auth.jwt() ->> 'user_type' = 'driver' AND
    EXISTS (
      SELECT 1 FROM drivers
      WHERE drivers.id = rides.driver_id
      AND drivers.user_id = auth.uid()
    )
  );

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at timestamp
CREATE TRIGGER update_rides_updated_at
BEFORE UPDATE ON rides
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 