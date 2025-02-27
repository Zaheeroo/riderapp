'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabaseClient } from '../lib/supabase-client';

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

  useEffect(() => {
    // Only run in the browser
    if (typeof window === 'undefined') return;
    
    // Get current session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Create empty functions for SSR
  const noOpPromise = async () => ({ error: null, data: null });

  const value = {
    signUp: typeof window === 'undefined' ? noOpPromise : (data: any) => supabaseClient.auth.signUp(data),
    signIn: typeof window === 'undefined' ? noOpPromise : (data: any) => supabaseClient.auth.signInWithPassword(data),
    signOut: typeof window === 'undefined' ? noOpPromise : () => supabaseClient.auth.signOut(),
    user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 