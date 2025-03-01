import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { generateSecurePassword } from '@/utils/passwordGenerator';
import { sendWelcomeEmail } from '@/utils/emailService';

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
      console.error('Error fetching contact request:', JSON.stringify(fetchError));
      return NextResponse.json({ error: 'Failed to fetch contact request details' }, { status: 500 });
    }
    
    console.log(`Found contact request with ID ${id}:`, JSON.stringify(contactRequest));
    
    // Update contact request status
    console.log(`Attempting to update contact request status to: ${status}`);
    try {
      const { error: updateError } = await supabase
        .from('contact_requests')
        .update({
          status,
          admin_notes: adminNotes || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (updateError) {
        console.error('Error updating contact request:', JSON.stringify(updateError));
        
        // Check if the error is about the admin_notes column not existing
        if (updateError.message && updateError.message.includes('admin_notes')) {
          console.log('admin_notes column not found, trying update without it');
          
          // Try updating without the admin_notes column
          const { error: retryError } = await supabase
            .from('contact_requests')
            .update({
              status,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);
            
          if (retryError) {
            console.error('Error on retry update:', JSON.stringify(retryError));
            return NextResponse.json({ error: `Failed to update contact request: ${retryError.message}` }, { status: 500 });
          }
        } else {
          return NextResponse.json({ error: `Failed to update contact request: ${updateError.message}` }, { status: 500 });
        }
      }
      
      console.log(`Successfully updated contact request ${id} to status: ${status}`);
    } catch (error: any) {
      console.error('Unexpected error during update:', error);
      return NextResponse.json({ error: `Unexpected error: ${error.message}` }, { status: 500 });
    }
    
    // If approved and createAccount is true, create a new user account
    if (status === 'approved' && createAccount) {
      try {
        // Generate a secure but legible password
        const securePassword = generateSecurePassword();
        
        console.log(`Attempting to create user for ${contactRequest.email} with user type ${userType}`);
        
        // Check if user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('email', contactRequest.email)
          .maybeSingle();
          
        if (checkError) {
          console.error('Error checking for existing user:', checkError);
        }
        
        if (existingUser) {
          throw new Error(`User with email ${contactRequest.email} already exists`);
        }
        
        // Create auth user with detailed error logging
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: contactRequest.email,
          password: securePassword,
          email_confirm: true,
          user_metadata: {
            name: contactRequest.name,
            phone: contactRequest.phone,
            user_type: userType
          }
        });
        
        if (authError) {
          console.error('Detailed auth error:', JSON.stringify(authError));
          throw new Error(`Auth error: ${authError.message}`);
        }
        
        if (!authUser || !authUser.user) {
          throw new Error('User creation succeeded but no user was returned');
        }
        
        console.log(`Auth user created with ID: ${authUser.user.id}`);
        
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
            console.error('Error creating driver profile:', JSON.stringify(driverError));
            // If profile creation fails, delete the auth user to maintain consistency
            await supabase.auth.admin.deleteUser(authUser.user.id);
            throw new Error(`Failed to create driver profile: ${driverError.message}`);
          }
          
          console.log(`Driver profile created for user ID: ${authUser.user.id}`);
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
            console.error('Error creating customer profile:', JSON.stringify(customerError));
            // If profile creation fails, delete the auth user to maintain consistency
            await supabase.auth.admin.deleteUser(authUser.user.id);
            throw new Error(`Failed to create customer profile: ${customerError.message}`);
          }
          
          console.log(`Customer profile created for user ID: ${authUser.user.id}`);
        }
        
        // Add user to users table with role
        try {
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
            console.error('Error setting user role:', JSON.stringify(userRoleError));
            
            // If the error is about the users table not existing, we can continue
            // The user has been created in auth and in the appropriate profile table
            if (userRoleError.message && (
                userRoleError.message.includes('relation "users" does not exist') ||
                userRoleError.message.includes('column "role" of relation "users" does not exist')
              )) {
              console.log('Users table or role column not found, but user was created successfully');
            } else {
              throw new Error(userRoleError.message || 'Failed to set user role');
            }
          }
        } catch (roleError: any) {
          console.error('Error setting user role:', roleError);
          // We don't want to fail the entire operation if just the role setting fails
          // The user has been created in auth and in the appropriate profile table
          console.log('Continuing despite role setting error');
        }
        
        // Send welcome email with login credentials
        try {
          const emailResult = await sendWelcomeEmail(
            contactRequest.email,
            contactRequest.name,
            securePassword,
            userType
          );
          
          if (emailResult.error) {
            console.warn(`Email sent with errors: ${emailResult.error}`);
          } else {
            console.log(`Welcome email sent to ${contactRequest.email}`);
          }
        } catch (emailError: any) {
          console.error('Error sending welcome email:', emailError);
          // Don't fail the operation if email sending fails
          console.log('Continuing despite email sending error');
        }
        
        // Always log the password for admin reference in case email fails
        console.log(`IMPORTANT: User account created for ${contactRequest.name} with password: ${securePassword}`);
        
        console.log(`Created user account for ${contactRequest.name} with secure password`);
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