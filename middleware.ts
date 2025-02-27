import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  try {
    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res });
    
    // Get user session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    console.log(`Middleware - Path: ${pathname}`);
    console.log(`Middleware - User authenticated: ${!!session}`);
    
    // Get user role from cookie
    const userRole = req.cookies.get('userRole')?.value;
    console.log(`User role from cookie: ${userRole || 'none'}`);
    
    // Log all cookies for debugging
    const cookieString = req.headers.get('cookie') || '';
    console.log('All cookies:', cookieString);
    
    // Define protected paths
    const protectedPaths = ['/admin', '/driver', '/customer'];
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    
    // Define role-specific paths
    const isAdminPath = pathname.startsWith('/admin');
    const isDriverPath = pathname.startsWith('/driver');
    const isCustomerPath = pathname.startsWith('/customer');
    
    console.log(`Path types - Protected: ${isProtectedPath}, Admin: ${isAdminPath}, Driver: ${isDriverPath}, Customer: ${isCustomerPath}`);
    
    // If user is not authenticated and trying to access protected routes
    if (!session && isProtectedPath) {
      console.log('User not authenticated, redirecting to login');
      const url = new URL('/login', req.url);
      return NextResponse.redirect(url);
    }
    
    // If user is authenticated
    if (session) {
      console.log('User is authenticated');
      
      // If user is trying to access login or signup pages, redirect to dashboard
      if (pathname === '/login' || pathname === '/signup') {
        console.log('Authenticated user trying to access login/signup, redirecting to dashboard');
        
        // Redirect based on user role
        let redirectPath = '/customer'; // Default
        
        if (userRole === 'admin') {
          redirectPath = '/admin';
        } else if (userRole === 'driver') {
          redirectPath = '/driver';
        }
        
        console.log(`Redirecting to ${redirectPath} based on role: ${userRole}`);
        const url = new URL(redirectPath, req.url);
        return NextResponse.redirect(url);
      }
      
      // Only apply role-based redirects if the user is logged in and has a role
      if (userRole) {
        console.log(`Current user role: ${userRole}, Current path: ${pathname}`);
        
        // Check if admin is trying to access non-admin paths
        if (userRole === 'admin' && (isDriverPath || isCustomerPath)) {
          console.log('Admin trying to access non-admin path, redirecting to admin dashboard');
          const url = new URL('/admin', req.url);
          return NextResponse.redirect(url);
        }
        
        // Check if driver is trying to access non-driver paths
        if (userRole === 'driver' && (isAdminPath || isCustomerPath)) {
          console.log('Driver trying to access non-driver path, redirecting to driver dashboard');
          const url = new URL('/driver', req.url);
          return NextResponse.redirect(url);
        }
        
        // Check if customer is trying to access non-customer paths
        if (userRole === 'customer' && (isAdminPath || isDriverPath)) {
          console.log('Customer trying to access non-customer path, redirecting to customer dashboard');
          const url = new URL('/customer', req.url);
          return NextResponse.redirect(url);
        }
      } else {
        console.log('User is logged in but no role is set in cookies');
        // If no role is set but user is authenticated, try to get role from localStorage via a client-side redirect
        if (isProtectedPath) {
          console.log('Redirecting to role detection page');
          const url = new URL('/detect-role', req.url);
          return NextResponse.redirect(url);
        }
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
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