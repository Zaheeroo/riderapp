import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { dummyBookingData } from "@/data/dummy";
import { Car, Clock, CreditCard, MapPin, Users, Luggage, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function BookRidePage() {
  return (
    <DashboardLayout userType="customer">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Book a Ride</h2>
          <p className="text-muted-foreground">Schedule your next trip with us</p>
        </div>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
            <CardDescription>Fill in the details for your scheduled trip</CardDescription>
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
              <div className="grid gap-4 sm:grid-cols-2">
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Date</label>
                  <Input type="date" min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Time</label>
                  <Input type="time" />
                </div>
              </div>

              {/* Trip Details */}
              <div className="grid gap-4 sm:grid-cols-2">
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
                  <label className="text-sm font-medium">Vehicle Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyBookingData.vehicleTypes.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span>{vehicle.name}</span>
                            <span className="text-xs text-muted-foreground">
                              Up to {vehicle.features.includes("Extra Luggage Space") ? "12" : "6"} passengers
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Special Requirements */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Special Requirements</label>
                <Textarea 
                  placeholder="Child seat, wheelchair access, specific language driver, or any other special needs"
                  className="min-h-[100px]"
                />
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Promo Code</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input placeholder="Enter promo code" className="flex-1" />
                  <Button variant="outline" className="w-full sm:w-auto">Apply Code</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Available Vehicles</CardTitle>
            <CardDescription>Choose your preferred vehicle type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dummyBookingData.vehicleTypes.map((vehicle) => (
                <Card key={vehicle.id} className="relative">
                  <CardHeader>
                    <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                    <CardDescription>{vehicle.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span className="font-medium">${vehicle.basePrice}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {vehicle.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Select Vehicle</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Destinations */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Destinations</CardTitle>
            <CardDescription>Frequently booked destinations and routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dummyBookingData.popularDestinations.map((destination) => (
                <Card key={destination.id} className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 z-10" />
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="relative z-20 p-4">
                    <h3 className="text-lg font-semibold text-white">{destination.name}</h3>
                    <p className="text-sm text-white/80">{destination.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        From ${destination.averagePrice}
                      </Badge>
                      <Badge variant="secondary">
                        {destination.distance} km
                      </Badge>
                      <Badge variant="secondary">
                        ~{destination.duration} min
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary and Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyBookingData.paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center gap-2">
                            <span>{method.name}</span>
                            {method.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>$85.00</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Fee</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>$90.00</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="w-full sm:w-auto">Save for Later</Button>
            <Button className="w-full sm:w-auto">Confirm Booking</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
} 