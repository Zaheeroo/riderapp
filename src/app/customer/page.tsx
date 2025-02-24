"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyCustomers, dummyCommunication } from "@/data/dummy";
import { Car, MapPin, Plus, Clock, Phone, Star, Calendar, MessageSquare, ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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

export default function CustomerDashboard() {
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const customer = dummyCustomers[0]; // Using first customer as example
  const recentChats = dummyCommunication.conversations
    .filter(conv => conv.participants.some(p => p.type === "customer"))
    .slice(0, 3); // Only show 3 most recent chats

  return (
    <DashboardLayout userType="customer" showMobileHeader={false}>
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
            <p className="text-lg font-medium text-primary mb-1">{customer.name}</p>
            <p className="text-muted-foreground text-sm mb-4">Ready for your next adventure?</p>
          </div>
          <Button className={cn(
            "w-full sm:w-auto",
            !isMobile && "ml-4"
          )} asChild>
            <Link href="/customer/book">
              <Plus className="mr-2 h-4 w-4" />
              Book a Ride
            </Link>
          </Button>
        </div>

        {/* Quick Stats - Grid adapts to device size */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">{customer.pastRides.length}</div>
                <p className="text-xs text-muted-foreground">
                  Completed rides
                </p>
                <p className="text-xs text-green-500">+{customer.upcomingRides.length} scheduled</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">4.9</div>
                <p className="text-xs text-muted-foreground">
                  Based on {customer.pastRides.length} rides
                </p>
                <p className="text-xs text-green-500">Top rated customer</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">{recentChats.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active conversations
                </p>
                <p className="text-xs text-green-500">2 new today</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Places visited
                </p>
                <p className="text-xs text-green-500">+3 this month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Layout adapts to device */}
        <div className={cn(
          "grid gap-6",
          isDesktop ? "grid-cols-2" : "grid-cols-1"
        )}>
          {/* Recent Chats */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Recent Chats</CardTitle>
                  <CardDescription>Stay in touch with your drivers</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                  <Link href="/customer/messages">
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
                  const otherParticipant = chat.participants.find(p => p.type !== "customer");
                  const lastMessage = dummyCommunication.messages
                    .filter(m => m.conversation_id === chat.id)
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

                  return (
                    <Link 
                      key={chat.id} 
                      href={`/customer/messages?chat=${chat.id}`}
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

          {/* My Rides Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">My Rides</CardTitle>
                  <CardDescription>View your upcoming and past rides</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                  <Link href="/customer/rides">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className={cn(
                isMobile ? "max-h-[300px]" : "max-h-[400px]"
              )}>
                <div className="space-y-4 p-4">
                  {/* Upcoming Rides */}
                  {customer.upcomingRides.map((ride) => (
                    <Card key={ride.id} className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <Badge 
                          className="absolute top-2 right-2"
                          variant={ride.status === "Confirmed" ? "default" : "secondary"}
                        >
                          {ride.status}
                        </Badge>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-primary shrink-0" />
                            <p className="font-medium line-clamp-1">
                              {ride.from} → {ride.to}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 shrink-0" />
                            <span>{ride.date} at {ride.time}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarFallback>{ride.driver[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{ride.driver}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Car className="mr-1 h-4 w-4" />
                              <span>Toyota Fortuner</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <p className="text-lg font-bold">${ride.price}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Past Rides */}
                  {customer.pastRides.map((ride) => (
                    <Card key={ride.id} className="relative overflow-hidden bg-muted/30">
                      <CardContent className="p-4">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 w-4 text-primary shrink-0" />
                            <p className="font-medium line-clamp-1">
                              {ride.from} → {ride.to}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 shrink-0" />
                            <span>{ride.date} at {ride.time}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-10 w-10 border-2 border-muted">
                            <AvatarFallback>{ride.driver[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{ride.driver}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="mr-1 h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                              <span>4.9</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <p className="text-lg font-bold">${ride.price}</p>
                          <Button size="sm" variant="outline">Book Similar</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 