"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyAdminStats, dummyCommunication } from "@/data/dummy";
import { Car, MapPin, Plus, Clock, Phone, Star, DollarSign, MessageSquare, ArrowRight, Users, Mail, Search, Pencil, Eye, Trash, AlertCircle, User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeviceType } from "@/hooks/useDeviceType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

// Define types for Driver and Customer
type Vehicle = {
  model: string;
  year: string;
  plate: string;
  color: string;
};

type Driver = {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  vehicle: Vehicle;
  rating?: number;
  totalRides?: number;
  earnings?: {
    today: number;
    week: number;
    month: number;
  };
  created_at?: string;
  updated_at?: string;
};

type Customer = {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  status?: string;
  rating?: number;
  totalRides?: number;
  totalSpent?: number;
  preferences?: {
    language: string;
    currency: string;
    notifications: string;
  };
  created_at?: string;
  updated_at?: string;
};

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { isMobile } = useDeviceType();
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showViewDriverModal, setShowViewDriverModal] = useState(false);
  const [showViewCustomerModal, setShowViewCustomerModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [showDeleteDriverConfirmation, setShowDeleteDriverConfirmation] = useState(false);
  const [showDeleteCustomerConfirmation, setShowDeleteCustomerConfirmation] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  
  // Add state for drivers and customers
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [driversError, setDriversError] = useState('');
  const [customersError, setCustomersError] = useState('');
  
  // Add state for contact requests
  const [contactRequests, setContactRequests] = useState<any[]>([]);
  const [loadingContactRequests, setLoadingContactRequests] = useState(false);
  const [contactRequestsError, setContactRequestsError] = useState('');
  
  // Driver form state
  const [driverName, setDriverName] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  
  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerLocation, setCustomerLocation] = useState('');
  
  // Reset form states
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
  
  const resetCustomerForm = () => {
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setCustomerPassword('');
    setCustomerLocation('');
    setError('');
  };
  
  // Handle modal close
  const closeDriverModal = () => {
    resetDriverForm();
    setShowAddDriverModal(false);
  };
  
  const closeCustomerModal = () => {
    resetCustomerForm();
    setShowAddCustomerModal(false);
  };
  
  // Handle form submissions
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
  
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate form
      if (!customerName || !customerEmail || !customerPhone || !customerPassword) {
        throw new Error('Please fill in all required fields');
      }
      
      // Create the customer in Supabase
      const response = await fetch('/api/admin/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          password: customerPassword,
          location: customerLocation
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create customer');
      }
      
      // Success - close modal and reset form
      toast({
        title: "Customer Created",
        description: "Customer has been created successfully.",
      });
      closeCustomerModal();
      fetchCustomers(); // Refresh the customer list
      
    } catch (error: any) {
      console.error('Error creating customer:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fetch drivers from API
  const fetchDrivers = async () => {
    setLoadingDrivers(true);
    setDriversError('');
    
    try {
      const response = await fetch('/api/admin/drivers');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch drivers');
      }
      
      const responseData = await response.json();
      const data = responseData.data || [];
      
      // Add default values for any missing fields
      const processedDrivers = data.map((driver: any) => ({
        ...driver,
        status: driver.status || 'Active',
        rating: driver.rating || 4.5,
        totalRides: driver.totalRides || 0,
        earnings: driver.earnings || {
          today: 0,
          week: 0,
          month: 0
        },
        vehicle: driver.vehicle || {
          model: 'Unknown',
          year: 'Unknown',
          plate: 'Unknown',
          color: 'Unknown'
        }
      }));
      
      setDrivers(processedDrivers);
    } catch (error: any) {
      console.error('Error fetching drivers:', error);
      setDriversError(error.message || 'An error occurred');
    } finally {
      setLoadingDrivers(false);
    }
  };
  
  // Fetch customers from API
  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    setCustomersError('');
    
    try {
      const response = await fetch('/api/admin/customers');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch customers');
      }
      
      const responseData = await response.json();
      const data = responseData.data || [];
      
      // Add default values for any missing fields
      const processedCustomers = data.map((customer: any) => ({
        ...customer,
        status: customer.status || 'Active',
        rating: customer.rating || 4.5,
        totalRides: customer.totalRides || 0,
        totalSpent: customer.totalSpent || 0,
        location: customer.location || 'Not specified'
      }));
      
      setCustomers(processedCustomers);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      setCustomersError(error.message || 'An error occurred');
    } finally {
      setLoadingCustomers(false);
    }
  };
  
  // Add function to fetch contact requests
  const fetchContactRequests = async () => {
    setLoadingContactRequests(true);
    setContactRequestsError('');
    
    try {
      const response = await fetch('/api/admin/contact-requests');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch contact requests');
      }
      
      const data = await response.json();
      
      if (data.contactRequests && Array.isArray(data.contactRequests)) {
        setContactRequests(data.contactRequests);
      } else {
        console.warn('No contact requests found or invalid format:', data);
        setContactRequests([]);
      }
    } catch (error: any) {
      console.error('Error fetching contact requests:', error);
      setContactRequestsError(error.message || 'Failed to load contact requests');
    } finally {
      setLoadingContactRequests(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    if (user) {
      fetchDrivers();
      fetchCustomers();
      fetchContactRequests();
    }
  }, [user]);
  
  // Check if user is authenticated and has admin role
  useEffect(() => {
    console.log("Admin page auth check - User:", !!user, "Loading:", loading);
    
    if (!loading) {
      if (!user) {
        console.log("No user, redirecting to login from admin page");
        // Not logged in, redirect to login
        router.push('/login');
        return;
      }
      
      // Check if user has admin role
      const userRole = localStorage.getItem('userRole');
      console.log("User role from localStorage:", userRole);
      
      if (userRole !== 'admin') {
        console.log("User has non-admin role:", userRole);
        // Not an admin, redirect to appropriate dashboard
        if (userRole === 'driver') {
          router.push('/driver');
        } else {
          router.push('/customer');
        }
      }
    }
  }, [user, loading, router]);

  // If still loading or not authenticated, show loading state
  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const recentChats = dummyCommunication.conversations
    .filter(conv => conv.participants.some(p => p.type === "admin"))
    .slice(0, 3); // Only show 3 most recent chats

  const renderRidesManagement = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">Rides Management</CardTitle>
            <CardDescription>Monitor and manage all rides</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search rides..."
              className="w-full sm:w-[300px]"
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link href="/admin/rides">
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
              {dummyAdminStats.recentRides?.map((ride) => (
                <div key={ride.id} className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{ride.customerName}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {ride.destination}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {ride.time}
                      </div>
                    </div>
                    <Badge variant={
                      ride.status === "In Progress" ? "default" :
                      ride.status === "Completed" ? "secondary" :
                      "outline"
                    }>
                      {ride.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Driver: {ride.driverName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue={ride.driverName}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Assign Driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.name}>
                              <div className="flex flex-col">
                                <span>{driver.name}</span>
                                <span className="text-xs text-muted-foreground">{driver.vehicle.model}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyAdminStats.recentRides?.map((ride) => (
                    <TableRow key={ride.id}>
                      <TableCell>
                        <p className="font-medium">{ride.customerName}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-1 h-3 w-3" />
                          {ride.destination}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-3 w-3" />
                          {ride.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={ride.driverName}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Assign Driver" />
                          </SelectTrigger>
                          <SelectContent>
                            {drivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.name}>
                                <div className="flex flex-col">
                                  <span>{driver.name}</span>
                                  <span className="text-xs text-muted-foreground">{driver.vehicle.model}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          ride.status === "In Progress" ? "default" :
                          ride.status === "Completed" ? "secondary" :
                          "outline"
                        }>
                          {ride.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
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
  );

  const renderDriverFleet = () => (
    <Card>
      <CardHeader>
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
        {driversError && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border-l-4 border-red-600">
            Error loading drivers: {driversError}
          </div>
        )}
        
        {loadingDrivers ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className={cn(
            isMobile ? "max-h-[300px]" : "max-h-[400px]"
          )}>
            {isMobile ? (
              // Mobile view - Card layout
              <div className="divide-y">
                {drivers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No drivers found
                  </div>
                ) : (
                  drivers.map((driver) => (
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
                            {driver.totalRides} rides • ${driver.earnings?.month || 0} this month
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDriver(driver)}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleEditDriver(driver)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                    {drivers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No drivers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      drivers.map((driver) => (
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
                              <p className="font-medium">{driver.vehicle?.model || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground">
                                {driver.vehicle?.color || 'N/A'} • {driver.vehicle?.year || 'N/A'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {driver.vehicle?.plate || 'N/A'}
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
                                ${driver.earnings?.month || 0} this month
                              </p>
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );

  const renderCustomerManagement = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">Customer Management</CardTitle>
            <CardDescription>Monitor and manage your customers</CardDescription>
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
        {customersError && (
          <div className="p-4 text-sm text-red-600 bg-red-50 border-l-4 border-red-600">
            Error loading customers: {customersError}
          </div>
        )}
        
        {loadingCustomers ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ScrollArea className={cn(
            isMobile ? "max-h-[300px]" : "max-h-[400px]"
          )}>
            {isMobile ? (
              // Mobile view - Card layout
              <div className="divide-y">
                {customers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No customers found
                  </div>
                ) : (
                  customers.map((customer) => (
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
                        </div>
                        <div className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          customer.status === "Active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        )}>
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No customers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      customers.map((customer) => (
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
                              {customer.location || 'Not specified'}
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
                            <div className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                              customer.status === "Active"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yellow-500/10 text-yellow-500"
                            )}>
                              {customer.status}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewCustomer(customer)}
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditCustomer(customer)}
                              >
                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteCustomer(customer)}
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );

  const renderStats = () => (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-2" : "grid-cols-4"
    )}>
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[100px]">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{dummyAdminStats.overview.totalDrivers}</div>
              <p className="text-xs text-muted-foreground">
                {dummyAdminStats.overview.activeDrivers} active drivers
              </p>
              <p className="text-xs text-green-500">+{dummyAdminStats.overview.driverPercentageChange}% from last month</p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[100px]">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{dummyAdminStats.overview.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                {dummyAdminStats.overview.activeCustomers} active this month
              </p>
              <p className="text-xs text-green-500">+{dummyAdminStats.overview.customerPercentageChange}% from last month</p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[100px]">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">{dummyAdminStats.overview.activeChats}</div>
              <p className="text-xs text-muted-foreground">
                {dummyAdminStats.overview.attentionNeeded} require attention
              </p>
              <p className="text-xs text-green-500">+{dummyAdminStats.overview.chatPercentageChange}% from last week</p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[100px]">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">${dummyAdminStats.earnings.month}</div>
              <p className="text-xs text-muted-foreground">
                +${dummyAdminStats.earnings.monthChange} this month
              </p>
              <p className="text-xs text-green-500">+{dummyAdminStats.earnings.percentageChange}% from last month</p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

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
    setVehicleModel(driver.vehicle.model);
    setVehicleYear(driver.vehicle.year);
    setVehiclePlate(driver.vehicle.plate);
    setVehicleColor(driver.vehicle.color);
    setShowEditDriverModal(true);
  };

  // Handle delete driver
  const handleDeleteDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDeleteDriverConfirmation(true);
  };

  // Handle view customer
  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowViewCustomerModal(true);
  };

  // Handle edit customer
  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerName(customer.name);
    setCustomerEmail(customer.email);
    setCustomerPhone(customer.phone);
    setCustomerLocation(customer.location || '');
    setShowEditCustomerModal(true);
  };

  // Handle delete customer
  const handleDeleteCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteCustomerConfirmation(true);
  };

  // Handle confirm delete driver
  const handleConfirmDeleteDriver = async () => {
    if (!selectedDriver) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete driver');
      }
      
      toast({
        title: "Driver Deleted",
        description: "Driver has been deleted successfully.",
      });
      setShowDeleteDriverConfirmation(false);
      setSelectedDriver(null);
      // Refresh the driver list
      fetchDrivers();
      
    } catch (error: any) {
      console.error('Error deleting driver:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle confirm delete customer
  const handleConfirmDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete customer');
      }
      
      toast({
        title: "Customer Deleted",
        description: "Customer has been deleted successfully.",
      });
      setShowDeleteCustomerConfirmation(false);
      setSelectedCustomer(null);
      // Refresh the customer list
      fetchCustomers();
      
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update driver
  const handleUpdateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate form
      if (!driverName || !driverEmail || !driverPhone || 
          !vehicleModel || !vehicleYear || !vehiclePlate || !vehicleColor) {
        throw new Error('Please fill in all fields');
      }
      
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: driverName,
          email: driverEmail,
          phone: driverPhone,
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
        throw new Error(data.error || 'Failed to update driver');
      }
      
      toast({
        title: "Driver Updated",
        description: "Driver information has been updated successfully.",
      });
      setShowEditDriverModal(false);
      // Refresh the driver list
      fetchDrivers();
      
    } catch (error: any) {
      console.error('Error updating driver:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle update customer
  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate form
      if (!customerName || !customerEmail || !customerPhone) {
        throw new Error('Please fill in all required fields');
      }
      
      const response = await fetch(`/api/admin/customers/${selectedCustomer.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          location: customerLocation
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update customer');
      }
      
      toast({
        title: "Customer Updated",
        description: "Customer information has been updated successfully.",
      });
      setShowEditCustomerModal(false);
      // Refresh the customer list
      fetchCustomers();
      
    } catch (error: any) {
      console.error('Error updating customer:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Replace the Contact Requests card implementation
  const renderContactRequests = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Contact Requests</CardTitle>
            <CardDescription>Account requests from users</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link href="/admin/contact-requests">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="divide-y max-h-[200px]">
          {loadingContactRequests ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading contact requests...
            </div>
          ) : contactRequestsError ? (
            <div className="p-4 text-center text-sm text-red-500">
              {contactRequestsError}
            </div>
          ) : contactRequests.length > 0 ? (
            contactRequests.slice(0, 3).map((request, index) => (
              <div key={index} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{request.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Mail className="mr-1 h-3 w-3" />
                      {request.email}
                    </div>
                  </div>
                  <div className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    request.status?.toLowerCase() === "pending" 
                      ? "bg-yellow-500/10 text-yellow-500"
                      : request.status?.toLowerCase() === "approved"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                  )}>
                    {request.status?.charAt(0).toUpperCase() + request.status?.slice(1).toLowerCase()}
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="mr-1 h-3 w-3" />
                  <span className="capitalize">{request.user_type}</span>
                </div>
                <Link 
                  href="/admin/contact-requests"
                  className="text-xs text-blue-500 hover:underline"
                >
                  View details
                </Link>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No pending contact requests
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout userType="admin">
      {/* Main Container with adaptive max width based on device */}
      <div className={cn(
        "mx-auto px-4 space-y-6",
        isMobile ? "max-w-lg" : "max-w-7xl"
      )}>
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Admin</h1>
            <p className="text-muted-foreground">Here's what's happening with your platform today.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddDriverModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
            <Button variant="outline" onClick={() => setShowAddCustomerModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        {renderStats()}

        {/* Main Content Grid */}
        {isMobile ? (
          // Mobile Layout
          <div className="space-y-6">
            {/* Recent Communications */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Recent Chats</CardTitle>
                    <CardDescription>Latest communications</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                    <Link href="/admin/messages">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="divide-y max-h-[200px]">
                  {recentChats.map((chat) => {
                    const otherParticipant = chat.participants.find(p => p.type !== "admin");
                    const lastMessage = dummyCommunication.messages
                      .filter(m => m.conversation_id === chat.id)
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

                    return (
                      <Link 
                        key={chat.id} 
                        href={`/admin/messages/${chat.id}`}
                        className="block p-4 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={otherParticipant?.avatar} />
                            <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{otherParticipant?.name}</p>
                              <span className="text-xs text-muted-foreground">{chat.lastMessageTime}</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">{chat.lastMessage}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Contact Requests - Use the new function */}
            {renderContactRequests()}

            {/* Rides Management Section */}
            {renderRidesManagement()}

            {/* Driver Fleet Section */}
            {renderDriverFleet()}

            {/* Customer Management Section */}
            {renderCustomerManagement()}
          </div>
        ) : (
          // Desktop Layout
          <div className="grid grid-cols-2 gap-4">
            {/* Driver Fleet Section - Full width on desktop */}
            <div className="col-span-2">
              {renderDriverFleet()}
            </div>

            {/* Customer Management Section - Full width on desktop */}
            <div className="col-span-2">
              {renderCustomerManagement()}
            </div>

            {/* Recent Communications */}
            <div className="col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Recent Chats</CardTitle>
                      <CardDescription>Latest communications</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                      <Link href="/admin/messages">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="divide-y max-h-[300px]">
                    {recentChats.map((chat) => {
                      const otherParticipant = chat.participants.find(p => p.type !== "admin");
                      return (
                        <Link 
                          key={chat.id} 
                          href={`/admin/messages/${chat.id}`}
                          className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                        >
                          <Avatar>
                            <AvatarImage src={otherParticipant?.avatar} />
                            <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{otherParticipant?.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {otherParticipant?.type === "driver" ? "Driver" : "Customer"}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {chat.lastMessageTime}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.lastMessage}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Contact Requests - Use the new function */}
            <div className="col-span-1">
              {renderContactRequests()}
            </div>

            {/* Rides Management Section */}
            <div className="col-span-2">
              {renderRidesManagement()}
            </div>
          </div>
        )}
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

      {/* Add Customer Modal */}
      <Dialog open={showAddCustomerModal} onOpenChange={setShowAddCustomerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Create a new customer account</DialogDescription>
          </DialogHeader>
          {error && (
            <div className="mb-4 p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}
          <form className="space-y-4" id="add-customer-form" onSubmit={handleAddCustomer}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                type="email" 
                placeholder="email@example.com" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 123-4567" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                value={customerPassword}
                onChange={(e) => setCustomerPassword(e.target.value)}
                type="password" 
                placeholder="Create a strong password" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input 
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                placeholder="City, Country" 
              />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={closeCustomerModal} type="button">
              Cancel
            </Button>
            <Button 
              onClick={handleAddCustomer} 
              disabled={isSubmitting}
              type="submit"
              form="add-customer-form"
            >
              {isSubmitting ? 'Creating...' : 'Create Customer'}
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
                  <div className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1",
                    selectedDriver.status === "Active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  )}>
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
                  <p className="text-base">{selectedDriver.totalRides}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Model:</span>{' '}
                    {selectedDriver.vehicle.model}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Year:</span>{' '}
                    {selectedDriver.vehicle.year}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Color:</span>{' '}
                    {selectedDriver.vehicle.color}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Plate:</span>{' '}
                    {selectedDriver.vehicle.plate}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Earnings</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Today:</span>{' '}
                    ${selectedDriver.earnings?.today || 0}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Week:</span>{' '}
                    ${selectedDriver.earnings?.week || 0}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Month:</span>{' '}
                    ${selectedDriver.earnings?.month || 0}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDriverModal(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowViewDriverModal(false);
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
            <Button variant="outline" onClick={() => setShowEditDriverModal(false)} type="button">
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

      {/* Delete Driver Confirmation */}
      <Dialog open={showDeleteDriverConfirmation} onOpenChange={setShowDeleteDriverConfirmation}>
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
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDriverConfirmation(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDeleteDriver}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Driver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Customer Modal */}
      <Dialog open={showViewCustomerModal} onOpenChange={setShowViewCustomerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>View customer information</DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-base">{selectedCustomer.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <div className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1",
                    selectedCustomer.status === "Active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {selectedCustomer.status}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-base">{selectedCustomer.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p className="text-base">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p className="text-base">{selectedCustomer.location || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Rating</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                    <span>{selectedCustomer.rating}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Rides</h3>
                  <p className="text-base">{selectedCustomer.totalRides}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
                  <p className="text-base">${selectedCustomer.totalSpent}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewCustomerModal(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowViewCustomerModal(false);
              if (selectedCustomer) handleEditCustomer(selectedCustomer);
            }}>
              Edit Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Modal */}
      <Dialog open={showEditCustomerModal} onOpenChange={setShowEditCustomerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer information</DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="mb-4 p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md">
              {error}
            </div>
          )}
          
          <form className="space-y-4" id="edit-customer-form" onSubmit={handleUpdateCustomer}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Full Name" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                type="email" 
                placeholder="email@example.com" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 123-4567" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input 
                value={customerLocation}
                onChange={(e) => setCustomerLocation(e.target.value)}
                placeholder="City, Country" 
              />
            </div>
          </form>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditCustomerModal(false)} type="button">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCustomer} 
              disabled={isSubmitting}
              type="submit"
              form="edit-customer-form"
            >
              {isSubmitting ? 'Updating...' : 'Update Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Confirmation */}
      <Dialog open={showDeleteCustomerConfirmation} onOpenChange={setShowDeleteCustomerConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="border rounded-md p-3 bg-muted/50">
              <p className="font-medium">{selectedCustomer.name}</p>
              <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
              <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteCustomerConfirmation(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDeleteCustomer}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Customer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 