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
    
    // Get request data
    const { name, email, phone, message, requestType } = await request.json();
    
    // Validate required fields
    if (!name || !email || !message || !requestType) {
      return NextResponse.json({ 
        error: 'Missing required fields. Please provide name, email, message, and request type.' 
      }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // Validate request type
    if (!['driver', 'customer', 'general'].includes(requestType)) {
      return NextResponse.json({ 
        error: 'Invalid request type. Must be one of: driver, customer, general' 
      }, { status: 400 });
    }
    
    // Insert contact request
    const { data, error } = await supabase
      .from('contact_requests')
      .insert({
        name,
        email,
        phone: phone || null,
        message,
        request_type: requestType,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
      
    if (error) {
      console.error('Error submitting contact request:', error);
      return NextResponse.json({ error: 'Failed to submit contact request' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Contact request submitted successfully',
      data: data[0]
    });
  } catch (error: any) {
    console.error('Error in contact API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 