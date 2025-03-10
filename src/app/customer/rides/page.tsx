'use client';

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Clock, MapPin, Phone, Star, CircleUser, CreditCard, X, AlertCircle, Plus, Pencil, Calendar } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "../../../../contexts";
import { useToast } from "@/hooks/use-toast";
import { RideService } from "../../../../lib/services/ride-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useDeviceType } from "@/hooks/useDeviceType";

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

export default function CustomerRidesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState<any>(null);
  const [upcomingRides, setUpcomingRides] = useState<any[]>([]);
  const [completedRides, setCompletedRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [selectedRide, setSelectedRide] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    pickup_date: "",
    pickup_time: "",
    passengers: "",
    special_requirements: "",
  });
  const { isMobile } = useDeviceType();

  useEffect(() => {
    // Only fetch data if we have a user
    if (!user) return;
    
    // First, get the customer profile for the current user
    const fetchCustomerProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/customers/by-user/${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch customer profile');
        }
        
        const { data: customerData, error: customerError } = await response.json();
        
        if (customerError) {
          throw new Error(customerError);
        }
        
        if (!customerData) {
          throw new Error('Customer profile not found');
        }
        
        setCustomerData(customerData);
        
        // Then fetch rides for this customer using the new API endpoint
        fetchCustomerRides(customerData.id);
      } catch (error: any) {
        console.error('Error fetching customer profile:', error);
        setError(error.message || 'Failed to load customer profile');
        setIsLoading(false);
      }
    };
    
    // Fetch rides for a customer using the new API endpoint
    const fetchCustomerRides = async (customerId: number) => {
      try {
        const response = await fetch(`/api/customer/rides?customerId=${customerId}`);
        
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
      } catch (error: any) {
        console.error('Error fetching customer rides:', error);
        setError(error.message || 'Failed to load rides');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomerProfile();
  }, [user]);

  const handleCancelClick = (ride: any) => {
    setSelectedRide(ride);
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRide) return;
    
    setIsSubmitting(true);
    
    try {
      // Use the new API endpoint instead of RideService
      const response = await fetch('/api/customer/rides/update-status', {
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
        description: "Your ride has been cancelled",
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
        description: error.message || "Failed to cancel your ride",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (ride: any) => {
    setSelectedRide(ride);
    setEditFormData({
      pickup_date: ride.pickup_date,
      pickup_time: ride.pickup_time,
      passengers: ride.passengers.toString(),
      special_requirements: ride.special_requirements || "",
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedRide || !customerData) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/customer/rides/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rideId: selectedRide.id,
          customerId: customerData.id,
          ...editFormData,
          passengers: parseInt(editFormData.passengers),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update ride');
      }
      
      const { data } = await response.json();
      
      // Update the local state
      setUpcomingRides(prev => 
        prev.map(ride => ride.id === selectedRide.id ? data : ride)
      );
      
      toast({
        title: "Success",
        description: "Your ride has been updated",
        variant: "success",
      });
      
      // Close the edit modal
      setShowEditModal(false);
      setSelectedRide(null);
    } catch (error: any) {
      console.error('Error updating ride:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update your ride",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout userType="customer">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">My Rides</h2>
            <p className="text-muted-foreground">View your upcoming and past rides</p>
          </div>
          <Button asChild>
            <Link href="/customer/book">
              <Plus className="mr-2 h-4 w-4" />
              Book a Ride
            </Link>
          </Button>
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
                <CardDescription>Your scheduled trips</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {upcomingRides.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any upcoming rides. 
                    <div className="mt-2">
                      <Button variant="outline" onClick={() => window.location.href = '/customer/book'}>
                        Book a Ride
                      </Button>
                    </div>
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
                                    <Badge variant={ride.status === "Confirmed" ? "default" : "secondary"}>
                                      {ride.status}
                                    </Badge>
                                    <Badge variant="outline">{ride.trip_type}</Badge>
                                  </div>
                                  <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded-md">
                                    <span className="text-green-600">$</span>
                                    <span className="text-lg font-semibold text-green-600">
                                      {parseFloat(ride.price).toFixed(2)}
                                    </span>
                                  </div>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Left Column - Driver and Trip Info */}
                                  <div className="space-y-6">
                                    {/* Driver Information */}
                                    {ride.driver && (
                                      <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-4">
                                        <Avatar className="h-12 w-12">
                                          <AvatarFallback className="bg-primary/10">
                                            {ride.driver?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'D'}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                          <p className="font-semibold text-lg">{ride.driver?.name || 'Driver not assigned yet'}</p>
                                          <div className="flex items-center gap-4">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                              <Phone className="mr-1 h-4 w-4" />
                                              {ride.driver?.phone || 'No phone'}
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground">
                                              <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                                              {ride.driver?.rating || '4.8'}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}

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

                                    {/* Vehicle Details */}
                                    {ride.driver && (
                                      <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                                        <div>
                                          <p className="font-medium">Vehicle</p>
                                          <p className="text-sm text-muted-foreground">
                                            {ride.driver.vehicle_model} - {ride.driver.vehicle_color}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="font-medium">Plate</p>
                                          <p className="text-sm text-muted-foreground">{ride.driver.vehicle_plate}</p>
                                        </div>
                                        <div>
                                          <p className="font-medium">Payment Status</p>
                                          <p className="text-sm text-muted-foreground">{ride.payment_status}</p>
                                        </div>
                                        <div>
                                          <p className="font-medium">Passengers</p>
                                          <p className="text-sm text-muted-foreground">{ride.passengers}</p>
                                        </div>
                                      </div>
                                    )}

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
                                  {ride.driver && (
                                    <Button variant="outline" size="sm">
                                      <Phone className="h-4 w-4 mr-2" />
                                      Contact Driver
                                    </Button>
                                  )}
                                  {ride.status !== 'Completed' && ride.status !== 'Cancelled' && (
                                    <Button variant="outline" size="sm" onClick={() => handleEditClick(ride)}>
                                      <Pencil className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                  )}
                                  {ride.status !== 'In Progress' && (
                                    <Button variant="destructive" size="sm" onClick={() => handleCancelClick(ride)}>
                                      <X className="h-4 w-4 mr-2" />
                                      Cancel
                                    </Button>
                                  )}
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
                                  <Badge variant={ride.status === "Confirmed" ? "default" : "secondary"}>
                                    {ride.status}
                                  </Badge>
                                  <Badge variant="outline">{ride.trip_type}</Badge>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded-md">
                                  <span className="text-green-600">$</span>
                                  <span className="text-lg font-semibold text-green-600">
                                    {parseFloat(ride.price).toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Main Content Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Driver and Trip Info */}
                                <div className="space-y-6">
                                  {/* Driver Information */}
                                  {ride.driver && (
                                    <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-4">
                                      <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-primary/10">
                                          {ride.driver?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'D'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="space-y-1">
                                        <p className="font-semibold text-lg">{ride.driver?.name || 'Driver not assigned yet'}</p>
                                        <div className="flex items-center gap-4">
                                          <div className="flex items-center text-sm text-muted-foreground">
                                            <Phone className="mr-1 h-4 w-4" />
                                            {ride.driver?.phone || 'No phone'}
                                          </div>
                                          <div className="flex items-center text-sm text-muted-foreground">
                                            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                                            {ride.driver?.rating || '4.8'}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

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

                                  {/* Vehicle Details */}
                                  {ride.driver && (
                                    <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                                      <div>
                                        <p className="font-medium">Vehicle</p>
                                        <p className="text-sm text-muted-foreground">
                                          {ride.driver.vehicle_model} - {ride.driver.vehicle_color}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Plate</p>
                                        <p className="text-sm text-muted-foreground">{ride.driver.vehicle_plate}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Payment Status</p>
                                        <p className="text-sm text-muted-foreground">{ride.payment_status}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Passengers</p>
                                        <p className="text-sm text-muted-foreground">{ride.passengers}</p>
                                      </div>
                                    </div>
                                  )}

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
                                {ride.driver && (
                                  <Button variant="outline" size="sm">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Contact Driver
                                  </Button>
                                )}
                                {ride.status !== 'Completed' && ride.status !== 'Cancelled' && (
                                  <Button variant="outline" size="sm" onClick={() => handleEditClick(ride)}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                )}
                                {ride.status !== 'In Progress' && (
                                  <Button variant="destructive" size="sm" onClick={() => handleCancelClick(ride)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                  </Button>
                                )}
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
                <CardDescription>View your ride history</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isMobile ? (
                  <ScrollArea className={cn(
                    "h-[calc(100vh-20rem)]",
                    "min-h-[300px]",
                    "max-h-[500px]"
                  )}>
                    {completedRides.length === 0 ? (
                      <div className="flex justify-center items-center h-40 text-muted-foreground">
                        No completed rides found
                      </div>
                    ) : (
                      <div className="divide-y">
                        {completedRides.map((ride) => (
                          <div key={ride.id} className="p-6">
                            <div className="flex flex-col space-y-6">
                              {/* Header - Status, Trip Type, and Price */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant={ride.status === "Completed" ? "default" : "destructive"}>
                                    {ride.status}
                                  </Badge>
                                  <Badge variant="outline">{ride.trip_type}</Badge>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded-md">
                                  <span className="text-green-600">$</span>
                                  <span className="text-lg font-semibold text-green-600">
                                    {parseFloat(ride.price).toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Main Content Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Driver and Trip Info */}
                                <div className="space-y-6">
                                  {/* Driver Information */}
                                  {ride.driver && (
                                    <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-4">
                                      <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-primary/10">
                                          {ride.driver?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'D'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="space-y-1">
                                        <p className="font-semibold text-lg">{ride.driver?.name || 'Driver not assigned'}</p>
                                        <div className="flex items-center gap-4">
                                          <div className="flex items-center text-sm text-muted-foreground">
                                            <Phone className="mr-1 h-4 w-4" />
                                            {ride.driver?.phone || 'No phone'}
                                          </div>
                                          <div className="flex items-center text-sm text-muted-foreground">
                                            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                                            {ride.driver?.rating || '4.8'}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

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

                                  {/* Vehicle Details */}
                                  {ride.driver && (
                                    <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                                      <div>
                                        <p className="font-medium">Vehicle</p>
                                        <p className="text-sm text-muted-foreground">
                                          {ride.driver.vehicle_model} - {ride.driver.vehicle_color}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Plate</p>
                                        <p className="text-sm text-muted-foreground">{ride.driver.vehicle_plate}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Payment Status</p>
                                        <p className="text-sm text-muted-foreground">{ride.payment_status}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Passengers</p>
                                        <p className="text-sm text-muted-foreground">{ride.passengers}</p>
                                      </div>
                                    </div>
                                  )}

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
                                {ride.status === 'Completed' && (
                                  <Button variant="outline" size="sm">
                                    Rate Trip
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                ) : (
                  <>
                    {completedRides.length === 0 ? (
                      <div className="flex justify-center items-center h-40 text-muted-foreground">
                        No completed rides found
                      </div>
                    ) : (
                      <div className="divide-y">
                        {completedRides.map((ride) => (
                          <div key={ride.id} className="p-6">
                            <div className="flex flex-col space-y-6">
                              {/* Header - Status, Trip Type, and Price */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant={ride.status === "Completed" ? "default" : "destructive"}>
                                    {ride.status}
                                  </Badge>
                                  <Badge variant="outline">{ride.trip_type}</Badge>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950/50 px-2.5 py-1 rounded-md">
                                  <span className="text-green-600">$</span>
                                  <span className="text-lg font-semibold text-green-600">
                                    {parseFloat(ride.price).toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {/* Main Content Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Driver and Trip Info */}
                                <div className="space-y-6">
                                  {/* Driver Information */}
                                  {ride.driver && (
                                    <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-4">
                                      <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-primary/10">
                                          {ride.driver?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'D'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="space-y-1">
                                        <p className="font-semibold text-lg">{ride.driver?.name || 'Driver not assigned'}</p>
                                        <div className="flex items-center gap-4">
                                          <div className="flex items-center text-sm text-muted-foreground">
                                            <Phone className="mr-1 h-4 w-4" />
                                            {ride.driver?.phone || 'No phone'}
                                          </div>
                                          <div className="flex items-center text-sm text-muted-foreground">
                                            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                                            {ride.driver?.rating || '4.8'}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

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

                                  {/* Vehicle Details */}
                                  {ride.driver && (
                                    <div className="grid grid-cols-2 gap-4 bg-muted/30 rounded-lg p-4">
                                      <div>
                                        <p className="font-medium">Vehicle</p>
                                        <p className="text-sm text-muted-foreground">
                                          {ride.driver.vehicle_model} - {ride.driver.vehicle_color}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Plate</p>
                                        <p className="text-sm text-muted-foreground">{ride.driver.vehicle_plate}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Payment Status</p>
                                        <p className="text-sm text-muted-foreground">{ride.payment_status}</p>
                                      </div>
                                      <div>
                                        <p className="font-medium">Passengers</p>
                                        <p className="text-sm text-muted-foreground">{ride.passengers}</p>
                                      </div>
                                    </div>
                                  )}

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
                                {ride.status === 'Completed' && (
                                  <Button variant="outline" size="sm">
                                    Rate Trip
                                  </Button>
                                )}
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

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Ride Details</DialogTitle>
              <DialogDescription>
                Make changes to your upcoming ride. Some fields may be locked depending on the ride status.
              </DialogDescription>
            </DialogHeader>
            
            {selectedRide && (
              <div className="space-y-4">
                {selectedRide.status !== 'In Progress' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="pickup_date">Pickup Date</Label>
                      <Input
                        id="pickup_date"
                        type="date"
                        value={editFormData.pickup_date}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, pickup_date: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pickup_time">Pickup Time</Label>
                      <Input
                        id="pickup_time"
                        type="time"
                        value={editFormData.pickup_time}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, pickup_time: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passengers">Number of Passengers</Label>
                      <Input
                        id="passengers"
                        type="number"
                        min="1"
                        max="8"
                        value={editFormData.passengers}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, passengers: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="special_requirements">Special Requirements</Label>
                  <Textarea
                    id="special_requirements"
                    value={editFormData.special_requirements}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, special_requirements: e.target.value }))}
                    placeholder="Any special requirements or notes for the driver..."
                  />
                </div>
              </div>
            )}
            
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
                {isSubmitting ? 'Updating...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 