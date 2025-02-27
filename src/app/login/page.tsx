'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chrome, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts";
import { useRouter } from "next/navigation";
import { supabaseClient } from "../../../lib/supabase-client";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [supabaseAvailable, setSupabaseAvailable] = useState(true);
  
  const { signIn } = useAuth();
  const router = useRouter();

  // Check if Supabase is available
  useEffect(() => {
    const checkSupabase = async () => {
      try {
        // Try to get session as a simple test
        await supabaseClient.auth.getSession();
        setSupabaseAvailable(true);
      } catch (error) {
        console.error('Supabase connection error:', error);
        setSupabaseAvailable(false);
      }
    };
    
    checkSupabase();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabaseAvailable) {
      setError('Authentication service is currently unavailable. Please try again later.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Sign in the user
      const { error: signInError, data } = await signIn({ email, password });
      
      if (signInError) {
        throw signInError;
      }
      
      // Store the user role in localStorage and cookie
      if (typeof window !== 'undefined') {
        console.log(`Setting user role to: ${userType}`);
        localStorage.setItem('userRole', userType);
        // Set cookie that will be accessible by the middleware
        Cookies.set('userRole', userType, { path: '/', expires: 7, sameSite: 'strict' }); // Expires in 7 days
        
        // Double-check that the role was set correctly
        console.log(`User role set to: ${userType}`);
        console.log(`LocalStorage userRole: ${localStorage.getItem('userRole')}`);
        console.log(`Cookie userRole: ${Cookies.get('userRole')}`);
        console.log(`All cookies: ${document.cookie}`);
      }
      
      // Add a longer delay to ensure cookies and localStorage are set
      console.log('Waiting for cookies to be set...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Double-check again after delay
      console.log(`After delay - LocalStorage userRole: ${localStorage.getItem('userRole')}`);
      console.log(`After delay - Cookie userRole: ${Cookies.get('userRole')}`);
      console.log(`After delay - All cookies: ${document.cookie}`);
      
      // Redirect based on user type
      console.log(`Redirecting to /${userType}`);
      if (userType === 'admin') {
        router.push('/admin');
      } else if (userType === 'driver') {
        router.push('/driver');
      } else {
        router.push('/customer');
      }
    } catch (error: any) {
      // Handle specific error types
      if (error.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message?.includes('network')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(error.message || 'Failed to sign in. Please try again later.');
      }
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[url('/waves.svg')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/95 backdrop-blur">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <Image
              src="/logo.svg"
              alt="Jaco Rides Logo"
              width={120}
              height={120}
              className="h-16 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Your trusted transportation partner in Costa Rica
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-4">
            {!supabaseAvailable && (
              <div className="p-3 text-sm bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Authentication service is currently unavailable. Some features may not work properly.
              </div>
            )}
            
            {error && (
              <div className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Select 
                defaultValue="customer" 
                onValueChange={(value) => setUserType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer (Tourist)</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" disabled>
              <Chrome className="mr-2 h-4 w-4" />
              Google (Coming Soon)
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
          <div>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <Link href="/forgot-password" className="text-primary hover:underline">
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 