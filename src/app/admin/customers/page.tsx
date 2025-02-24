"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Car, Mail, MapPin, Phone, Star, Users, Search, ArrowRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Custom hook for device detection
function useDeviceType() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
    };

    // Initial check
    checkDeviceType();

    // Add resize listener
    window.addEventListener('resize', checkDeviceType);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  return { isMobile };
}

const dummyCustomersExtended = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 234-567-8900",
    status: "Active",
    location: "Jaco Beach",
    joinDate: "2024-01-15",
    totalRides: 8,
    totalSpent: 680.00,
    lastRide: "2024-02-25",
    preferredPayment: "Credit Card",
    rating: 4.9,
    preferences: {
      language: "English",
      currency: "USD",
      notifications: "Email + SMS"
    }
  },
  {
    id: 2,
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+1 234-567-8901",
    status: "Active",
    location: "Tamarindo",
    joinDate: "2024-01-20",
    totalRides: 5,
    totalSpent: 475.00,
    lastRide: "2024-02-25",
    preferredPayment: "PayPal",
    rating: 4.8,
    preferences: {
      language: "English",
      currency: "USD",
      notifications: "Email"
    }
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 234-567-8902",
    status: "Inactive",
    location: "Manuel Antonio",
    joinDate: "2024-02-01",
    totalRides: 2,
    totalSpent: 90.00,
    lastRide: "2024-02-25",
    preferredPayment: "Cash",
    rating: 4.7,
    preferences: {
      language: "Spanish",
      currency: "USD",
      notifications: "SMS"
    }
  }
];

export default function CustomersPage() {
  const { isMobile } = useDeviceType();

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <p className="text-muted-foreground">
              Manage and monitor your customer base
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Customer
          </Button>
        </div>

        {/* Stats Overview */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">{dummyCustomersExtended.length}</div>
                <p className="text-xs text-muted-foreground">
                  {dummyCustomersExtended.filter(c => c.status === "Active").length} active customers
                </p>
                <p className="text-xs text-green-500">+12% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  {dummyCustomersExtended.filter(c => c.status === "Active").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((dummyCustomersExtended.filter(c => c.status === "Active").length / dummyCustomersExtended.length) * 100).toFixed(0)}% of total
                </p>
                <p className="text-xs text-green-500">+8% this week</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  {dummyCustomersExtended.reduce((acc, curr) => acc + curr.totalRides, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(dummyCustomersExtended.reduce((acc, curr) => acc + curr.totalRides, 0) / dummyCustomersExtended.length).toFixed(1)} rides per customer
                </p>
                <p className="text-xs text-green-500">+15% this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  {(dummyCustomersExtended.reduce((acc, curr) => acc + curr.rating, 0) / dummyCustomersExtended.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {dummyCustomersExtended.reduce((acc, curr) => acc + curr.totalRides, 0)} rides
                </p>
                <p className="text-xs text-green-500">+0.2 from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Customer List</CardTitle>
                <CardDescription>View and manage all customers</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search customers..."
                  className="w-full sm:w-[300px]"
                />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                  <Link href="/admin/customers">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className={cn(
              isMobile ? "max-h-[300px]" : "max-h-[400px]"
            )}>
              {isMobile ? (
                // Mobile view - Card layout
                <div className="divide-y">
                  {dummyCustomersExtended.map((customer) => (
                    <div key={customer.id} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="mr-1 h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="mr-1 h-3 w-3" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <MapPin className="mr-1 h-3 w-3" />
                            {customer.location}
                          </div>
                        </div>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            customer.status === "Active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}>
                          {customer.status}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{customer.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {customer.totalRides} rides • ${customer.totalSpent} total spent
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop view - Table layout
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Stats</TableHead>
                        <TableHead>Preferences</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummyCustomersExtended.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{customer.name}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Mail className="mr-1 h-3 w-3" />
                                {customer.email}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Phone className="mr-1 h-3 w-3" />
                                {customer.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                              {customer.location}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                                <span className="font-medium">{customer.rating}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {customer.totalRides} rides
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ${customer.totalSpent} total spent
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-xs">Language: {customer.preferences.language}</p>
                              <p className="text-xs">Currency: {customer.preferences.currency}</p>
                              <p className="text-xs">Notifications: {customer.preferences.notifications}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                              ${
                                customer.status === "Active"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }`}>
                              {customer.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 