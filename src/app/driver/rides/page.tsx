"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyDriverRides } from "@/data/dummy";
import { Clock, MapPin, Phone, Star, Car, DollarSign, Calendar, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeviceType } from "@/hooks/useDeviceType";
import { useAuth } from "../../../../contexts";
import { useToast } from "@/hooks/use-toast";
import { RideService } from "../../../../lib/services/ride-service";

// Add type definitions
type RideStatus = "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
type RideStatusMap = {
  [key: string]: RideStatus;
};

export default function DriverRidesPage() {
  const { isMobile } = useDeviceType();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
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

  // Function to handle status change
  const handleStatusChange = async (rideId: number, newStatus: RideStatus) => {
    try {
      setRideStatuses(prev => ({
        ...prev,
        [rideId]: newStatus
      }));
      
      const { data, error } = await RideService.updateRideStatus(rideId, newStatus);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Ride status updated to ${newStatus}`,
        variant: "success",
      });
      
      // If the ride is completed, move it from upcoming to completed
      if (newStatus === 'Completed') {
        const ride = upcomingRides.find(r => r.id === rideId);
        if (ride) {
          setUpcomingRides(prev => prev.filter(r => r.id !== rideId));
          setCompletedRides(prev => [...prev, { ...ride, status: newStatus }]);
        }
      }
    } catch (error) {
      console.error('Error updating ride status:', error);
      toast({
        title: "Error",
        description: "Failed to update ride status",
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
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // First, get the driver profile for the current user
        const { data: driverData, error: driverError } = await fetch(`/api/drivers/by-user/${user.id}`)
          .then(res => res.json());
        
        if (driverError) throw driverError;
        if (!driverData) throw new Error('Driver profile not found');
        
        setDriverData(driverData);
        
        // Then, get the rides for this driver
        const { data: ridesData, error: ridesError } = await RideService.getDriverRides(driverData.id);
        
        if (ridesError) throw ridesError;
        
        // Split rides into upcoming and completed
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        const upcoming = [];
        const completed = [];
        let todayRidesCount = 0;
        let todayEarnings = 0;
        
        for (const ride of ridesData || []) {
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
          totalDistance: 284, // This would come from a real calculation in a production app
          todayEarnings: todayEarnings,
          rating: driverData.rating || 4.9
        });
      } catch (error) {
        console.error('Error fetching driver rides:', error);
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

  if (loading) {
    return (
      <DashboardLayout userType="driver">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{stats.todayRides}</div>
                  <p className="text-xs text-muted-foreground">
                    {completedRides.filter(r => r.pickup_date === new Date().toISOString().split('T')[0]).length} completed
                  </p>
                  <p className="text-xs text-green-500">+2 from yesterday</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{stats.totalDistance} km</div>
                  <p className="text-xs text-muted-foreground">
                    42 km today
                  </p>
                  <p className="text-xs text-green-500">+15% this week</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">${stats.todayEarnings.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    ${stats.todayRides > 0 ? (stats.todayEarnings / stats.todayRides).toFixed(2) : '0'} per ride avg
                  </p>
                  <p className="text-xs text-green-500">+12% from yesterday</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{stats.rating.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">
                    Last 30 days
                  </p>
                  <p className="text-xs text-green-500">+0.2 this month</p>
                </div>
              </ScrollArea>
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
            <ScrollArea className={cn(
              isMobile ? "max-h-[400px]" : "max-h-[500px]"
            )}>
              {upcomingRides.length === 0 ? (
                <div className="flex justify-center items-center h-40 text-muted-foreground">
                  No upcoming rides found
                </div>
              ) : (
                <div className="divide-y">
                  {upcomingRides.map((ride) => (
                    <div key={ride.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{ride.customer?.name || 'Unknown Customer'}</p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Phone className="mr-1 h-3 w-3" />
                                {ride.customer?.phone || 'No phone'}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                                {ride.customer?.rating || '4.8'}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={
                                (rideStatuses[ride.id] || ride.status) === "Completed" ? "default" :
                                (rideStatuses[ride.id] || ride.status) === "In Progress" ? "secondary" :
                                (rideStatuses[ride.id] || ride.status) === "Confirmed" ? "outline" :
                                "outline"
                              }>
                                {rideStatuses[ride.id] || ride.status}
                              </Badge>
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
                      <div className="mt-4 flex justify-end space-x-2">
                        <Button variant="outline" size="sm">Contact Customer</Button>
                        <Select
                          value={rideStatuses[ride.id] || ride.status}
                          onValueChange={(value) => handleStatusChange(ride.id, value as RideStatus)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Change Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Confirmed">Confirmed</SelectItem>
                            <SelectItem value="In Progress">Start Ride</SelectItem>
                            <SelectItem value="Completed">Complete Ride</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Completed Rides */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Completed Rides</CardTitle>
            <CardDescription>View your ride history and ratings</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className={cn(
              isMobile ? "max-h-[400px]" : "max-h-[500px]"
            )}>
              {completedRides.length === 0 ? (
                <div className="flex justify-center items-center h-40 text-muted-foreground">
                  No completed rides found
                </div>
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 