import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('Middleware starting...', request.nextUrl.pathname);
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Supabase environment variables are missing in middleware');
    return NextResponse.redirect(new URL('/error', request.url));
  }

  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            const cookie = request.cookies.get(name)?.value;
            console.log('Getting cookie:', name, cookie ? '[FOUND]' : '[NOT FOUND]');
            return cookie;
          },
          set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
            console.log('Setting cookie:', name);
            response.cookies.set({
              name,
              value,
              ...options,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
              httpOnly: true,
              maxAge: 60 * 60 * 24 * 7, // 7 days
              path: '/',
            });
          },
          remove(name: string, options: { path?: string; domain?: string }) {
            console.log('Removing cookie:', name);
            response.cookies.set({
              name,
              value: '',
              path: '/',
              maxAge: 0,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            });
          },
        },
      }
    );

    console.log('Checking session state...');
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session error in middleware:', error);
      return response;
    }
    
    if (session) {
      console.log('Session found for user:', session.user.email);
      console.log('User role:', session.user.user_metadata?.user_type);
      
      // Refresh the session if it's close to expiring
      const expiresAt = session?.expires_at ?? 0;
      const now = Math.floor(Date.now() / 1000);
      if (expiresAt - now < 3600) { // Less than 1 hour until expiry
        console.log('Session near expiry, refreshing...');
        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error('Error refreshing session:', refreshError);
        }
      }
    } else {
      console.log('No active session found');
    }

    // Define protected paths and public paths
    const protectedPaths = ['/admin', '/driver', '/customer'];
    const publicPaths = ['/', '/login', '/signup', '/error', '/forgot-password', '/reset-password'];
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    console.log('Path validation:', {
      path: request.nextUrl.pathname,
      isProtected: isProtectedPath,
      isPublic: isPublicPath,
      hasSession: !!session
    });

    if (!session && isProtectedPath) {
      console.log('Protected path access denied - redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (session && isPublicPath && request.nextUrl.pathname !== '/error' && 
        request.nextUrl.pathname !== '/reset-password') {
      const userRole = session.user?.user_metadata?.user_type || 'customer';
      console.log('Authenticated user on public path - redirecting to dashboard:', userRole);
      return NextResponse.redirect(new URL(`/${userRole}`, request.url));
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
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