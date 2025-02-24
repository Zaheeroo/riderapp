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
import { Car, Mail, Phone, Star, Search, ArrowRight, Plus } from "lucide-react";
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

const dummyDriversExtended = [
  {
    id: 1,
    name: "Carlos Martinez",
    email: "carlos@jacorides.com",
    phone: "+506 8888-1111",
    status: "Active",
    vehicle: {
      model: "Toyota Fortuner",
      year: "2023",
      plate: "CRC-123",
      seats: 6,
      color: "Silver"
    },
    rating: 4.8,
    totalRides: 156,
    earnings: {
      month: 4500.00
    },
    documents: {
      license: "Valid until 2025",
      insurance: "Up to date",
      background: "Verified"
    },
    joinDate: "2023-01-15"
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    email: "maria@jacorides.com",
    phone: "+506 8888-2222",
    status: "Active",
    vehicle: {
      model: "Honda CR-V",
      year: "2022",
      plate: "CRC-456",
      seats: 5,
      color: "White"
    },
    rating: 4.9,
    totalRides: 203,
    earnings: {
      month: 5200.00
    },
    documents: {
      license: "Valid until 2024",
      insurance: "Up to date",
      background: "Verified"
    },
    joinDate: "2022-11-20"
  },
  {
    id: 3,
    name: "Juan Perez",
    email: "juan@jacorides.com",
    phone: "+506 8888-3333",
    status: "Inactive",
    vehicle: {
      model: "Hyundai Tucson",
      year: "2023",
      plate: "CRC-789",
      seats: 5,
      color: "Black"
    },
    rating: 4.7,
    totalRides: 98,
    earnings: {
      month: 2800.00
    },
    documents: {
      license: "Valid until 2026",
      insurance: "Up to date",
      background: "Verified"
    },
    joinDate: "2023-06-10"
  }
];

export default function DriversPage() {
  const { isMobile } = useDeviceType();

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Drivers</h2>
            <p className="text-muted-foreground">
              Manage and monitor your driver fleet
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Driver
          </Button>
        </div>

        {/* Stats Overview */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">{dummyDriversExtended.length}</div>
                <p className="text-xs text-muted-foreground">
                  {dummyDriversExtended.filter(d => d.status === "Active").length} active drivers
                </p>
                <p className="text-xs text-green-500">+12% from last month</p>
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
                  {(dummyDriversExtended.reduce((acc, curr) => acc + curr.rating, 0) / dummyDriversExtended.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {dummyDriversExtended.reduce((acc, curr) => acc + curr.totalRides, 0)} rides
                </p>
                <p className="text-xs text-green-500">+0.2 from last month</p>
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
                  {dummyDriversExtended.reduce((acc, curr) => acc + curr.totalRides, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(dummyDriversExtended.reduce((acc, curr) => acc + curr.totalRides, 0) / 30)} rides per day
                </p>
                <p className="text-xs text-green-500">+18% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  ${dummyDriversExtended.reduce((acc, curr) => acc + curr.earnings.month, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  ${Math.round(dummyDriversExtended.reduce((acc, curr) => acc + curr.earnings.month, 0) / dummyDriversExtended.length)} avg per driver
                </p>
                <p className="text-xs text-green-500">+15% from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drivers List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Driver Fleet</CardTitle>
                <CardDescription>Manage and monitor your drivers</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search drivers..."
                  className="w-full sm:w-[300px]"
                />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                  <Link href="/admin/drivers">
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
                  {dummyDriversExtended.map((driver) => (
                    <div key={driver.id} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="mr-1 h-3 w-3" />
                            {driver.email}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="mr-1 h-3 w-3" />
                            {driver.phone}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Car className="mr-1 h-3 w-3" />
                            {driver.vehicle.model} • {driver.vehicle.plate}
                          </div>
                        </div>
                        <div className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          driver.status === "Active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {driver.status}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{driver.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {driver.totalRides} rides • ${driver.earnings.month} this month
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
                        <TableHead>Driver</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Stats</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummyDriversExtended.map((driver) => (
                        <TableRow key={driver.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{driver.name}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Mail className="mr-1 h-3 w-3" />
                                {driver.email}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Phone className="mr-1 h-3 w-3" />
                                {driver.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{driver.vehicle.model}</p>
                              <p className="text-xs text-muted-foreground">
                                {driver.vehicle.color} • {driver.vehicle.year}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {driver.vehicle.plate} • {driver.vehicle.seats} seats
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                                <span className="font-medium">{driver.rating}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {driver.totalRides} rides
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ${driver.earnings.month} this month
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-xs">License: {driver.documents.license}</p>
                              <p className="text-xs">Insurance: {driver.documents.insurance}</p>
                              <p className="text-xs">Background: {driver.documents.background}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                              driver.status === "Active"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            )}>
                              {driver.status}
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