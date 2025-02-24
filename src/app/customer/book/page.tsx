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

              {/* Passenger Details */}
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Adults</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of adults" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'adult' : 'adults'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Children</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of children" />
                      </SelectTrigger>
                      <SelectContent>
                        {[0,1,2,3,4].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'child' : 'children'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Luggage</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select luggage amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No luggage</SelectItem>
                        <SelectItem value="light">Light (1-2 pieces)</SelectItem>
                        <SelectItem value="medium">Medium (3-4 pieces)</SelectItem>
                        <SelectItem value="heavy">Heavy (5+ pieces)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Child Seats Needed</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of seats" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">No child seats</SelectItem>
                        <SelectItem value="1">1 child seat</SelectItem>
                        <SelectItem value="2">2 child seats</SelectItem>
                        <SelectItem value="3">3 child seats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Services */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Services</label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">City Tour Guide</CardTitle>
                      <CardDescription>Professional guide for city exploration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">+$50/hour</Badge>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Photography Package</CardTitle>
                      <CardDescription>Professional photographer for your tour</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">+$75/hour</Badge>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Multilingual Guide</CardTitle>
                      <CardDescription>Guide fluent in multiple languages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">+$60/hour</Badge>
                    </CardContent>
                  </Card>
                  <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Custom Tour Planning</CardTitle>
                      <CardDescription>Personalized itinerary creation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">+$40/hour</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Special Requirements */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Special Requirements or Notes</label>
                <Textarea 
                  placeholder="Any specific requirements, preferred language, accessibility needs, or additional notes for your trip"
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
                <div className="flex justify-between text-muted-foreground">
                  <span>Additional Services</span>
                  <span>$0.00</span>
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