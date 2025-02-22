import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyDriverRides } from "@/data/dummy";
import { Clock, MapPin, Phone, Star } from "lucide-react";

export default function DriverRidesPage() {
  return (
    <DashboardLayout userType="driver">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Rides</h2>
          <p className="text-muted-foreground">
            View and manage your upcoming and completed rides
          </p>
        </div>

        {/* Upcoming Rides */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Upcoming Rides</h3>
          <div className="grid gap-4">
            {dummyDriverRides.upcomingRides.map((ride) => (
              <Card key={ride.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{ride.customer.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="mr-1 h-4 w-4" />
                            {ride.customer.phone}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                            {ride.customer.rating}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-500">
                            {ride.status}
                          </div>
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
                    <Button size="sm">Start Ride</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Rides */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Completed Rides</h3>
          <div className="grid gap-4">
            {dummyDriverRides.completedRides.map((ride) => (
              <Card key={ride.id}>
                <CardContent className="p-6">
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
                          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                            {ride.status}
                          </div>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 