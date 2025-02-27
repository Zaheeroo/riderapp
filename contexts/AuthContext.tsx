'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseClient } from '../lib/supabase-client';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signUp: (data: any) => Promise<any>;
  signIn: (data: any) => Promise<any>;
  signOut: () => Promise<any>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Sync user role from metadata to localStorage and cookies
  const syncUserRole = (user: any) => {
    if (typeof window === 'undefined' || !user) return;
    
    try {
      const userRole = user.user_metadata?.user_type || 'customer';
      // Set role in localStorage
      localStorage.setItem('userRole', userRole);
      
      // Set cookie that will be accessible by the middleware
      Cookies.set('userRole', userRole, { 
        path: '/', 
        expires: 7,
        secure: window.location.protocol === 'https:',
        sameSite: 'lax'
      });
      console.log('Synced user role to cookie:', userRole);
    } catch (error) {
      console.error('Error syncing user role:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (mounted) {
          setUser(session?.user || null);
          setLoading(false);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
          async (_event, session) => {
            if (mounted) {
              setUser(session?.user || null);
              setLoading(false);
            }
          }
        );

        return () => {
          mounted = false;
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setError(error instanceof Error ? error : new Error('Unknown error'));
          setLoading(false);
        }
      }
    };

    initialize();
  }, []);

  // Create empty functions for SSR
  const noOpPromise = async () => ({ error: null, data: null });

  // Safe auth functions with error handling
  const safeSignUp = async (data: any) => {
    try {
      return await supabaseClient.auth.signUp(data);
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error, data: null };
    }
  };

  const safeSignIn = async (data: any) => {
    try {
      const result = await supabaseClient.auth.signInWithPassword(data);
      if (result.error) throw result.error;
      if (result.data?.user) {
        syncUserRole(result.data.user);
      }
      return result;
    } catch (error) {
      console.error('Error during sign in:', error);
      return { error, data: null };
    }
  };

  const safeSignOut = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      // Clear role cookie and localStorage on sign out
      Cookies.remove('userRole', { path: '/' });
      localStorage.removeItem('userRole');
      return { error: null };
    } catch (error) {
      console.error('Error during sign out:', error);
      return { error };
    }
  };

  const value = {
    signUp: typeof window === 'undefined' ? noOpPromise : safeSignUp,
    signIn: safeSignIn,
    signOut: safeSignOut,
    user,
    loading
  };

  // If there was an error initializing the auth context, render an error message
  if (error && !loading && typeof window !== 'undefined') {
    console.error('Auth context error:', error);
    // Continue rendering the app anyway, just with no user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 