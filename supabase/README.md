# Supabase Database Migrations

This directory contains SQL migrations for the Supabase database.

## Applying Migrations

To apply the migrations, you can use our custom script to view the SQL statements, then execute them in the Supabase SQL editor.

### Using the Migration Script

1. Run the migration script:
   ```bash
   npm run db:migrate
   ```

2. The script will output the SQL statements that need to be executed. Copy each SQL statement and run it in the Supabase SQL Editor.

### Manual Application

1. Log in to the Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of each migration file
4. Paste into the SQL Editor and execute

## Migration Files

- `20240701_create_migrations_log.sql`: Creates the `_migrations_log` table to track applied migrations
- `20240701_create_user_tables.sql`: Creates the `drivers` and `customers` tables with appropriate RLS policies

## Database Schema

### Drivers Table

The `drivers` table stores information about driver users:

- `id`: Auto-incrementing primary key
- `user_id`: UUID reference to the auth.users table
- `name`: Driver's full name
- `email`: Driver's email address
- `phone`: Driver's phone number
- `status`: Driver's status (Active/Inactive)
- `vehicle_model`: Model of the driver's vehicle
- `vehicle_year`: Year of the driver's vehicle
- `vehicle_plate`: License plate of the driver's vehicle
- `vehicle_color`: Color of the driver's vehicle
- `rating`: Driver's rating (1.0-5.0)
- `total_rides`: Total number of rides completed
- `created_at`: Timestamp of when the record was created
- `updated_at`: Timestamp of when the record was last updated

### Customers Table

The `customers` table stores information about customer users:

- `id`: Auto-incrementing primary key
- `user_id`: UUID reference to the auth.users table
- `name`: Customer's full name
- `email`: Customer's email address
- `phone`: Customer's phone number
- `location`: Customer's location/address
- `status`: Customer's status (Active/Inactive)
- `rating`: Customer's rating (1.0-5.0)
- `total_rides`: Total number of rides taken
- `total_spent`: Total amount spent on rides
- `created_at`: Timestamp of when the record was created
- `updated_at`: Timestamp of when the record was last updated 