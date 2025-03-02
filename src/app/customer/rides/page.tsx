'use client';

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyCustomerRides } from "@/data/dummy";
import { Car, Clock, MapPin, Phone, Star, CircleUser, CreditCard, X, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "../../../../contexts";
import { useToast } from "@/hooks/use-toast";
import { RideService } from "../../../../lib/services/ride-service";

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
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState<any>(null);
  const [upcomingRides, setUpcomingRides] = useState<any[]>([]);
  const [completedRides, setCompletedRides] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // First, get the customer profile for the current user
        const { data: customerData, error: customerError } = await fetch(`/api/customers/by-user/${user.id}`)
          .then(res => res.json());
        
        if (customerError) throw customerError;
        if (!customerData) throw new Error('Customer profile not found');
        
        setCustomerData(customerData);
        
        // Then, get the rides for this customer
        const { data: ridesData, error: ridesError } = await RideService.getCustomerRides(customerData.id);
        
        if (ridesError) throw ridesError;
        
        // Split rides into upcoming and completed
        const today = new Date();
        const upcoming = [];
        const completed = [];
        
        for (const ride of ridesData || []) {
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
      } catch (error) {
        console.error('Error fetching customer rides:', error);
        toast({
          title: "Error",
          description: "Failed to load your rides",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);

  const handleCancelRide = async (rideId: number) => {
    try {
      const { data, error } = await RideService.updateRideStatus(rideId, 'Cancelled');
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your ride has been cancelled",
        variant: "success",
      });
      
      // Update the local state
      setUpcomingRides(prev => prev.filter(ride => ride.id !== rideId));
      setCompletedRides(prev => [...prev, { ...data, status: 'Cancelled' }]);
    } catch (error) {
      console.error('Error cancelling ride:', error);
      toast({
        title: "Error",
        description: "Failed to cancel your ride",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="customer">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="customer">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">My Rides</h2>
          <p className="text-muted-foreground">View your upcoming and past rides</p>
        </div>

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
                          <Button 
                            variant="destructive" 
                            className="w-full sm:w-auto"
                            onClick={() => handleCancelRide(ride.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Cancel Ride
                          </Button>
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
            <CardDescription>Your ride history</CardDescription>
          </CardHeader>
          <CardContent>
            {completedRides.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                You don't have any completed rides yet.
              </div>
            ) : (
              <ScrollArea className="max-h-[500px]">
                <div className="space-y-4">
                  {completedRides.map((ride) => (
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
                                <p className="font-medium">{ride.driver?.name || 'Driver not assigned'}</p>
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
                            <Badge variant={ride.status === 'Completed' ? 'default' : 'secondary'}>
                              {ride.status}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              <span className="text-sm">{ride.payment_status}</span>
                            </div>
                            <div className="font-medium">${parseFloat(ride.price).toFixed(2)}</div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            {ride.status === 'Completed' && (
                              <Button variant="outline" className="w-full sm:w-auto">
                                Rate Trip
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              className="w-full sm:w-auto"
                              onClick={() => window.location.href = '/customer/book'}
                            >
                              Book Similar
                            </Button>
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
      </div>
    </DashboardLayout>
  );
} 