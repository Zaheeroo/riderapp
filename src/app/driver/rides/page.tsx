"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyDriverRides } from "@/data/dummy";
import { Clock, MapPin, Phone, Star, Car, DollarSign, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeviceType } from "@/hooks/useDeviceType";

// Add type definitions
type RideStatus = "Confirmed" | "In Progress" | "Completed";
type RideStatusMap = {
  [key: string]: RideStatus;
};

export default function DriverRidesPage() {
  const { isMobile } = useDeviceType();
  // Add state for ride statuses
  const [rideStatuses, setRideStatuses] = useState<RideStatusMap>({});

  // Function to handle status change
  const handleStatusChange = (rideId: string, newStatus: RideStatus) => {
    setRideStatuses(prev => ({
      ...prev,
      [rideId]: newStatus
    }));
  };

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
                  <div className="text-2xl font-bold">{dummyDriverRides.upcomingRides.filter(r => r.date === new Date().toLocaleDateString()).length}</div>
                  <p className="text-xs text-muted-foreground">
                    {dummyDriverRides.upcomingRides.filter(r => r.status === "Completed").length} completed
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
                  <div className="text-2xl font-bold">284 km</div>
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
                  <div className="text-2xl font-bold">$245</div>
                  <p className="text-xs text-muted-foreground">
                    $35 per ride avg
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
                  <div className="text-2xl font-bold">4.9</div>
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
              <div className="divide-y">
                {dummyDriverRides.upcomingRides.map((ride) => (
                  <div key={ride.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{ride.customer.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Phone className="mr-1 h-3 w-3" />
                              {ride.customer.phone}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                              {ride.customer.rating}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={
                              (rideStatuses[ride.id] || ride.status) === "Completed" ? "default" :
                              (rideStatuses[ride.id] || ride.status) === "In Progress" ? "secondary" :
                              "outline"
                            }>
                              {rideStatuses[ride.id] || ride.status}
                            </Badge>
                            <p className="mt-1 text-lg font-semibold">${ride.price}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p>Pickup: {ride.pickup}</p>
                              <p>Dropoff: {ride.dropoff}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p>{ride.date} at {ride.time}</p>
                              <p className="text-muted-foreground">{ride.duration} ({ride.distance})</p>
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
              <div className="divide-y">
                {dummyDriverRides.completedRides.map((ride) => (
                  <div key={ride.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{ride.customer.name}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                              Rating: {ride.rating}/5
                            </div>
                            {ride.feedback && (
                              <p className="text-sm text-muted-foreground mt-1">
                                "{ride.feedback}"
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <Badge variant="default">{ride.status}</Badge>
                            <p className="mt-1 text-lg font-semibold">${ride.price}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p>Pickup: {ride.pickup}</p>
                              <p>Dropoff: {ride.dropoff}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            <div>
                              <p>{ride.date} at {ride.time}</p>
                              <p className="text-muted-foreground">{ride.duration} ({ride.distance})</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 