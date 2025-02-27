'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '../lib/supabase/client';
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
  const supabase = createClient();

  // Sync user role from metadata to localStorage and cookies
  const syncUserRole = async (user: any) => {
    if (typeof window === 'undefined' || !user) return;
    
    try {
      const userRole = user.user_metadata?.user_type || 'customer';
      console.log('Syncing user role:', userRole);
      
      // Set role in localStorage
      localStorage.setItem('userRole', userRole);
      
      // Set cookie that will be accessible by the middleware
      Cookies.set('userRole', userRole, { 
        path: '/', 
        expires: 7,
        secure: true,
        sameSite: 'lax'
      });
      console.log('Role synced successfully');
    } catch (error) {
      console.error('Error syncing user role:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await syncUserRole(session.user);
        } else {
          setUser(null);
          if (typeof window !== 'undefined') {
            Cookies.remove('userRole', { path: '/' });
            localStorage.removeItem('userRole');
          }
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state change:', event, session?.user?.email);
            if (session?.user) {
              setUser(session.user);
              await syncUserRole(session.user);
            } else {
              setUser(null);
              if (typeof window !== 'undefined') {
                Cookies.remove('userRole', { path: '/' });
                localStorage.removeItem('userRole');
              }
            }
          }
        );

        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const signIn = async (data: any) => {
    try {
      console.log('Starting sign in process...');
      
      // Clear any existing session first
      await signOut();
      
      // Wait a moment for the signout to complete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Attempting sign in with credentials...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword(data);
      
      if (signInError) {
        console.error('Initial sign in error:', signInError);
        throw signInError;
      }

      // If no session, try to get it explicitly
      if (!signInData?.session) {
        console.log('No immediate session, attempting to retrieve...');
        
        // Try multiple times with increasing delays
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            console.log('Session retrieved on attempt', i + 1);
            signInData.session = session;
            break;
          }
          console.log('Session retrieval attempt', i + 1, 'failed');
        }
      }

      if (!signInData?.session) {
        throw new Error('Unable to establish session after multiple attempts');
      }

      console.log('Sign in successful, session established');
      setUser(signInData.session.user);
      
      // Sync user role with a delay to ensure cookies are set
      await new Promise(resolve => setTimeout(resolve, 500));
      await syncUserRole(signInData.session.user);
      
      return { data: signInData, error: null };
    } catch (error) {
      console.error('Error during sign in process:', error);
      return { error, data: null };
    }
  };

  const signUp = async (data: any) => {
    try {
      const { data: signUpData, error } = await supabase.auth.signUp(data);
      if (error) throw error;
      return { data: signUpData, error: null };
    } catch (error) {
      console.error('Error during sign up:', error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      Cookies.remove('userRole', { path: '/' });
      localStorage.removeItem('userRole');
      
      return { error: null };
    } catch (error) {
      console.error('Error during sign out:', error);
      return { error };
    }
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    loading
  };

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