"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyDrivers, dummyCommunication } from "@/data/dummy";
import { Car, MapPin, Plus, Clock, Phone, Star, DollarSign, MessageSquare, ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Custom hook for device detection
function useDeviceType() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Initial check
    checkDeviceType();

    // Add resize listener
    window.addEventListener('resize', checkDeviceType);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  return { isMobile, isTablet, isDesktop };
}

// Add type definitions
type RideStatus = "Confirmed" | "In Progress" | "Completed";
type RideStatusMap = {
  [key: string]: RideStatus;
};

type Driver = {
  id: number;
  name: string;
  email: string;
  vehicle: {
    model: string;
    color: string;
    year: string;
    plate: string;
    seats: number;
  };
  rating: number;
  totalRides: number;
  todayRides: {
    id: string;
    customer: string;
    from: string;
    to: string;
    time: string;
    status: string;
    price: number;
  }[];
  earnings: {
    today: number;
    week: number;
    month: number;
  };
  weekRides: number;
  monthRides: number;
};

export default function DriverDashboard() {
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const driver = dummyDrivers[0] as unknown as Driver; // Using first driver as example
  const recentChats = dummyCommunication.conversations
    .filter(conv => conv.participants.some(p => p.type === "driver"))
    .slice(0, 3); // Only show 3 most recent chats

  // Add state for ride statuses with proper typing
  const [rideStatuses, setRideStatuses] = useState<RideStatusMap>({});

  // Function to handle status change with proper typing
  const handleStatusChange = (rideId: string, newStatus: RideStatus) => {
    setRideStatuses(prev => ({
      ...prev,
      [rideId]: newStatus
    }));
  };

  return (
    <DashboardLayout userType="driver" showMobileHeader={false}>
      {/* Main Container with adaptive max width based on device */}
      <div className={cn(
        "mx-auto px-4 space-y-6",
        isMobile ? "max-w-lg" : isTablet ? "max-w-2xl" : "max-w-4xl"
      )}>
        {/* Welcome Section - Adaptive layout */}
        <div className={cn(
          "text-center py-6",
          !isMobile && "flex items-center justify-between"
        )}>
          <div className={cn(!isMobile && "text-left")}>
            <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome back!</h2>
            <p className="text-lg font-medium text-primary mb-1">{driver.name}</p>
            <p className="text-muted-foreground text-sm mb-4">Ready for today's rides?</p>
          </div>
          <Button className={cn(
            "w-full sm:w-auto",
            !isMobile && "ml-4"
          )} asChild>
            <Link href="/driver/rides">
              <Car className="mr-2 h-4 w-4" />
              View My Rides
            </Link>
          </Button>
        </div>

        {/* Quick Stats - Grid adapts to device size */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card className="bg-primary/5">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Today's Earnings</p>
              <p className="text-2xl font-bold text-primary">${driver.earnings.today}</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Rating</p>
              <p className="text-2xl font-bold text-primary">{driver.rating}</p>
            </CardContent>
          </Card>
          {!isMobile && (
            <>
              <Card className="bg-primary/5">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Messages</p>
                  <p className="text-2xl font-bold text-primary">{recentChats.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5">
                <CardContent className="p-4 text-center">
                  <Car className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Total Rides</p>
                  <p className="text-2xl font-bold text-primary">{driver.totalRides}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Content Layout adapts to device */}
        <div className={cn(
          "grid gap-6",
          isDesktop ? "grid-cols-1" : "grid-cols-1"
        )}>
          {/* Today's Rides */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Today's Rides</CardTitle>
                  <CardDescription>Your scheduled trips for today</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                  <Link href="/driver/rides">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className={cn(
                "divide-y",
                isMobile ? "max-h-[300px]" : "max-h-[400px]"
              )}>
                {driver.todayRides.map((ride) => (
                  <div key={ride.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={
                        (rideStatuses[ride.id] || ride.status) === "Completed" ? "default" :
                        (rideStatuses[ride.id] || ride.status) === "In Progress" ? "secondary" :
                        "outline"
                      }>
                        {rideStatuses[ride.id] || ride.status}
                      </Badge>
                      <span className="text-sm font-medium">${ride.price}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <p className="text-sm font-medium line-clamp-1">
                          {ride.from} → {ride.to}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <p className="text-sm text-muted-foreground">{ride.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{ride.customer[0]}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm">{ride.customer}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
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
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Lower section grid */}
          <div className={cn(
            "grid gap-6",
            isDesktop ? "grid-cols-2" : "grid-cols-1"
          )}>
            {/* Earnings Overview */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Earnings</CardTitle>
                    <CardDescription>Your earnings overview</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                    <Link href="/driver/earnings">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className={cn(
                  "divide-y",
                  isMobile ? "max-h-[200px]" : "max-h-[300px]"
                )}>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Today</p>
                          <p className="text-xs text-muted-foreground">{driver.todayRides.length} rides</p>
                        </div>
                        <p className="text-lg font-bold text-primary">${driver.earnings.today}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">This Week</p>
                          <p className="text-xs text-muted-foreground">{driver.weekRides} rides</p>
                        </div>
                        <p className="text-lg font-bold text-primary">${driver.earnings.week}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">This Month</p>
                          <p className="text-xs text-muted-foreground">{driver.monthRides} rides</p>
                        </div>
                        <p className="text-lg font-bold text-primary">${driver.earnings.month}</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Recent Messages */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Recent Messages</CardTitle>
                    <CardDescription>Your latest conversations</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                    <Link href="/driver/messages">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className={cn(
                  "divide-y",
                  isMobile ? "max-h-[200px]" : "max-h-[300px]"
                )}>
                  {recentChats.map((chat) => {
                    const otherParticipant = chat.participants.find(p => p.type !== "driver");
                    const lastMessage = dummyCommunication.messages
                      .filter(m => m.conversation_id === chat.id)
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

                    return (
                      <Link 
                        key={chat.id} 
                        href={`/driver/messages?chat=${chat.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                      >
                        <Avatar>
                          <AvatarImage src={otherParticipant?.avatar} />
                          <AvatarFallback>{otherParticipant?.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{otherParticipant?.name}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(lastMessage?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {lastMessage?.message}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 