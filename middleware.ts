import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return res;
  }

  try {
    console.log('Middleware processing path:', pathname);
    
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res });
    
    // Refresh session if exists
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return res;
    }
    
    console.log('Session exists:', !!session);
    
    // Define protected paths and public paths
    const protectedPaths = ['/admin', '/driver', '/customer'];
    const publicPaths = ['/', '/login', '/signup'];
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    const isPublicPath = publicPaths.includes(pathname);
    
    console.log('Path type:', {
      isProtectedPath,
      isPublicPath,
      pathname
    });
    
    // If no session and trying to access protected route
    if (!session && isProtectedPath) {
      console.log('No session, redirecting to login');
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If session exists
    if (session) {
      const user = session.user;
      const userRole = user?.user_metadata?.user_type || 'customer';
      
      console.log('User role from metadata:', userRole);
      
      // If accessing login/signup while authenticated
      if (isPublicPath) {
        console.log('Authenticated user accessing public path, redirecting to dashboard');
        // Redirect to appropriate dashboard
        const redirectUrl = new URL(`/${userRole}`, req.url);
        return NextResponse.redirect(redirectUrl);
      }
      
      // Role-based access control
      if (isProtectedPath) {
        const isAdminPath = pathname.startsWith('/admin');
        const isDriverPath = pathname.startsWith('/driver');
        const isCustomerPath = pathname.startsWith('/customer');
        
        console.log('Checking role access:', {
          isAdminPath,
          isDriverPath,
          isCustomerPath,
          userRole
        });
        
        const hasAccess = (
          (isAdminPath && userRole === 'admin') ||
          (isDriverPath && userRole === 'driver') ||
          (isCustomerPath && userRole === 'customer')
        );
        
        if (!hasAccess) {
          console.log('Access denied, redirecting to appropriate dashboard');
          // Redirect to appropriate dashboard
          const redirectUrl = new URL(`/${userRole}`, req.url);
          return NextResponse.redirect(redirectUrl);
        }
      }
    }
    
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}; 