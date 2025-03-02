'use client';

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Clock, MapPin, Phone, Star, CircleUser, CreditCard, X, AlertCircle } from "lucide-react";
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

  return (
    <DashboardLayout userType="customer">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">My Rides</h2>
          <p className="text-muted-foreground">View your upcoming and past rides</p>
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
              <CardContent>
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
                  <div className="space-y-4">
                    {upcomingRides.map((ride) => (
                      <Card key={ride.id}>
                        <CardContent className="p-6">
                          <div className="grid gap-6 sm:grid-cols-2">
                            {/* Driver and Vehicle Info */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={ride.driver?.avatar || '/placeholder-avatar.png'} alt={ride.driver?.name || 'Driver'} />
                                  <AvatarFallback>{ride.driver?.name?.[0] || 'D'}</AvatarFallback>
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
                              {ride.driver && (
                                <Button variant="outline" className="w-full sm:w-auto">
                                  <Phone className="mr-2 h-4 w-4" />
                                  Contact Driver
                                </Button>
                              )}
                              {ride.status !== 'In Progress' && (
                                <Button 
                                  variant="destructive" 
                                  className="w-full sm:w-auto"
                                  onClick={() => handleCancelClick(ride)}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Cancel Ride
                                </Button>
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
                <CardTitle>Completed Rides</CardTitle>
                <CardDescription>Your past trips</CardDescription>
              </CardHeader>
              <CardContent>
                {completedRides.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You don't have any completed rides yet.
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {completedRides.map((ride) => (
                        <Card key={ride.id}>
                          <CardContent className="p-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                              {/* Driver Info */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={ride.driver?.avatar || '/placeholder-avatar.png'} alt={ride.driver?.name || 'Driver'} />
                                    <AvatarFallback>{ride.driver?.name?.[0] || 'D'}</AvatarFallback>
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
                              {ride.status === 'Completed' && (
                                <Button variant="outline" className="w-full sm:w-auto">
                                  Rate Trip
                                </Button>
                              )}
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
      </div>
    </DashboardLayout>
  );
} 