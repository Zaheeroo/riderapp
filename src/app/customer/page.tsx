"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyCommunication } from "@/data/dummy";
import { Car, MapPin, Plus, Clock, Phone, Star, Calendar, MessageSquare, ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Cookies from 'js-cookie';
import { useToast } from "@/hooks/use-toast";

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
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  const recentChats = dummyCommunication.conversations
    .filter(conv => conv.participants.some(p => p.type === "customer"))
    .slice(0, 3); // Only show 3 most recent chats
    
  // State for customer data and rides
  const [customerData, setCustomerData] = useState<any>(null);
  const [upcomingRides, setUpcomingRides] = useState<any[]>([]);
  const [completedRides, setCompletedRides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated and has customer role
  useEffect(() => {
    console.log("Customer page auth check - User:", !!user, "Loading:", loading);
    
    if (!loading) {
      if (!user) {
        console.log("No user, redirecting to login from customer page");
        // Not logged in, redirect to login
        router.push('/login');
        return;
      }
      
      // Check if user has customer role
      const userRole = localStorage.getItem('userRole');
      console.log("User role from localStorage:", userRole);
      
      if (userRole && userRole !== 'customer') {
        console.log("User has non-customer role:", userRole);
        // Not a customer, redirect to appropriate dashboard
        if (userRole === 'admin') {
          router.push('/admin');
        } else if (userRole === 'driver') {
          router.push('/driver');
        }
      } else if (!userRole) {
        // If no role in localStorage, check cookie
        const cookieRole = Cookies.get('userRole');
        console.log("User role from cookie:", cookieRole);
        
        if (cookieRole && cookieRole !== 'customer') {
          console.log("Cookie has non-customer role:", cookieRole);
          if (cookieRole === 'admin') {
            router.push('/admin');
          } else if (cookieRole === 'driver') {
            router.push('/driver');
          }
        }
      }
    }
  }, [user, loading, router]);
  
  // Fetch customer data and rides
  useEffect(() => {
    if (!user) return;
    
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
        
        // Then fetch rides for this customer
        fetchCustomerRides(customerData.id);
      } catch (error: any) {
        console.error('Error fetching customer profile:', error);
        setError(error.message || 'Failed to load customer profile');
        setIsLoading(false);
      }
    };
    
    // Fetch rides for a customer
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

  // If still loading or not authenticated, show loading state
  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <DashboardLayout userType="customer">
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
            <p className="text-lg font-medium text-primary mb-1">{customerData?.name || 'Customer'}</p>
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
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{completedRides.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Completed rides
                  </p>
                  <p className="text-xs text-green-500">+{upcomingRides.length} scheduled</p>
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
                    Based on {completedRides.length} rides
                  </p>
                  <p className="text-xs text-green-500">Top rated customer</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{recentChats.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active conversations
                  </p>
                  <p className="text-xs text-green-500">2 new today</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{completedRides.length > 0 ? completedRides.length : 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Places visited
                  </p>
                  <p className="text-xs text-green-500">Ready for more</p>
                </div>
              </ScrollArea>
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
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-destructive">
                    <p>{error}</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 p-4">
                    {/* Upcoming Rides */}
                    {upcomingRides.length === 0 && completedRides.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        You don't have any rides yet.
                        <div className="mt-2">
                          <Button variant="outline" asChild>
                            <Link href="/customer/book">Book Your First Ride</Link>
                          </Button>
                        </div>
                      </div>
                    ) : upcomingRides.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No upcoming rides.
                        <div className="mt-2">
                          <Button variant="outline" asChild>
                            <Link href="/customer/book">Book a Ride</Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      upcomingRides.slice(0, 3).map((ride) => (
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
                                  {ride.pickup_location} → {ride.dropoff_location}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4 shrink-0" />
                                <span>
                                  {new Date(ride.pickup_date).toLocaleDateString()} at {ride.pickup_time.substring(0, 5)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                              <Avatar className="h-10 w-10 border-2 border-primary/20">
                                <AvatarFallback>
                                  {ride.driver?.name ? ride.driver.name[0] : 'D'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{ride.driver?.name || 'Driver Pending'}</p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Car className="mr-1 h-4 w-4" />
                                  <span>{ride.vehicle_type}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t">
                              <p className="text-lg font-bold">${ride.price.toFixed(2)}</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" asChild>
                                  <Link href={`/customer/rides?ride=${ride.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}

                    {/* Past Rides */}
                    {completedRides.length > 0 && (
                      <>
                        {completedRides.slice(0, 2).map((ride) => (
                          <Card key={ride.id} className="relative overflow-hidden bg-muted/30">
                            <CardContent className="p-4">
                              <Badge 
                                className="absolute top-2 right-2"
                                variant={ride.status === "Completed" ? "default" : "destructive"}
                              >
                                {ride.status}
                              </Badge>
                              
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                                  <p className="font-medium line-clamp-1">
                                    {ride.pickup_location} → {ride.dropoff_location}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 shrink-0" />
                                  <span>
                                    {new Date(ride.pickup_date).toLocaleDateString()} at {ride.pickup_time.substring(0, 5)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-10 w-10 border-2 border-muted">
                                  <AvatarFallback>
                                    {ride.driver?.name ? ride.driver.name[0] : 'D'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{ride.driver?.name || 'No Driver'}</p>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Star className="mr-1 h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                                    <span>4.9</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t">
                                <p className="text-lg font-bold">${ride.price.toFixed(2)}</p>
                                <Button size="sm" variant="outline" asChild>
                                  <Link href="/customer/book">Book Similar</Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 