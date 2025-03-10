import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  
  try {
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res });
    
    // Refresh session if expired - this will update the session cookie if needed
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Middleware session error:', error);
    }

    // If we have a session, refresh it
    if (session) {
      await supabase.auth.refreshSession();
    }
    
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

// Specify which routes should trigger this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
} 