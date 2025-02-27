'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const { error } = await signUp({ 
        email, 
        password,
        options: {
          data: {
            user_type: userType
          }
        }
      });
      
      if (error) throw error;
      
      // Show success message and redirect to login
      alert('Registration successful! Please check your email to confirm your account.');
      router.push('/login');
    } catch (error: any) {
      setError(error.message || 'Failed to sign up');
      console.error('Sign up error:', error);
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
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>
            Join Jaco Rides - Your trusted transportation partner in Costa Rica
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md">
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
                placeholder="Create password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Confirm password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <div>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 