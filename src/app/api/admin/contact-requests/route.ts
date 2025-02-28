import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: Request) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Fetch contact requests
    const { data: contactRequests, error: fetchError } = await supabase
      .from('contact_requests')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (fetchError) {
      console.error('Error fetching contact requests:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch contact requests' }, { status: 500 });
    }
    
    return NextResponse.json({ contactRequests });
  } catch (error: any) {
    console.error('Error in contact requests API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get request data
    const { id, status, adminNotes, createAccount, userType } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get the contact request details
    const { data: contactRequest, error: fetchError } = await supabase
      .from('contact_requests')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError || !contactRequest) {
      console.error('Error fetching contact request:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch contact request details' }, { status: 500 });
    }
    
    // Update contact request status
    const { error: updateError } = await supabase
      .from('contact_requests')
      .update({
        status,
        admin_notes: adminNotes || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (updateError) {
      console.error('Error updating contact request:', updateError);
      return NextResponse.json({ error: 'Failed to update contact request' }, { status: 500 });
    }
    
    // If approved and createAccount is true, create a new user account
    if (status === 'approved' && createAccount) {
      try {
        // Generate a random password
        const tempPassword = Math.random().toString(36).slice(-8);
        
        // Create auth user
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: contactRequest.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            name: contactRequest.name,
            phone: contactRequest.phone,
            user_type: userType
          }
        });
        
        if (authError || !authUser.user) {
          throw new Error(authError?.message || 'Failed to create user account');
        }
        
        // Add user to the appropriate table based on user type
        if (userType === 'driver') {
          const { error: driverError } = await supabase
            .from('drivers')
            .insert({
              user_id: authUser.user.id,
              name: contactRequest.name,
              email: contactRequest.email,
              phone: contactRequest.phone,
              status: 'Active',
              // Add default vehicle details for drivers
              vehicle_model: 'Not specified',
              vehicle_year: 'Not specified',
              vehicle_plate: 'Not specified',
              vehicle_color: 'Not specified',
              rating: 5.0,
              total_rides: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (driverError) {
            console.error('Error creating driver profile:', driverError);
            // If profile creation fails, delete the auth user to maintain consistency
            await supabase.auth.admin.deleteUser(authUser.user.id);
            throw new Error(driverError.message || 'Failed to create driver profile');
          }
        } else if (userType === 'customer') {
          const { error: customerError } = await supabase
            .from('customers')
            .insert({
              user_id: authUser.user.id,
              name: contactRequest.name,
              email: contactRequest.email,
              phone: contactRequest.phone,
              status: 'Active',
              // Add default values for customers
              location: '',
              rating: 5.0,
              total_rides: 0,
              total_spent: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            
          if (customerError) {
            console.error('Error creating customer profile:', customerError);
            // If profile creation fails, delete the auth user to maintain consistency
            await supabase.auth.admin.deleteUser(authUser.user.id);
            throw new Error(customerError.message || 'Failed to create customer profile');
          }
        }
        
        // Add user to users table with role
        const { error: userRoleError } = await supabase
          .from('users')
          .insert({
            id: authUser.user.id,
            email: contactRequest.email,
            role: userType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (userRoleError) {
          throw new Error(userRoleError.message || 'Failed to set user role');
        }
        
        // In a real app, you would send an email with the temporary password
        console.log(`Created user account for ${contactRequest.name} with temp password: ${tempPassword}`);
      } catch (error: any) {
        console.error('Error creating user account:', error);
        return NextResponse.json({ 
          error: `Contact request updated but failed to create user account: ${error.message}` 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ 
      success: true,
      message: status === 'approved' && createAccount 
        ? 'Contact request approved and user account created' 
        : 'Contact request updated'
    });
  } catch (error: any) {
    console.error('Error in contact requests API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 