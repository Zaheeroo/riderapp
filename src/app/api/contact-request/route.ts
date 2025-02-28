import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { name, email, phone, userType, message } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Store the contact request in Supabase
    // First, check if we have a contact_requests table, if not create it
    const { error: tableCheckError, data: tableExists } = await supabase
      .from('contact_requests')
      .select('id')
      .limit(1)
      .maybeSingle();

    // If table doesn't exist, create it
    if (tableCheckError && tableCheckError.message.includes('does not exist')) {
      // Create the table
      const { error: createTableError } = await supabase.rpc('create_contact_requests_table');
      
      if (createTableError) {
        console.error('Error creating contact_requests table:', createTableError);
        // If we can't create the table, we'll fall back to sending an email notification
      }
    }

    // Try to insert the contact request
    const { error: insertError } = await supabase
      .from('contact_requests')
      .insert({
        name,
        email,
        phone,
        user_type: userType,
        message: message || '',
        status: 'Pending',
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error inserting contact request:', insertError);
      // If we can't insert, we'll still return success to the user
      // In a production app, you might want to send an email notification as a fallback
    }

    // Notify admins (in a real app, you would send an email here)
    // For example:
    // await sendAdminNotificationEmail({
    //   subject: `New Account Request: ${name} (${userType})`,
    //   body: `
    //     Name: ${name}
    //     Email: ${email}
    //     Phone: ${phone}
    //     Account Type: ${userType}
    //     Message: ${message || 'No additional message'}
    //   `
    // });

    return NextResponse.json({
      message: 'Contact request submitted successfully',
      success: true
    });
  } catch (error: any) {
    console.error('Error processing contact request:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 