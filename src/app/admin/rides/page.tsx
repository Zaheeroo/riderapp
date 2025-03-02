"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dummyCustomersExtended, dummyDrivers, dummyBookingData, dummyAdminStats } from "@/data/dummy";
import { Car, Clock, MapPin, Plus, Search, Users, DollarSign, Calendar, Loader2, FolderX } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useToast } from "@/hooks/use-toast";
import { RideService, RideData } from "../../../../lib/services/ride-service";
import { useAuth } from "../../../../contexts";
import { format } from "date-fns";

export default function AdminRidesPage() {
  const { isMobile } = useDeviceType();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayRides: 0,
    weeklyRides: 0,
    revenueToday: 0,
    activeDrivers: 0
  });
  
  // Form state
  const [formData, setFormData] = useState<Partial<RideData>>({
    customer_id: undefined,
    driver_id: null,
    pickup_location: '',
    dropoff_location: '',
    pickup_date: '',
    pickup_time: '',
    trip_type: '',
    vehicle_type: '',
    passengers: 1,
    price: 0,
    payment_status: 'Pending',
    special_requirements: '',
    admin_notes: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch rides
        const { data: ridesData, error: ridesError } = await RideService.getAllRides();
        
        if (ridesError) {
          console.error('Error fetching rides:', ridesError);
          throw ridesError;
        }
        
        console.log('Rides data fetched:', ridesData);
        setRides(ridesData || []);
        
        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todayRides = ridesData?.filter(ride => ride.pickup_date === today) || [];
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weeklyRides = ridesData?.filter(ride => new Date(ride.pickup_date) >= weekStart) || [];
        
        setStats({
          todayRides: todayRides.length,
          weeklyRides: weeklyRides.length,
          revenueToday: todayRides.reduce((sum, ride) => sum + parseFloat(ride.price), 0),
          activeDrivers: new Set(ridesData?.filter(ride => ride.driver_id).map(ride => ride.driver_id)).size
        });
        
        // Fetch customers and drivers for the form
        // In a real app, you would fetch these from your database
        setCustomers(dummyCustomersExtended);
        setDrivers(dummyDrivers);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load rides data. Please check your connection and try again.",
          variant: "destructive",
        });
        
        // Set empty rides array to show "No rides found" message
        setRides([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user, toast]);
  
  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create a ride",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form
    if (!formData.customer_id || !formData.pickup_location || !formData.dropoff_location || 
        !formData.pickup_date || !formData.pickup_time || !formData.trip_type || 
        !formData.vehicle_type || !formData.passengers || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setFormLoading(true);
    
    try {
      const { data, error } = await RideService.createRide(formData as RideData, user.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Ride created successfully",
        variant: "success",
      });
      
      // Reset form and refresh data
      setFormData({
        customer_id: undefined,
        driver_id: null,
        pickup_location: '',
        dropoff_location: '',
        pickup_date: '',
        pickup_time: '',
        trip_type: '',
        vehicle_type: '',
        passengers: 1,
        price: 0,
        payment_status: 'Pending',
        special_requirements: '',
        admin_notes: ''
      });
      
      // Add the new ride to the list
      setRides(prev => [data, ...prev]);
      
      // Close the form
      setShowNewTripForm(false);
    } catch (error) {
      console.error('Error creating ride:', error);
      toast({
        title: "Error",
        description: "Failed to create ride",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Rides Management</h2>
            <p className="text-muted-foreground">
              Create and manage scheduled trips
            </p>
          </div>
          <Button 
            className="w-full sm:w-auto"
            onClick={() => setShowNewTripForm(!showNewTripForm)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {showNewTripForm ? "Hide Form" : "Create New Trip"}
          </Button>
        </div>

        {/* Stats Overview */}
        <div className={cn(
          "grid gap-4 mb-8",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{stats.todayRides}</div>
                  <p className="text-xs text-muted-foreground">
                    {rides.filter(r => r.status === "Completed" && r.pickup_date === new Date().toISOString().split('T')[0]).length} completed
                  </p>
                  <p className="text-xs text-green-500">+15% from yesterday</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Weekly Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{stats.weeklyRides}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(stats.weeklyRides / 7)} rides per day avg
                  </p>
                  <p className="text-xs text-green-500">+8% this week</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">${stats.revenueToday.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    ${stats.todayRides > 0 ? (stats.revenueToday / stats.todayRides).toFixed(2) : '0'} per ride avg
                  </p>
                  <p className="text-xs text-green-500">+12% from yesterday</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{stats.activeDrivers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeDrivers > 0 ? Math.round(rides.length / stats.activeDrivers) : '0'} rides per driver
                  </p>
                  <p className="text-xs text-green-500">+2 from yesterday</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Create New Trip Form - Collapsible */}
        {showNewTripForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Trip</CardTitle>
              <CardDescription>Fill in the details for the new trip</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  {/* Basic Info Section */}
                  <div className={cn(
                    "grid gap-4",
                    isMobile ? "grid-cols-1" : "grid-cols-2"
                  )}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Customer</label>
                      <Select 
                        onValueChange={(value) => handleInputChange('customer_id', parseInt(value))}
                        value={formData.customer_id?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a customer" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id.toString()}>
                              <div className="flex flex-col">
                                <span className="font-medium">{customer.name}</span>
                                <span className="text-xs text-muted-foreground">{customer.phone}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Assign Driver</label>
                      <Select
                        onValueChange={(value) => handleInputChange('driver_id', value === 'none' ? null : parseInt(value))}
                        value={formData.driver_id?.toString() || 'none'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a driver" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Assign Later</SelectItem>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id.toString()}>
                              <div className="flex flex-col">
                                <span className="font-medium">{driver.name}</span>
                                <span className="text-xs text-muted-foreground">{driver.vehicle.model}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Trip Details Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Trip Type</label>
                      <Select
                        onValueChange={(value) => handleInputChange('trip_type', value)}
                        value={formData.trip_type}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select trip type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
                          <SelectItem value="Guided Tour">Guided Tour</SelectItem>
                          <SelectItem value="Point to Point Transfer">Point to Point Transfer</SelectItem>
                          <SelectItem value="Hourly Charter">Hourly Charter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pickup Location</label>
                      <Input 
                        placeholder="Hotel name, airport, or address" 
                        value={formData.pickup_location}
                        onChange={(e) => handleInputChange('pickup_location', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Destination</label>
                      <Input 
                        placeholder="Final destination" 
                        value={formData.dropoff_location}
                        onChange={(e) => handleInputChange('dropoff_location', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Date and Time Section */}
                  <div className={cn(
                    "grid gap-4",
                    isMobile ? "grid-cols-1" : "grid-cols-2"
                  )}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pickup Date</label>
                      <Input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]} 
                        value={formData.pickup_date}
                        onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pickup Time</label>
                      <Input 
                        type="time" 
                        value={formData.pickup_time}
                        onChange={(e) => handleInputChange('pickup_time', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Vehicle and Passengers Section */}
                  <div className={cn(
                    "grid gap-4",
                    isMobile ? "grid-cols-1" : "grid-cols-2"
                  )}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vehicle Type</label>
                      <Select
                        onValueChange={(value) => handleInputChange('vehicle_type', value)}
                        value={formData.vehicle_type}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          {dummyBookingData.vehicleTypes.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.name}>
                              <div className="flex flex-col">
                                <span className="font-medium">{vehicle.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  Up to {vehicle.features.includes("Extra Luggage Space") ? "12" : "6"} passengers
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Number of Passengers</label>
                      <Select
                        onValueChange={(value) => handleInputChange('passengers', parseInt(value))}
                        value={formData.passengers?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select passengers" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'passenger' : 'passengers'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price and Payment Section */}
                  <div className={cn(
                    "grid gap-4",
                    isMobile ? "grid-cols-1" : "grid-cols-2"
                  )}>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Trip Price ($)</label>
                      <Input 
                        type="number" 
                        placeholder="Enter trip price" 
                        value={formData.price?.toString() || ''}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Status</label>
                      <Select
                        onValueChange={(value) => handleInputChange('payment_status', value)}
                        value={formData.payment_status}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Partial">Partial Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Special Requirements</label>
                      <Textarea 
                        placeholder="Child seat, wheelchair access, specific language driver, etc."
                        className="min-h-[80px]"
                        value={formData.special_requirements || ''}
                        onChange={(e) => handleInputChange('special_requirements', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Admin Notes</label>
                      <Textarea 
                        placeholder="Internal notes (not visible to customer)"
                        className="min-h-[80px]"
                        value={formData.admin_notes || ''}
                        onChange={(e) => handleInputChange('admin_notes', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    onClick={() => setShowNewTripForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Trip'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Trips */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Upcoming Trips</CardTitle>
                <CardDescription>View and manage scheduled rides</CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Search trips..."
                  className="w-full sm:w-[300px]"
                />
                <Button variant="outline" className="shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px] overflow-auto">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : rides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <FolderX className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No rides found</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    There are no rides in the system yet. Create your first ride to get started.
                  </p>
                  <Button onClick={() => setShowAddRideForm(true)}>Add New Ride</Button>
                </div>
              ) : isMobile ? (
                // Mobile view - Card layout
                <div className="divide-y">
                  {rides.map((ride) => (
                    <div key={ride.id} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{ride.customer?.name || 'Unknown Customer'}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {ride.pickup_time}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {ride.dropoff_location}
                          </div>
                        </div>
                        <div className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          ride.status === "Completed" ? "bg-green-500/10 text-green-500" :
                          ride.status === "In Progress" ? "bg-blue-500/10 text-blue-500" :
                          ride.status === "Confirmed" ? "bg-blue-500/10 text-blue-500" :
                          ride.status === "Cancelled" ? "bg-red-500/10 text-red-500" :
                          "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {ride.status}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm">Driver: {ride.driver?.name || 'Unassigned'}</p>
                          <p className="text-sm font-medium">${parseFloat(ride.price).toFixed(2)}</p>
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
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rides.map((ride) => (
                        <TableRow key={ride.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">{ride.pickup_date}</p>
                              <p className="text-sm text-muted-foreground">{ride.pickup_time}</p>
                            </div>
                          </TableCell>
                          <TableCell>{ride.customer?.name || 'Unknown Customer'}</TableCell>
                          <TableCell>{ride.driver?.name || 'Unassigned'}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">From: {ride.pickup_location}</p>
                              <p className="text-sm">To: {ride.dropoff_location}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                              ride.status === "Completed" ? "bg-green-500/10 text-green-500" :
                              ride.status === "In Progress" ? "bg-blue-500/10 text-blue-500" :
                              ride.status === "Confirmed" ? "bg-blue-500/10 text-blue-500" :
                              ride.status === "Cancelled" ? "bg-red-500/10 text-red-500" :
                              "bg-yellow-500/10 text-yellow-500"
                            )}>
                              {ride.status}
                            </div>
                          </TableCell>
                          <TableCell>${parseFloat(ride.price).toFixed(2)}</TableCell>
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