import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chrome } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select defaultValue="customer">
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
            <Input type="email" placeholder="you@example.com" />
          </div>
          
          <div className="space-y-2">
            <Input type="password" placeholder="••••••••" />
          </div>

          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Sign in
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