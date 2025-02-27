'use client';

import { useAuth } from "../../contexts";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };
  
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Not logged in</CardTitle>
          <CardDescription>Please sign in to view your profile</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => router.push('/login')}>Sign In</Button>
        </CardFooter>
      </Card>
    );
  }
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.user_metadata?.full_name || user.email}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">User ID:</span> {user.id}
          </div>
          <div>
            <span className="font-semibold">User Type:</span> {user.user_metadata?.user_type || 'Customer'}
          </div>
          <div>
            <span className="font-semibold">Last Sign In:</span> {new Date(user.last_sign_in_at || '').toLocaleString()}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
      </CardFooter>
    </Card>
  );
} 