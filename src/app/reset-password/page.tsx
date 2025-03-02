'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Check if we have a valid hash in the URL
  useEffect(() => {
    const checkHash = async () => {
      try {
        // Get the hash from the URL
        const hash = window.location.hash;
        if (!hash) {
          setError('Invalid or expired password reset link. Please request a new one.');
          return;
        }

        // Create Supabase client
        const supabase = createClient();

        // Verify the hash is valid
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          console.error('Error verifying reset token:', error);
          setError('Invalid or expired password reset link. Please request a new one.');
        }
      } catch (error) {
        console.error('Error checking hash:', error);
        setError('An error occurred. Please try again later.');
      }
    };

    checkHash();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    
    try {
      // Validate passwords
      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      console.log('Updating password...');
      
      // Create Supabase client
      const supabase = createClient();
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) {
        console.error('Password update error:', updateError);
        throw updateError;
      }

      // Show success message
      setSuccess(true);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully reset",
        variant: "success",
      });
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Password reset process error:', error);
      setError(error.message || 'Failed to reset password. Please try again later.');
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
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        
        {success ? (
          <CardContent className="space-y-4">
            <div className="p-3 text-sm bg-green-100 border border-green-200 text-green-600 rounded-md">
              Your password has been successfully reset. You will be redirected to the login page shortly.
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/login')}
            >
              Go to Login
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
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="New password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm new password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Reset Password'}
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