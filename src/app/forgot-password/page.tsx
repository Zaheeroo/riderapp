'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with email:', email);
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Validate email with a proper regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      console.log('Sending password reset email to:', email);
      
      const supabase = createClient();
      
      // Add null check for Supabase client
      if (!supabase) {
        throw new Error('Unable to initialize Supabase client');
      }
      
      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      console.log('Password reset response received, error:', !!resetError);
      
      if (resetError) {
        console.error('Password reset error:', resetError);
        if (resetError.message?.includes('User not found')) {
          throw new Error('No account found with this email address');
        }
        throw resetError;
      }

      // Show success message
      setSuccess(true);
      toast({
        title: "Reset Email Sent",
        description: "If an account exists with this email, you will receive a password reset link",
        variant: "success",
      });
      
      // Clear the email field after success
      setEmail('');
    } catch (error: any) {
      console.error('Password reset process error:', error);
      setError(error.message || 'Failed to send reset email. Please try again later.');
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
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>
        
        {success ? (
          <CardContent className="space-y-4">
            <div className="p-3 text-sm bg-green-100 border border-green-200 text-green-600 rounded-md">
              Password reset link has been sent to your email. Please check your inbox and follow the instructions.
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
            >
              Send another reset link
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </CardContent>
          </form>
        )}
        
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          <Link href="/login" className="flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 