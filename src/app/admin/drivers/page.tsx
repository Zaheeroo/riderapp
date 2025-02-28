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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Driver form state
  const [driverName, setDriverName] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  
  // Reset form state
  const resetDriverForm = () => {
    setDriverName('');
    setDriverEmail('');
    setDriverPhone('');
    setDriverPassword('');
    setVehicleModel('');
    setVehicleYear('');
    setVehiclePlate('');
    setVehicleColor('');
    setError('');
  };
  
  // Handle modal close
  const closeDriverModal = () => {
    resetDriverForm();
    setShowAddDriverModal(false);
  };
  
  // Handle form submission
  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate form
      if (!driverName || !driverEmail || !driverPhone || !driverPassword || 
          !vehicleModel || !vehicleYear || !vehiclePlate || !vehicleColor) {
        throw new Error('Please fill in all fields');
      }
      
      // Create the driver in Supabase
      const response = await fetch('/api/admin/create-driver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: driverName,
          email: driverEmail,
          phone: driverPhone,
          password: driverPassword,
          vehicle: {
            model: vehicleModel,
            year: vehicleYear,
            plate: vehiclePlate,
            color: vehicleColor
          }
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create driver');
      }
      
      // Success - close modal and reset form
      alert('Driver created successfully!');
      closeDriverModal();
      
    } catch (error: any) {
      console.error('Error creating driver:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Button onClick={() => setShowAddDriverModal(true)}>
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

      {/* Add Driver Modal */}
      <Dialog open={showAddDriverModal} onOpenChange={setShowAddDriverModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>Create a new driver account</DialogDescription>
          </DialogHeader>
          {error && (
            <div className="mb-4 p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}
          <form className="space-y-4" id="add-driver-form" onSubmit={handleAddDriver}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Full Name" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                value={driverEmail}
                onChange={(e) => setDriverEmail(e.target.value)}
                type="email" 
                placeholder="email@example.com" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input 
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="+1 (555) 123-4567" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                value={driverPassword}
                onChange={(e) => setDriverPassword(e.target.value)}
                type="password" 
                placeholder="Create a strong password" 
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Model</label>
                <Input 
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="Toyota Camry" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Year</label>
                <Input 
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                  placeholder="2023" 
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">License Plate</label>
                <Input 
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="ABC-123" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Color</label>
                <Input 
                  value={vehicleColor}
                  onChange={(e) => setVehicleColor(e.target.value)}
                  placeholder="Silver" 
                  required
                />
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={closeDriverModal} type="button">
              Cancel
            </Button>
            <Button 
              onClick={handleAddDriver} 
              disabled={isSubmitting}
              type="submit"
              form="add-driver-form"
            >
              {isSubmitting ? 'Creating...' : 'Create Driver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 