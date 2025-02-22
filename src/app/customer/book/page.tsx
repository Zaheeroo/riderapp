import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyBookingData } from "@/data/dummy";
import { Car, Clock, CreditCard, MapPin, Users, Luggage, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function BookRidePage() {
  return (
    <DashboardLayout userType="customer">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Schedule a Trip</h2>
          <p className="text-muted-foreground">
            Plan your journey with our professional transportation service
          </p>
        </div>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Trip Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Trip Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="airport">Airport Transfer</SelectItem>
                    <SelectItem value="tour">Guided Tour</SelectItem>
                    <SelectItem value="pointToPoint">Point to Point Transfer</SelectItem>
                    <SelectItem value="hourly">Hourly Charter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Locations */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Location</label>
                  <Input placeholder="Hotel name, airport, or address" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Input placeholder="Final destination" />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Date</label>
                  <Input type="date" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Time</label>
                  <Input type="time" />
                </div>
              </div>

              {/* Passengers and Luggage */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Passengers</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of passengers" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'passenger' : 'passengers'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Luggage</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select luggage size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (1-2 pieces)</SelectItem>
                      <SelectItem value="medium">Medium (3-4 pieces)</SelectItem>
                      <SelectItem value="large">Large (5+ pieces)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Vehicle Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyBookingData.vehicleTypes.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} - Up to {vehicle.features.includes("Extra Luggage Space") ? "12" : "6"} passengers
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional Requirements */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Special Requirements</label>
                <Textarea 
                  placeholder="Child seat, wheelchair access, specific language driver, or any other special needs"
                  className="min-h-[100px]"
                />
              </div>

              {/* Payment Method */}
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

              {/* Promo Code */}
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
          <h3 className="text-xl font-semibold mb-4">Popular Routes & Tours</h3>
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

        {/* Active Promos */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Current Promotions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {dummyBookingData.promos.map((promo, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{promo.description}</p>
                      <p className="text-sm text-muted-foreground">Use code: {promo.code}</p>
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
          <Button size="lg">Schedule Trip</Button>
        </div>
      </div>
    </DashboardLayout>
  );
} 