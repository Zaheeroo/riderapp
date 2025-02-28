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
import { Car, Mail, Phone, Star, Search, ArrowRight, Plus, Trash, Eye, Pencil, AlertCircle } from "lucide-react";
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
import { createClient } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";

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

// Driver type definition
type Driver = {
  id: number;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  vehicle_model: string;
  vehicle_year: string;
  vehicle_plate: string;
  vehicle_color: string;
  rating: number;
  total_rides: number;
  created_at: string;
  updated_at: string;
};

// Dummy data for initial render
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
  const { toast } = useToast();
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showViewDriverModal, setShowViewDriverModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  // Driver form state
  const [driverName, setDriverName] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [driverStatus, setDriverStatus] = useState('Active');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  
  // Fetch drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);
  
  // Fetch drivers from the API
  const fetchDrivers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/admin/drivers');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch drivers');
      }
      
      const data = await response.json();
      setDrivers(data);
    } catch (err: any) {
      console.error('Error fetching drivers:', err);
      setError(err.message || 'Failed to fetch drivers');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset form state
  const resetDriverForm = () => {
    setDriverName('');
    setDriverEmail('');
    setDriverPhone('');
    setDriverPassword('');
    setDriverStatus('Active');
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
    setShowViewDriverModal(false);
    setShowEditDriverModal(false);
    setSelectedDriver(null);
  };
  
  // Handle view driver
  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowViewDriverModal(true);
  };
  
  // Handle edit driver
  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setDriverName(driver.name);
    setDriverEmail(driver.email);
    setDriverPhone(driver.phone);
    setDriverStatus(driver.status);
    setVehicleModel(driver.vehicle_model);
    setVehicleYear(driver.vehicle_year);
    setVehiclePlate(driver.vehicle_plate);
    setVehicleColor(driver.vehicle_color);
    setShowEditDriverModal(true);
  };
  
  // Handle delete driver
  const handleDeleteDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDeleteConfirmation(true);
  };
  
  // Handle form submission for adding a driver
  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate form
      if (!driverName || !driverEmail || !driverPhone || !driverPassword || !vehicleModel || !vehicleYear || !vehiclePlate) {
        throw new Error('Please fill in all required fields');
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
      toast({
        title: "Driver Created",
        description: "Driver has been created successfully.",
      });
      closeDriverModal();
      fetchDrivers(); // Refresh the driver list
      
    } catch (error: any) {
      console.error('Error creating driver:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle form submission for updating a driver
  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDriver) return;
    
    // Validate required fields
    if (!driverName || !driverEmail || !driverPhone || !vehicleModel || !vehicleYear || !vehiclePlate) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: driverName,
          email: driverEmail,
          phone: driverPhone,
          status: driverStatus,
          vehicle_model: vehicleModel,
          vehicle_year: vehicleYear,
          vehicle_plate: vehiclePlate,
          vehicle_color: vehicleColor,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update driver');
      }
      
      // Refresh the drivers list
      await fetchDrivers();
      
      // Close the modal
      setShowEditDriverModal(false);
      
      // Show success message
      toast({
        title: "Driver Updated",
        description: "Driver information has been updated successfully.",
      });
    } catch (err: any) {
      console.error('Error updating driver:', err);
      setError(err.message || 'Failed to update driver');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle driver deletion
  const handleConfirmDelete = async () => {
    if (!selectedDriver) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete driver');
      }
      
      // Refresh the drivers list
      await fetchDrivers();
      
      // Close the modal
      setShowDeleteConfirmation(false);
      
      // Show success message
      toast({
        title: "Driver Deleted",
        description: "Driver has been deleted successfully.",
      });
    } catch (err: any) {
      console.error('Error deleting driver:', err);
      setError(err.message || 'Failed to delete driver');
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
                <div className="text-2xl font-bold">{drivers.length}</div>
                <p className="text-xs text-muted-foreground">
                  {drivers.filter(d => d.status === "Active").length} active drivers
                </p>
                <p className="text-xs text-green-500">+5% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">
                  {drivers.filter(d => d.status === "Active").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {drivers.length > 0 ? ((drivers.filter(d => d.status === "Active").length / drivers.length) * 100).toFixed(0) : 0}% of total
                </p>
                <p className="text-xs text-green-500">+3% this week</p>
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
                  {drivers.reduce((acc, curr) => acc + curr.total_rides, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {drivers.length > 0 ? (drivers.reduce((acc, curr) => acc + curr.total_rides, 0) / drivers.length).toFixed(1) : 0} rides per driver
                </p>
                <p className="text-xs text-green-500">+12% this month</p>
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
                  {drivers.length > 0 ? (drivers.reduce((acc, curr) => acc + curr.rating, 0) / drivers.length).toFixed(1) : 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {drivers.reduce((acc, curr) => acc + curr.total_rides, 0)} rides
                </p>
                <p className="text-xs text-green-500">+0.3 from last month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Drivers List */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Driver List</CardTitle>
                <CardDescription>View and manage all drivers</CardDescription>
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
                  {drivers.map((driver) => (
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
                            {driver.vehicle_model} ({driver.vehicle_year})
                          </div>
                        </div>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            driver.status === "Active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}>
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
                            {driver.total_rides} rides
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDriver(driver)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditDriver(driver)}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteDriver(driver)}
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers.map((driver) => (
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
                              <div className="flex items-center">
                                <Car className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span>{driver.vehicle_model}</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Year: {driver.vehicle_year}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Plate: {driver.vehicle_plate}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Color: {driver.vehicle_color}
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
                                {driver.total_rides} rides
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                              ${
                                driver.status === "Active"
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }`}>
                              {driver.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDriver(driver)}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditDriver(driver)}
                              >
                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteDriver(driver)}
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
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

      {/* View Driver Modal */}
      <Dialog open={showViewDriverModal} onOpenChange={setShowViewDriverModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
            <DialogDescription>View driver information</DialogDescription>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-base">{selectedDriver.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1
                    ${
                      selectedDriver.status === "Active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    }`}>
                    {selectedDriver.status}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-base">{selectedDriver.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p className="text-base">{selectedDriver.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Rating</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                    <span>{selectedDriver.rating}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Rides</h3>
                  <p className="text-base">{selectedDriver.total_rides}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                  <p className="text-base">{new Date(selectedDriver.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p className="text-base">{new Date(selectedDriver.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Model:</span>{' '}
                    {selectedDriver.vehicle_model}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Year:</span>{' '}
                    {selectedDriver.vehicle_year}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Plate:</span>{' '}
                    {selectedDriver.vehicle_plate}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Color:</span>{' '}
                    {selectedDriver.vehicle_color}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDriverModal}>
              Close
            </Button>
            <Button onClick={() => {
              closeDriverModal();
              if (selectedDriver) handleEditDriver(selectedDriver);
            }}>
              Edit Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Driver Modal */}
      <Dialog open={showEditDriverModal} onOpenChange={setShowEditDriverModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>Update driver information</DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="mb-4 p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          <form className="space-y-4" id="edit-driver-form" onSubmit={handleUpdateDriver}>
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
              <label className="text-sm font-medium">Status</label>
              <select
                value={driverStatus}
                onChange={(e) => setDriverStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Model</label>
              <Input 
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Toyota Fortuner" 
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Plate</label>
              <Input 
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="CRC-123" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Vehicle Color</label>
              <Input 
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                placeholder="Silver" 
              />
            </div>
          </form>
          
          <DialogFooter>
            <Button variant="outline" onClick={closeDriverModal} type="button">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateDriver} 
              disabled={isSubmitting}
              type="submit"
              form="edit-driver-form"
            >
              {isSubmitting ? 'Updating...' : 'Update Driver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this driver? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="border rounded-md p-3 bg-muted/50">
              <p className="font-medium">{selectedDriver.name}</p>
              <p className="text-sm text-muted-foreground">{selectedDriver.email}</p>
              <p className="text-sm text-muted-foreground">{selectedDriver.phone}</p>
              <p className="text-sm text-muted-foreground">{selectedDriver.vehicle_model} ({selectedDriver.vehicle_year})</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirmation(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Driver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 