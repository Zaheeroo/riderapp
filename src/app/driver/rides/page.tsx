"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, MapPin, Phone, Star, Car, DollarSign, Calendar, Loader2, Edit, CircleUser, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useAuth } from "../../../../contexts";
import { useToast } from "@/hooks/use-toast";
import { RideService } from "../../../../lib/services/ride-service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Add type definitions
type RideStatus = "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
type RideStatusMap = {
  [key: string]: RideStatus;
};

type EditFormData = {
  current_location?: string;
  estimated_arrival_time?: string;
  driver_notes?: string;
};

export default function DriverRidesPage() {
  const { isMobile } = useDeviceType();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ title: string; description: string } | null>(null);
  const [driverData, setDriverData] = useState<any>(null);
  const [upcomingRides, setUpcomingRides] = useState<any[]>([]);
  const [completedRides, setCompletedRides] = useState<any[]>([]);
  const [stats, setStats] = useState({
    todayRides: 0,
    totalDistance: 0,
    todayEarnings: 0,
    rating: 0
  });
  
  // Add state for ride statuses
  const [rideStatuses, setRideStatuses] = useState<RideStatusMap>({});

  // Add state for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to handle status change
  const handleStatusChange = async (rideId: number, newStatus: RideStatus) => {
    try {
      // Optimistically update the UI
      setRideStatuses(prev => ({
        ...prev,
        [rideId]: newStatus
      }));
      
      if (!driverData?.id) {
        throw new Error('Driver ID not found');
      }

      const response = await fetch('/api/driver/rides/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rideId,
          driverId: driverData.id,
          updates: { status: newStatus }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update ride status');
      }

      const { data } = await response.json();
      
      toast({
        title: "Success",
        description: `Ride status updated to ${newStatus}`,
        variant: "success",
      });
      
      // Update the rides lists
      if (newStatus === 'Completed') {
        const ride = upcomingRides.find(r => r.id === rideId);
        if (ride) {
          setUpcomingRides(prev => prev.filter(r => r.id !== rideId));
          setCompletedRides(prev => [...prev, { ...ride, status: newStatus }]);
        }
      }
    } catch (error: any) {
      console.error('Error updating ride status:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update ride status",
        variant: "destructive",
      });
      
      // Revert the status in the UI
      setRideStatuses(prev => {
        const newStatuses = { ...prev };
        delete newStatuses[rideId];
        return newStatuses;
      });
    }
  };
  
  // Function to handle opening edit modal
  const handleEditClick = (ride: any) => {
    setSelectedRide(ride);
    setEditFormData({
      current_location: ride.current_location || '',
      estimated_arrival_time: ride.estimated_arrival_time || '',
      driver_notes: ride.driver_notes || ''
    });
    setShowEditModal(true);
  };

  // Function to handle edit form submission
  const handleEditSubmit = async () => {
    if (!selectedRide || !driverData) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/driver/rides/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rideId: selectedRide.id,
          driverId: driverData.id,
          updates: editFormData
        }),
      });

      const { data, error } = await response.json();
      
      if (error) throw new Error(error);
      
      // Update the ride in the local state
      const updatedRides = upcomingRides.map(ride => 
        ride.id === selectedRide.id ? { ...ride, ...editFormData } : ride
      );
      setUpcomingRides(updatedRides);
      
      toast({
        title: "Success",
        description: "Ride details updated successfully",
        variant: "success",
      });
      
      setShowEditModal(false);
    } catch (error: any) {
      console.error('Error updating ride:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update ride details",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError({
          title: "Not Authenticated",
          description: "Please sign in to access this page."
        });
        setLoading(false);
        return;
      }

      if (!user.id) {
        setError({
          title: "Authentication Error",
          description: "User ID is missing. Please try signing out and signing in again."
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // First, get the driver profile for the current user
        const driverResponse = await fetch(`/api/drivers/by-user/${user.id}`);
        
        if (!driverResponse.ok) {
          const errorData = await driverResponse.json();
          throw new Error(errorData.error || 'Failed to fetch driver profile');
        }
        
        const driverResult = await driverResponse.json();
        
        if (!driverResult.data) {
          setError({
            title: "Driver Profile Required",
            description: "You need to complete your driver registration to access this page."
          });
          setLoading(false);
          return;
        }
        
        setDriverData(driverResult.data);
        
        // Then, get the rides for this driver
        const ridesResponse = await fetch(`/api/driver/rides?driverId=${driverResult.data.id}`);
        if (!ridesResponse.ok) {
          throw new Error('Failed to fetch rides');
        }
        
        const ridesResult = await ridesResponse.json();
        
        if (!ridesResult.data) {
          setUpcomingRides([]);
          setCompletedRides([]);
          return;
        }
        
        // Split rides into upcoming and completed
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const upcoming = [];
        const completed = [];
        let todayRidesCount = 0;
        let todayEarnings = 0;
        
        for (const ride of ridesResult.data) {
          // Initialize ride statuses
          setRideStatuses(prev => ({
            ...prev,
            [ride.id]: ride.status as RideStatus
          }));
          
          if (ride.status === 'Completed' || ride.status === 'Cancelled') {
            completed.push(ride);
          } else {
            upcoming.push(ride);
          }
          
          // Calculate today's stats
          if (ride.pickup_date === todayString) {
            todayRidesCount++;
            if (ride.status === 'Completed') {
              todayEarnings += parseFloat(ride.price);
            }
          }
        }
        
        setUpcomingRides(upcoming);
        setCompletedRides(completed);
        
        // Set stats
        setStats({
          todayRides: todayRidesCount,
          totalDistance: 284, // This would come from a real calculation in production
          todayEarnings: todayEarnings,
          rating: driverResult.data.rating || 4.9
        });
      } catch (error: any) {
        console.error('Error fetching driver data:', error);
        setError({
          title: "Error",
          description: error.message || "Failed to load your rides"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout userType="driver">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="driver">
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">{error.title}</h2>
            <p className="text-muted-foreground">{error.description}</p>
          </div>
          {error.title === "Profile Incomplete" ? (
            <Button
              onClick={() => window.location.href = '/profile/setup'}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Complete Profile
            </Button>
          ) : error.title.includes("Driver") ? (
            <Button
              onClick={() => window.location.href = '/driver/profile/setup'}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Complete Driver Registration
            </Button>
          ) : error.title.includes("Authentication") ? (
            <Button
              onClick={() => window.location.href = '/auth/signin'}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Sign In Again
            </Button>
          ) : null}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="driver">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Rides</h2>
          <p className="text-muted-foreground">
            View and manage your upcoming and completed rides
          </p>
        </div>

        {/* Stats Overview */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Rides</CardTitle>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                <ScrollArea className={cn(
                  "h-[calc(100vh-40rem)]",
                  "min-h-[100px]"
                )}>
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold">{stats.todayRides}</div>
                    <p className="text-xs text-muted-foreground">
                      {completedRides.filter(r => r.pickup_date === new Date().toISOString().split('T')[0]).length} completed
                    </p>
                    <p className="text-xs text-green-500">+2 from yesterday</p>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{stats.todayRides}</div>
                  <p className="text-xs text-muted-foreground">
                    {completedRides.filter(r => r.pickup_date === new Date().toISOString().split('T')[0]).length} completed
                  </p>
                  <p className="text-xs text-green-500">+2 from yesterday</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                <ScrollArea className={cn(
                  "h-[calc(100vh-40rem)]",
                  "min-h-[100px]"
                )}>
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold">{stats.totalDistance} km</div>
                    <p className="text-xs text-muted-foreground">
                      42 km today
                    </p>
                    <p className="text-xs text-green-500">+15% this week</p>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{stats.totalDistance} km</div>
                  <p className="text-xs text-muted-foreground">
                    42 km today
                  </p>
                  <p className="text-xs text-green-500">+15% this week</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                <ScrollArea className={cn(
                  "h-[calc(100vh-40rem)]",
                  "min-h-[100px]"
                )}>
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold">${stats.todayEarnings.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      ${stats.todayRides > 0 ? (stats.todayEarnings / stats.todayRides).toFixed(2) : '0'} per ride avg
                    </p>
                    <p className="text-xs text-green-500">+12% from yesterday</p>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">${stats.todayEarnings.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    ${stats.todayRides > 0 ? (stats.todayEarnings / stats.todayRides).toFixed(2) : '0'} per ride avg
                  </p>
                  <p className="text-xs text-green-500">+12% from yesterday</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              {isMobile ? (
                <ScrollArea className={cn(
                  "h-[calc(100vh-40rem)]",
                  "min-h-[100px]"
                )}>
                  <div className="flex flex-col">
                    <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days
                    </p>
                    <p className="text-xs text-green-500">+0.2 this month</p>
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                  <p className="text-xs text-green-500">+0.2 this month</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Rides */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Upcoming Rides</CardTitle>
            <CardDescription>Manage your scheduled rides</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingRides.length === 0 ? (
              <div className="flex justify-center items-center h-40 text-muted-foreground">
                No upcoming rides found
              </div>
            ) : (
              <>
                {isMobile ? (
                  <ScrollArea className={cn(
                    "h-[calc(100vh-20rem)]",
                    "min-h-[300px]",
                    "max-h-[500px]"
                  )}>
                    <div className="divide-y">
                      {upcomingRides.map((ride) => (
                        <div key={ride.id} className="p-6">
                          <div className="flex flex-col space-y-6">
                            {/* Header - Status, Trip Type, and Price */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  (rideStatuses[ride.id] || ride.status) === "Confirmed" ? "default" :
                                  (rideStatuses[ride.id] || ride.status) === "In Progress" ? "secondary" :
                                  "outline"
                                } className="px-3 py-1">
                                  {rideStatuses[ride.id] || ride.status}
                                </Badge>
                                {ride.trip_type && (
                                  <Badge variant="outline" className="px-3 py-1">
                                    {ride.trip_type}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded-md">
                                <span className="text-green-600">$</span>
                                <span className="text-lg font-semibold text-green-600">
                                  {parseFloat(ride.price).toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Left Column - Customer and Trip Info */}
                              <div className="space-y-6">
                                {/* Customer Information */}
                                <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-4">
                                  <Avatar className="h-12 w-12">
                                    <AvatarFallback className="bg-primary/10">
                                      {ride.customer?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'C'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="space-y-1">
                                    <p className="font-semibold text-lg">{ride.customer?.name || 'Unknown Customer'}</p>
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Phone className="mr-1 h-4 w-4" />
                                        {ride.customer?.phone || 'No phone'}
                                      </div>
                                      {ride.customer?.rating && (
                                        <div className="flex items-center text-sm text-muted-foreground">
                                          <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                                          {ride.customer.rating}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Locations */}
                                <div className="space-y-4">
                                  <div className="relative pl-8">
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-0.5 h-full bg-border" />
                                    <div className="space-y-4">
                                      <div className="relative">
                                        <div className="absolute left-[-1.85rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                                        <div>
                                          <p className="font-medium">Pickup Location</p>
                                          <p className="text-sm text-muted-foreground">{ride.pickup_location}</p>
                                          {ride.pickup_notes && (
                                            <p className="text-sm text-muted-foreground italic mt-1">Note: {ride.pickup_notes}</p>
                                          )}
                                        </div>
                                      </div>
                                      <div className="relative">
                                        <div className="absolute left-[-1.85rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                                        <div>
                                          <p className="font-medium">Dropoff Location</p>
                                          <p className="text-sm text-muted-foreground">{ride.dropoff_location}</p>
                                          {ride.dropoff_notes && (
                                            <p className="text-sm text-muted-foreground italic mt-1">Note: {ride.dropoff_notes}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column - Additional Details */}
                              <div className="space-y-6">
                                {/* Date and Time */}
                                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                                  <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                      <p className="font-medium">Pickup Date</p>
                                      <p className="text-sm text-muted-foreground">{ride.pickup_date}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <div>
                                      <p className="font-medium">Pickup Time</p>
                                      <p className="text-sm text-muted-foreground">{ride.pickup_time}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Ride Details */}
                                <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                                  <div>
                                    <p className="font-medium">Vehicle Type</p>
                                    <p className="text-sm text-muted-foreground">{ride.vehicle_type || 'Standard'}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Passengers</p>
                                    <p className="text-sm text-muted-foreground">{ride.passengers || '1'}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Payment Status</p>
                                    <p className="text-sm text-muted-foreground">{ride.payment_status || 'Pending'}</p>
                                  </div>
                                  {ride.distance && (
                                    <div>
                                      <p className="font-medium">Distance</p>
                                      <p className="text-sm text-muted-foreground">{ride.distance}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Special Requirements */}
                                {ride.special_requirements && (
                                  <div className="bg-muted/30 rounded-lg p-4">
                                    <div className="flex items-start gap-2">
                                      <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                      <div>
                                        <p className="font-medium">Special Requirements</p>
                                        <p className="text-sm text-muted-foreground">{ride.special_requirements}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 pt-2 border-t">
                              <Button variant="outline" size="sm" onClick={() => handleEditClick(ride)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Details
                              </Button>
                              <Select
                                value={rideStatuses[ride.id] || ride.status}
                                onValueChange={(value) => handleStatusChange(ride.id, value as RideStatus)}
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue placeholder="Change Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  {(ride.status === 'Pending' || ride.status === 'Confirmed' || ride.status === 'In Progress') && (
                                    <>
                                      {ride.status === 'Pending' && (
                                        <SelectItem value="Confirmed">Confirm Ride</SelectItem>
                                      )}
                                      {ride.status === 'Confirmed' && (
                                        <SelectItem value="In Progress">Start Ride</SelectItem>
                                      )}
                                      {ride.status === 'In Progress' && (
                                        <SelectItem value="Completed">Complete Ride</SelectItem>
                                      )}
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="divide-y">
                    {upcomingRides.map((ride) => (
                      <div key={ride.id} className="p-6">
                        <div className="flex flex-col space-y-6">
                          {/* Header - Status, Trip Type, and Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={
                                (rideStatuses[ride.id] || ride.status) === "Confirmed" ? "default" :
                                (rideStatuses[ride.id] || ride.status) === "In Progress" ? "secondary" :
                                "outline"
                              } className="px-3 py-1">
                                {rideStatuses[ride.id] || ride.status}
                              </Badge>
                              {ride.trip_type && (
                                <Badge variant="outline" className="px-3 py-1">
                                  {ride.trip_type}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded-md">
                              <span className="text-green-600">$</span>
                              <span className="text-lg font-semibold text-green-600">
                                {parseFloat(ride.price).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Main Content Grid */}
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Left Column - Customer and Trip Info */}
                            <div className="space-y-6">
                              {/* Customer Information */}
                              <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback className="bg-primary/10">
                                    {ride.customer?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'C'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                  <p className="font-semibold text-lg">{ride.customer?.name || 'Unknown Customer'}</p>
                                  <div className="flex items-center gap-4">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                      <Phone className="mr-1 h-4 w-4" />
                                      {ride.customer?.phone || 'No phone'}
                                    </div>
                                    {ride.customer?.rating && (
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                                        {ride.customer.rating}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Locations */}
                              <div className="space-y-4">
                                <div className="relative pl-8">
                                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-0.5 h-full bg-border" />
                                  <div className="space-y-4">
                                    <div className="relative">
                                      <div className="absolute left-[-1.85rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                                      <div>
                                        <p className="font-medium">Pickup Location</p>
                                        <p className="text-sm text-muted-foreground">{ride.pickup_location}</p>
                                        {ride.pickup_notes && (
                                          <p className="text-sm text-muted-foreground italic mt-1">Note: {ride.pickup_notes}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="relative">
                                      <div className="absolute left-[-1.85rem] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                                      <div>
                                        <p className="font-medium">Dropoff Location</p>
                                        <p className="text-sm text-muted-foreground">{ride.dropoff_location}</p>
                                        {ride.dropoff_notes && (
                                          <p className="text-sm text-muted-foreground italic mt-1">Note: {ride.dropoff_notes}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Column - Additional Details */}
                            <div className="space-y-6">
                              {/* Date and Time */}
                              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                  <Calendar className="h-5 w-5 text-primary" />
                                  <div>
                                    <p className="font-medium">Pickup Date</p>
                                    <p className="text-sm text-muted-foreground">{ride.pickup_date}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Clock className="h-5 w-5 text-primary" />
                                  <div>
                                    <p className="font-medium">Pickup Time</p>
                                    <p className="text-sm text-muted-foreground">{ride.pickup_time}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Ride Details */}
                              <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                                <div>
                                  <p className="font-medium">Vehicle Type</p>
                                  <p className="text-sm text-muted-foreground">{ride.vehicle_type || 'Standard'}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Passengers</p>
                                  <p className="text-sm text-muted-foreground">{ride.passengers || '1'}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Payment Status</p>
                                  <p className="text-sm text-muted-foreground">{ride.payment_status || 'Pending'}</p>
                                </div>
                                {ride.distance && (
                                  <div>
                                    <p className="font-medium">Distance</p>
                                    <p className="text-sm text-muted-foreground">{ride.distance}</p>
                                  </div>
                                )}
                              </div>

                              {/* Special Requirements */}
                              {ride.special_requirements && (
                                <div className="bg-muted/30 rounded-lg p-4">
                                  <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-medium">Special Requirements</p>
                                      <p className="text-sm text-muted-foreground">{ride.special_requirements}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2 pt-2 border-t">
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(ride)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Update Details
                            </Button>
                            <Select
                              value={rideStatuses[ride.id] || ride.status}
                              onValueChange={(value) => handleStatusChange(ride.id, value as RideStatus)}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Change Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {(ride.status === 'Pending' || ride.status === 'Confirmed' || ride.status === 'In Progress') && (
                                  <>
                                    {ride.status === 'Pending' && (
                                      <SelectItem value="Confirmed">Confirm Ride</SelectItem>
                                    )}
                                    {ride.status === 'Confirmed' && (
                                      <SelectItem value="In Progress">Start Ride</SelectItem>
                                    )}
                                    {ride.status === 'In Progress' && (
                                      <SelectItem value="Completed">Complete Ride</SelectItem>
                                    )}
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Completed Rides */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Completed Rides</CardTitle>
            <CardDescription>View your ride history and ratings</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {completedRides.length === 0 ? (
              <div className="flex justify-center items-center h-40 text-muted-foreground">
                No completed rides found
              </div>
            ) : (
              <>
                {isMobile ? (
                  <ScrollArea className={cn(
                    "h-[calc(100vh-20rem)]",
                    "min-h-[300px]",
                    "max-h-[500px]"
                  )}>
                    <div className="divide-y">
                      {completedRides.map((ride) => (
                        <div key={ride.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-4 flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">{ride.customer?.name || 'Unknown Customer'}</p>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    Rating: {ride.customer?.rating || '4.8'}/5
                                  </div>
                                  {ride.feedback && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      "{ride.feedback}"
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <Badge variant="default">{ride.status}</Badge>
                                  <p className="mt-1 text-lg font-semibold">${parseFloat(ride.price).toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center text-sm">
                                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p>Pickup: {ride.pickup_location}</p>
                                    <p>Dropoff: {ride.dropoff_location}</p>
                                  </div>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p>{ride.pickup_date} at {ride.pickup_time}</p>
                                    <p className="text-muted-foreground">{ride.trip_type}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="divide-y">
                    {completedRides.map((ride) => (
                      <div key={ride.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{ride.customer?.name || 'Unknown Customer'}</p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                                  Rating: {ride.customer?.rating || '4.8'}/5
                                </div>
                                {ride.feedback && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    "{ride.feedback}"
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <Badge variant="default">{ride.status}</Badge>
                                <p className="mt-1 text-lg font-semibold">${parseFloat(ride.price).toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p>Pickup: {ride.pickup_location}</p>
                                  <p>Dropoff: {ride.dropoff_location}</p>
                                </div>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p>{ride.pickup_date} at {ride.pickup_time}</p>
                                  <p className="text-muted-foreground">{ride.trip_type}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ride Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current_location">Current Location</Label>
              <Input
                id="current_location"
                value={editFormData.current_location}
                onChange={(e) => setEditFormData(prev => ({ ...prev, current_location: e.target.value }))}
                placeholder="Enter your current location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated_arrival_time">Estimated Arrival Time</Label>
              <Input
                id="estimated_arrival_time"
                type="time"
                value={editFormData.estimated_arrival_time}
                onChange={(e) => setEditFormData(prev => ({ ...prev, estimated_arrival_time: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver_notes">Notes</Label>
              <Textarea
                id="driver_notes"
                value={editFormData.driver_notes}
                onChange={(e) => setEditFormData(prev => ({ ...prev, driver_notes: e.target.value }))}
                placeholder="Add any notes about the ride"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 