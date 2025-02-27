'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function DetectRolePage() {
  const router = useRouter();

  useEffect(() => {
    // Function to detect role and redirect
    const detectRoleAndRedirect = () => {
      console.log('Detecting user role from localStorage');
      
      // Try to get the role from localStorage
      const userRole = localStorage.getItem('userRole');
      console.log(`Role from localStorage: ${userRole || 'none'}`);
      
      // If role exists in localStorage, set it in cookies
      if (userRole) {
        console.log(`Setting role cookie to: ${userRole}`);
        Cookies.set('userRole', userRole, { path: '/', expires: 7, sameSite: 'strict' });
        
        // Redirect based on role
        console.log(`Redirecting to /${userRole}`);
        router.push(`/${userRole}`);
      } else {
        // If no role in localStorage, default to customer
        console.log('No role found, defaulting to customer');
        localStorage.setItem('userRole', 'customer');
        Cookies.set('userRole', 'customer', { path: '/', expires: 7, sameSite: 'strict' });
        router.push('/customer');
      }
    };

    // Run the detection with a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      detectRoleAndRedirect();
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Detecting your account type...</h1>
        <p className="text-muted-foreground">Please wait while we redirect you to the right dashboard.</p>
      </div>
    </div>
  );
} 