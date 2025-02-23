import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyCustomers } from "@/data/dummy";
import { Car, MapPin, Plus, Clock, Phone, Star, Calendar } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CustomerUX() {
  const customer = dummyCustomers[0]; // Using first customer as example

  return (
    <DashboardLayout userType="customer">
      {/* Main Container with max width for better mobile readability */}
      <div className="max-w-lg mx-auto px-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome back!</h2>
          <p className="text-lg font-medium text-primary mb-1">{customer.name}</p>
          <p className="text-muted-foreground text-sm mb-4">Ready for your next adventure?</p>
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/customer/book">
              <Plus className="mr-2 h-4 w-4" />
              Book a Ride
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-primary/5">
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Total Rides</p>
              <p className="text-2xl font-bold text-primary">{customer.pastRides.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-primary/5">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Rating</p>
              <p className="text-2xl font-bold text-primary">4.9</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Rides */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Upcoming Rides</CardTitle>
            <CardDescription>Your scheduled trips</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-4 pb-4">
              <div className="space-y-4">
                {customer.upcomingRides.map((ride) => (
                  <Card key={ride.id} className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      {/* Status Badge */}
                      <Badge 
                        className="absolute top-2 right-2"
                        variant={ride.status === "Confirmed" ? "default" : "secondary"}
                      >
                        {ride.status}
                      </Badge>

                      {/* Route Info */}
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

                      {/* Driver Info */}
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

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <p className="text-lg font-bold">${ride.price}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Past Rides */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Past Rides</CardTitle>
            <CardDescription>Your ride history</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px] px-4 pb-4">
              <div className="space-y-4">
                {customer.pastRides.map((ride) => (
                  <Card key={ride.id} className="relative overflow-hidden bg-muted/30">
                    <CardContent className="p-4">
                      {/* Route Info */}
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

                      {/* Driver Info */}
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

                      {/* Price and Actions */}
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
    </DashboardLayout>
  );
} 