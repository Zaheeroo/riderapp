'use client';

import RouteGuard from '../../../components/RouteGuard';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts';

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      console.log('No user found in customer layout, redirecting to login');
      router.push('/login');
    }
  }, [user, loading, router]);

  // If loading or no user, don't render anything
  if (loading || !user) {
    return null;
  }

  return (
    <RouteGuard allowedRoles={['customer']}>
      {children}
    </RouteGuard>
  );
} 