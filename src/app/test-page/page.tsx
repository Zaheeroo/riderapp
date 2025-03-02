'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TestPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This is a test page to verify that routing is working correctly.</p>
          <Button asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 