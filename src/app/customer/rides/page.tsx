import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyCustomerRides } from "@/data/dummy";
import { Car, Clock, MapPin, Phone, Star, CircleUser, CreditCard, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
            <div className="space-y-4">
              {dummyCustomerRides.upcomingRides.map((ride, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Driver and Vehicle Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
                            <AvatarFallback>{ride.driver.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{ride.driver.name}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="mr-1 h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                              {ride.driver.rating}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="h-4 w-4" />
                            <span>{ride.driver.vehicle.model} - {ride.driver.vehicle.color}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CircleUser className="h-4 w-4" />
                            <span>{ride.driver.vehicle.plate}</span>
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
                              <p className="text-sm text-muted-foreground">{ride.pickup.location}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPinned className="h-4 w-4 mt-1 shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Dropoff</p>
                              <p className="text-sm text-muted-foreground">{ride.dropoff.location}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div>
                            <p className="text-sm font-medium">Date</p>
                            <p className="text-sm text-muted-foreground">{ride.date}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Time</p>
                            <p className="text-sm text-muted-foreground">{ride.time}</p>
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
                          <span className="text-sm">{ride.payment.method}</span>
                        </div>
                        <div className="font-medium">${ride.payment.amount}</div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto">
                          <Phone className="mr-2 h-4 w-4" />
                          Contact Driver
                        </Button>
                        <Button variant="destructive" className="w-full sm:w-auto">
                          <X className="mr-2 h-4 w-4" />
                          Cancel Ride
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completed Rides */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Rides</CardTitle>
            <CardDescription>Your ride history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dummyCustomerRides.completedRides.map((ride, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Driver and Vehicle Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
                            <AvatarFallback>{ride.driver.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{ride.driver.name}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Star className="mr-1 h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                              {ride.driver.rating}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="h-4 w-4" />
                            <span>{ride.driver.vehicle.model} - {ride.driver.vehicle.color}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <CircleUser className="h-4 w-4" />
                            <span>{ride.driver.vehicle.plate}</span>
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
                              <p className="text-sm text-muted-foreground">{ride.pickup.location}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPinned className="h-4 w-4 mt-1 shrink-0" />
                            <div>
                              <p className="text-sm font-medium">Dropoff</p>
                              <p className="text-sm text-muted-foreground">{ride.dropoff.location}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          <div>
                            <p className="text-sm font-medium">Date</p>
                            <p className="text-sm text-muted-foreground">{ride.date}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Time</p>
                            <p className="text-sm text-muted-foreground">{ride.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge variant="secondary">Completed</Badge>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="text-sm">{ride.payment.method}</span>
                        </div>
                        <div className="font-medium">${ride.payment.amount}</div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        {ride.customerRating ? (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                            <span>You rated {ride.customerRating}/5</span>
                          </div>
                        ) : (
                          <Button variant="outline" className="w-full sm:w-auto">
                            Rate Trip
                          </Button>
                        )}
                        <Button variant="outline" className="w-full sm:w-auto">
                          Book Similar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 