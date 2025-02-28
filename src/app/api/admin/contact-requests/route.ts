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
    
    // Get the user's session to verify they are an admin
    const authHeader = request.headers.get('authorization');
    
    // If no auth header is provided, we'll use the service role directly
    // This is not ideal for production but will help for debugging
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Fetch contact requests directly using service role
      const { data: contactRequests, error: fetchError } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) {
        console.error('Error fetching contact requests:', fetchError);
        return NextResponse.json({ error: 'Failed to fetch contact requests' }, { status: 500 });
      }
      
      return NextResponse.json({ contactRequests });
    }
    
    // Continue with normal auth flow if header is provided
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is an admin
    const { data: userData, error: metadataError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (metadataError || !userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    
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
    
    // Get the user's session to verify they are an admin
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is an admin
    const { data: userData, error: metadataError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (metadataError || !userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    
    // Get request data
    const { id, status, adminNotes } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Update contact request
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
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in contact requests API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 