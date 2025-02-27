'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../contexts';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export default function RouteGuard({ children, allowedRoles = [] }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Authentication check
    const authCheck = () => {
      // If still loading auth state, don't make any decisions yet
      if (loading) {
        setAuthorized(false);
        return;
      }

      // Define protected paths and their required roles
      const protectedPaths = {
        '/admin': ['admin'],
        '/admin/customers': ['admin'],
        '/admin/drivers': ['admin'],
        '/admin/rides': ['admin'],
        '/admin/messages': ['admin'],
        '/driver': ['driver'],
        '/driver/rides': ['driver'],
        '/driver/earnings': ['driver'],
        '/driver/messages': ['driver'],
        '/customer': ['customer'],
        '/customer/book': ['customer'],
        '/customer/rides': ['customer'],
        '/customer/messages': ['customer'],
      };

      // Check if current path is protected
      const isProtectedPath = Object.keys(protectedPaths).some(path => 
        pathname === path || pathname.startsWith(`${path}/`)
      );

      // If path is not protected, allow access
      if (!isProtectedPath) {
        setAuthorized(true);
        return;
      }

      // If path is protected but user is not logged in, redirect to login
      if (!user) {
        console.log('User not authenticated, redirecting to login');
        setAuthorized(false);
        router.push('/login');
        return;
      }

      // Get the user's role from localStorage
      let userRole = 'customer'; // Default role
      
      if (typeof window !== 'undefined') {
        userRole = localStorage.getItem('userRole') || 'customer';
      }

      console.log('Current user role:', userRole);
      console.log('Required roles for path:', pathname, protectedPaths[pathname as keyof typeof protectedPaths]);

      // Check if user has permission for this path
      const requiredRoles = Object.entries(protectedPaths).find(([path]) => 
        pathname === path || pathname.startsWith(`${path}/`)
      )?.[1] || [];

      const hasPermission = requiredRoles.includes(userRole) || allowedRoles.includes(userRole);

      if (!hasPermission) {
        console.log('User does not have permission for this path');
        setAuthorized(false);
        // Redirect based on role
        switch(userRole) {
          case 'admin':
            router.push('/admin');
            break;
          case 'driver':
            router.push('/driver');
            break;
          case 'customer':
          default:
            router.push('/customer');
            break;
        }
        return;
      }

      console.log('User authorized for path:', pathname);
      setAuthorized(true);
    };

    // Run auth check
    authCheck();

  }, [user, loading, router, pathname, allowedRoles]);

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If authorized, render children
  return authorized ? <>{children}</> : null;
} 