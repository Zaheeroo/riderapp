import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyBookingData } from "@/data/dummy";
import { Car, Clock, CreditCard, MapPin, Star, Ticket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

export default function BookRidePage() {
  return (
    <DashboardLayout userType="customer">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Book a Ride</h2>
          <p className="text-muted-foreground">
            Choose your destination and preferred vehicle
          </p>
        </div>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Ride Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Location</label>
                  <Input placeholder="Enter pickup location" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dropoff Location</label>
                  <Input placeholder="Enter destination" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyBookingData.vehicleTypes.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} - ${vehicle.basePrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyBookingData.paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Promo Code</label>
                <div className="flex gap-2">
                  <Input placeholder="Enter promo code" />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Destinations */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Popular Destinations</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {dummyBookingData.popularDestinations.map((destination, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-black/20" />
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    className="object-cover"
                    fill
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold">{destination.name}</h4>
                  <p className="text-sm text-muted-foreground">{destination.description}</p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {destination.duration}
                    </div>
                    <div className="font-medium">
                      From ${destination.averagePrice}
                    </div>
                  </div>
                  <Button className="mt-4 w-full" variant="outline">Select</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Drivers */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Available Drivers Nearby</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {dummyBookingData.availableDrivers.map((driver) => (
              <Card key={driver.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                        {driver.rating} • {driver.totalRides} rides
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Car className="mr-1 h-4 w-4" />
                        {driver.vehicle.model} • {driver.vehicle.color} • {driver.vehicle.year}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                        {driver.status}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {driver.estimatedArrival} away
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Active Promos */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Available Promotions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {dummyBookingData.promos.map((promo, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-4 p-2 bg-primary/10 rounded-full">
                        <Ticket className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{promo.description}</p>
                        <p className="text-sm text-muted-foreground">Code: {promo.code}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Apply</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Book Now Button */}
        <div className="flex justify-end">
          <Button size="lg">Book Now</Button>
        </div>
      </div>
    </DashboardLayout>
  );
} 