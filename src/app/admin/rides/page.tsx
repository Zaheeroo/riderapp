'use client';

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Clock, MapPin, Phone, Star, CircleUser, CreditCard, X, AlertCircle, Plus, Search, Users, DollarSign, Calendar, Loader2, Pencil } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "../../../../contexts";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/useDeviceType";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Label } from "@/components/ui/label";

// Add MapPinned icon as a custom component since it's not available in lucide-react
const MapPinned = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function AdminRidesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isMobile } = useDeviceType();
  const [upcomingRides, setUpcomingRides] = useState<any[]>([]);
  const [completedRides, setCompletedRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Edit form state
  const [editFormData, setEditFormData] = useState({
    pickup_location: '',
    dropoff_location: '',
    pickup_date: '',
    pickup_time: '',
    price: '',
    status: '',
    trip_type: '',
    vehicle_type: '',
    passengers: 1,
    payment_status: '',
    special_requirements: '',
    admin_notes: ''
  });
  
  // Stats
  const [stats, setStats] = useState({
    todayRides: 0,
    weeklyRides: 0,
    revenueToday: 0,
    activeDrivers: 0
  });

  useEffect(() => {
    // Only fetch data if we have a user
    if (!user) return;
    
    const fetchRides = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/admin/rides`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch rides');
        }
        
        const { data: ridesData, error: ridesError } = await response.json();
        
        if (ridesError) {
          throw new Error(ridesError);
        }
        
        if (!ridesData || ridesData.length === 0) {
          // No rides found, keep the empty arrays
          setIsLoading(false);
          return;
        }
        
        // Split rides into upcoming and completed
        const today = new Date();
        const upcoming = [];
        const completed = [];
        
        for (const ride of ridesData) {
          const rideDate = new Date(`${ride.pickup_date}T${ride.pickup_time}`);
          
          if (ride.status === 'Completed' || ride.status === 'Cancelled') {
            completed.push(ride);
          } else if (rideDate >= today || ride.status === 'In Progress') {
            upcoming.push(ride);
          } else {
            completed.push(ride);
          }
        }
        
        setUpcomingRides(upcoming);
        setCompletedRides(completed);
        
        // Calculate stats
        const todayString = today.toISOString().split('T')[0];
        const todayRides = ridesData.filter((ride: any) => ride.pickup_date === todayString);
        
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weeklyRides = ridesData.filter((ride: any) => new Date(ride.pickup_date) >= weekStart);
        
        const activeDrivers = new Set(ridesData.filter((ride: any) => ride.driver_id).map((ride: any) => ride.driver_id)).size;
        
        setStats({
          todayRides: todayRides.length,
          weeklyRides: weeklyRides.length,
          revenueToday: todayRides.reduce((sum: number, ride: any) => sum + parseFloat(ride.price), 0),
          activeDrivers: activeDrivers
        });
      } catch (error: any) {
        console.error('Error fetching rides:', error);
        setError(error.message || 'Failed to load rides');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRides();
  }, [user]);

  const handleCancelClick = (ride: any) => {
    setSelectedRide(ride);
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRide) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/rides/update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rideId: selectedRide.id, status: 'Cancelled' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel ride');
      }
      
      const { data } = await response.json();
      
      toast({
        title: "Success",
        description: "Ride has been cancelled",
        variant: "success",
      });
      
      // Update the local state
      setUpcomingRides(prev => prev.filter(ride => ride.id !== selectedRide.id));
      setCompletedRides(prev => [...prev, { ...data, status: 'Cancelled' }]);
      
      // Close the confirmation dialog
      setShowCancelConfirmation(false);
      setSelectedRide(null);
    } catch (error: any) {
      console.error('Error cancelling ride:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel the ride",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditClick = (ride: any) => {
    setSelectedRide(ride);
    setEditFormData({
      pickup_location: ride.pickup_location,
      dropoff_location: ride.dropoff_location,
      pickup_date: ride.pickup_date,
      pickup_time: ride.pickup_time,
      price: ride.price,
      status: ride.status,
      trip_type: ride.trip_type,
      vehicle_type: ride.vehicle_type,
      passengers: ride.passengers,
      payment_status: ride.payment_status,
      special_requirements: ride.special_requirements || '',
      admin_notes: ride.admin_notes || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRide) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/admin/rides/${selectedRide.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update ride');
      }
      
      const { data } = await response.json();
      
      toast({
        title: "Success",
        description: "Ride has been updated",
        variant: "success",
      });
      
      // Update the local state
      setUpcomingRides(prev => prev.map(ride => 
        ride.id === selectedRide.id ? data : ride
      ));
      setCompletedRides(prev => prev.map(ride => 
        ride.id === selectedRide.id ? data : ride
      ));
      
      // Close the modal
      setShowEditModal(false);
      setSelectedRide(null);
    } catch (error: any) {
      console.error('Error updating ride:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update the ride",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter rides based on search term
  const filteredUpcomingRides = upcomingRides.filter(ride => {
    const matchesSearch = 
      searchTerm === '' || 
      ride.pickup_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropoff_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      ride.status.toLowerCase() === statusFilter.toLowerCase();
      
    return matchesSearch && matchesStatus;
  });
  
  const filteredCompletedRides = completedRides.filter(ride => {
    const matchesSearch = 
      searchTerm === '' || 
      ride.pickup_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.dropoff_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      ride.status.toLowerCase() === statusFilter.toLowerCase();
      
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Rides Management</h2>
            <p className="text-muted-foreground">View and manage all customer rides</p>
          </div>
          <Button asChild>
            <Link href="/admin/rides/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Ride
            </Link>
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
                    {completedRides.filter(r => r.status === "Completed" && r.pickup_date === new Date().toISOString().split('T')[0]).length} completed
                  </p>
                  <p className="text-xs text-green-500">+8% from yesterday</p>
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
                  <p className="text-xs text-green-500">+12% this week</p>
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
                  <p className="text-xs text-green-500">+5% from yesterday</p>
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
                    {stats.activeDrivers > 0 ? Math.round((upcomingRides.length + completedRides.length) / stats.activeDrivers) : '0'} rides per driver
                  </p>
                  <p className="text-xs text-green-500">+3% this week</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by location, customer or driver..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-destructive">
                <p>{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Upcoming Rides */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Rides</CardTitle>
                <CardDescription>All scheduled trips</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredUpcomingRides.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming rides found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUpcomingRides.map((ride) => (
                      <Card key={ride.id}>
                        <CardContent className="p-6">
                          <div className="grid gap-6 sm:grid-cols-2">
                            {/* Customer and Driver Info */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {ride.customer?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'C'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{ride.customer?.name || 'Unknown Customer'}</p>
                                  <p className="text-sm text-muted-foreground">{ride.customer?.phone || 'No phone'}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {ride.driver?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'D'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{ride.driver?.name || 'Driver not assigned yet'}</p>
                                  {ride.driver && (
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Star className="mr-1 h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                                      {ride.driver.rating || '4.8'}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {ride.driver && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Car className="h-4 w-4" />
                                    <span>{ride.driver.vehicle_model} - {ride.driver.vehicle_color}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <CircleUser className="h-4 w-4" />
                                    <span>{ride.driver.vehicle_plate}</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Trip Details */}
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 mt-1 shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium">Pickup</p>
                                    <p className="text-sm text-muted-foreground">{ride.pickup_location}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPinned className="h-4 w-4 mt-1 shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium">Dropoff</p>
                                    <p className="text-sm text-muted-foreground">{ride.dropoff_location}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                <div>
                                  <p className="text-sm font-medium">Date</p>
                                  <p className="text-sm text-muted-foreground">{ride.pickup_date}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Time</p>
                                  <p className="text-sm text-muted-foreground">{ride.pickup_time}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                            <div className="flex flex-wrap items-center gap-4">
                              <Badge variant={ride.status === 'Confirmed' ? 'default' : 'secondary'}>
                                {ride.status}
                              </Badge>
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                <span className="text-sm">{ride.payment_status}</span>
                              </div>
                              <div className="font-medium">${parseFloat(ride.price).toFixed(2)}</div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <Button variant="outline" className="w-full sm:w-auto" asChild>
                                <Link href={`/admin/rides/${ride.id}`}>
                                  View Details
                                </Link>
                              </Button>
                              {ride.status !== 'In Progress' && (
                                <>
                                  <Button 
                                    variant="outline" 
                                    className="w-full sm:w-auto"
                                    onClick={() => handleEditClick(ride)}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Ride
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    className="w-full sm:w-auto"
                                    onClick={() => handleCancelClick(ride)}
                                  >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel Ride
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completed Rides */}
            <Card>
              <CardHeader>
                <CardTitle>Completed & Cancelled Rides</CardTitle>
                <CardDescription>Past trips</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredCompletedRides.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No completed or cancelled rides found.
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {filteredCompletedRides.map((ride) => (
                        <Card key={ride.id}>
                          <CardContent className="p-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                              {/* Customer and Driver Info */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>
                                      {ride.customer?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'C'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{ride.customer?.name || 'Unknown Customer'}</p>
                                    <p className="text-sm text-muted-foreground">{ride.customer?.phone || 'No phone'}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback>
                                      {ride.driver?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'D'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{ride.driver?.name || 'No Driver'}</p>
                                    {ride.driver && (
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Star className="mr-1 h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                                        {ride.driver.rating || '4.8'}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Trip Details */}
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 mt-1 shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium">Pickup</p>
                                      <p className="text-sm text-muted-foreground">{ride.pickup_location}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <MapPinned className="h-4 w-4 mt-1 shrink-0" />
                                    <div>
                                      <p className="text-sm font-medium">Dropoff</p>
                                      <p className="text-sm text-muted-foreground">{ride.dropoff_location}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Date</p>
                                    <p className="text-sm text-muted-foreground">{ride.pickup_date}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Time</p>
                                    <p className="text-sm text-muted-foreground">{ride.pickup_time}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                              <div className="flex flex-wrap items-center gap-4">
                                <Badge variant={ride.status === 'Completed' ? 'default' : 'destructive'}>
                                  {ride.status}
                                </Badge>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" />
                                  <span className="text-sm">{ride.payment_status}</span>
                                </div>
                                <div className="font-medium">${parseFloat(ride.price).toFixed(2)}</div>
                              </div>
                              <Button variant="outline" className="w-full sm:w-auto" asChild>
                                <Link href={`/admin/rides/${ride.id}`}>
                                  View Details
                                </Link>
                              </Button>
                              <div className="mt-4 flex justify-end space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleCancelClick(ride)}>
                                  Cancel Ride
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleEditClick(ride)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Select
                                  value={ride.status}
                                  onValueChange={async (value) => {
                                    try {
                                      const response = await fetch('/api/admin/rides/update-status', {
                                        method: 'PATCH',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ rideId: ride.id, status: value }),
                                      });
                                      
                                      if (!response.ok) {
                                        const errorData = await response.json();
                                        throw new Error(errorData.error || 'Failed to update status');
                                      }
                                      
                                      const { data } = await response.json();
                                      
                                      // Update local state
                                      setUpcomingRides(prev => prev.map(r => 
                                        r.id === ride.id ? data : r
                                      ));
                                      
                                      toast({
                                        title: "Success",
                                        description: `Ride status updated to ${value}`,
                                        variant: "success",
                                      });
                                    } catch (error: any) {
                                      console.error('Error updating status:', error);
                                      toast({
                                        title: "Error",
                                        description: error.message || "Failed to update status",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Change Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                Confirm Cancellation
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this ride? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedRide && (
              <div className="border rounded-md p-3 bg-muted/50">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Customer: {selectedRide.customer?.name || 'Unknown'}</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-sm text-muted-foreground">{selectedRide.pickup_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPinned className="h-4 w-4 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Dropoff</p>
                      <p className="text-sm text-muted-foreground">{selectedRide.dropoff_location}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{selectedRide.pickup_date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">{selectedRide.pickup_time}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCancelConfirmation(false)}
                disabled={isSubmitting}
              >
                Keep Ride
              </Button>
              <Button 
                variant="destructive"
                onClick={handleConfirmCancel}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cancelling...' : 'Cancel Ride'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Ride Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Ride</DialogTitle>
              <DialogDescription>Update ride information</DialogDescription>
            </DialogHeader>
            
            {error && (
              <div className="mb-4 p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}
            
            <form className="space-y-4" id="edit-ride-form" onSubmit={handleEditSubmit}>
              <div className="space-y-2">
                <Label htmlFor="pickup_location">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pickup_location"
                    value={editFormData.pickup_location}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, pickup_location: e.target.value }))}
                    placeholder="Enter pickup address"
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dropoff_location">Dropoff Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dropoff_location"
                    value={editFormData.dropoff_location}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, dropoff_location: e.target.value }))}
                    placeholder="Enter dropoff address"
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pickup_date">Pickup Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pickup_date"
                      type="date"
                      value={editFormData.pickup_date}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, pickup_date: e.target.value }))}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickup_time">Pickup Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pickup_time"
                      type="time"
                      value={editFormData.pickup_time}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, pickup_time: e.target.value }))}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={editFormData.status} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trip_type">Trip Type</Label>
                <Select 
                  value={editFormData.trip_type} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, trip_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="One-way">One-way</SelectItem>
                    <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
                    <SelectItem value="Guided Tour">Guided Tour</SelectItem>
                    <SelectItem value="Point to Point Transfer">Point to Point Transfer</SelectItem>
                    <SelectItem value="Hourly Charter">Hourly Charter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Select 
                  value={editFormData.vehicle_type} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, vehicle_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passengers">Number of Passengers</Label>
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="10"
                  value={editFormData.passengers}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_status">Payment Status</Label>
                <Select 
                  value={editFormData.payment_status} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, payment_status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="special_requirements">Special Requirements</Label>
                <Input
                  id="special_requirements"
                  value={editFormData.special_requirements}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, special_requirements: e.target.value }))}
                  placeholder="Any special requirements or requests"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_notes">Admin Notes</Label>
                <Input
                  id="admin_notes"
                  value={editFormData.admin_notes}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, admin_notes: e.target.value }))}
                  placeholder="Internal notes for admin use"
                />
              </div>
            </form>
            
            <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEditModal(false)} type="button">
                Cancel
              </Button>
              <Button 
                onClick={handleEditSubmit} 
                disabled={isSubmitting}
                type="submit"
                form="edit-ride-form"
              >
                {isSubmitting ? 'Updating...' : 'Update Ride'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 