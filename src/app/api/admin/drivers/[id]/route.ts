import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// GET a single driver by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;

    // Get driver from the drivers table
    const { data: driver, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching driver:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    return NextResponse.json(driver);
  } catch (error: any) {
    console.error('Error fetching driver:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// PATCH to update a driver
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;
    const updates = await request.json();

    // Update driver in the drivers table
    const { data, error } = await supabase
      .from('drivers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating driver:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error updating driver:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// DELETE a driver
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { id } = params;

    // First get the driver to get the user_id
    const { data: driver, error: fetchError } = await supabase
      .from('drivers')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching driver:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }

    // Delete the driver from the drivers table
    const { error: deleteError } = await supabase
      .from('drivers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting driver:', deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Delete the user from auth.users
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(
      driver.user_id
    );

    if (authDeleteError) {
      console.error('Error deleting auth user:', authDeleteError);
      return NextResponse.json({ error: authDeleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Driver deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting driver:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 