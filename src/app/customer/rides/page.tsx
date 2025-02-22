import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyCustomerRides } from "@/data/dummy";
import { Car, Clock, MapPin, Phone, Star } from "lucide-react";

export default function CustomerRidesPage() {
  return (
    <DashboardLayout userType="customer">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Rides</h2>
          <p className="text-muted-foreground">
            View your upcoming and past rides
          </p>
        </div>

        {/* Upcoming Rides */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Upcoming Rides</h3>
          <div className="grid gap-4">
            {dummyCustomerRides.upcomingRides.map((ride) => (
              <Card key={ride.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">Driver: {ride.driver.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="mr-1 h-4 w-4" />
                            {ride.driver.phone}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                            {ride.driver.rating}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Car className="mr-1 h-4 w-4" />
                            {ride.driver.vehicle.model} • {ride.driver.vehicle.color} • {ride.driver.vehicle.plate}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-500">
                            {ride.status}
                          </div>
                          <p className="mt-1 text-lg font-semibold">${ride.price}</p>
                          <p className="text-sm text-muted-foreground">{ride.paymentMethod}</p>
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
                    <Button variant="outline" size="sm">Contact Driver</Button>
                    <Button variant="outline" size="sm">Cancel Ride</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Completed Rides */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Past Rides</h3>
          <div className="grid gap-4">
            {dummyCustomerRides.completedRides.map((ride) => (
              <Card key={ride.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">Driver: {ride.driver.name}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                            Driver Rating: {ride.driver.rating}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Car className="mr-1 h-4 w-4" />
                            {ride.driver.vehicle.model} • {ride.driver.vehicle.color} • {ride.driver.vehicle.plate}
                          </div>
                          {ride.rating && (
                            <div className="mt-2 p-2 bg-muted/50 rounded-md">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="ml-1 text-sm font-medium">Your Rating: {ride.rating.given}/5</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                "{ride.rating.comment}"
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                            {ride.status}
                          </div>
                          <p className="mt-1 text-lg font-semibold">${ride.price}</p>
                          <p className="text-sm text-muted-foreground">{ride.paymentMethod}</p>
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
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">Book Similar Ride</Button>
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