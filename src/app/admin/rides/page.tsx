"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dummyCustomersExtended, dummyDrivers, dummyBookingData, dummyAdminStats } from "@/data/dummy";
import { Car, Clock, MapPin, Plus, Search, Users, DollarSign, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeviceType } from "@/hooks/useDeviceType";

export default function AdminRidesPage() {
  const { isMobile } = useDeviceType();
  const [showNewTripForm, setShowNewTripForm] = useState(false);

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Rides Management</h2>
            <p className="text-muted-foreground">
              Create and manage scheduled trips
            </p>
          </div>
          <Button 
            className="w-full sm:w-auto"
            onClick={() => setShowNewTripForm(!showNewTripForm)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {showNewTripForm ? "Hide Form" : "Create New Trip"}
          </Button>
        </div>

        {/* Stats Overview */}
        <div className={cn(
          "grid gap-4 mb-8",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{dummyAdminStats.recentRides?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    {dummyAdminStats.recentRides?.filter(r => r.status === "Completed").length || 0} completed
                  </p>
                  <p className="text-xs text-green-500">+15% from yesterday</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Weekly Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">
                    22 rides per day avg
                  </p>
                  <p className="text-xs text-green-500">+8% this week</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">${dummyAdminStats.earnings?.month || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    $122 per ride avg
                  </p>
                  <p className="text-xs text-green-500">+12% from yesterday</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">{dummyDrivers.filter(d => d.status === "Active").length}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(dummyAdminStats.recentRides?.length / dummyDrivers.filter(d => d.status === "Active").length)} rides per driver
                  </p>
                  <p className="text-xs text-green-500">+2 from yesterday</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Create New Trip Form - Collapsible */}
        {showNewTripForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Trip</CardTitle>
              <CardDescription>Fill in the details for the new trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* Basic Info Section */}
                <div className={cn(
                  "grid gap-4",
                  isMobile ? "grid-cols-1" : "grid-cols-2"
                )}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Customer</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {dummyCustomersExtended.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">{customer.name}</span>
                              <span className="text-xs text-muted-foreground">{customer.phone}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign Driver</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {dummyDrivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id.toString()}>
                            <div className="flex flex-col">
                              <span className="font-medium">{driver.name}</span>
                              <span className="text-xs text-muted-foreground">{driver.vehicle.model}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Trip Details Section */}
                <div className="space-y-4">
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Location</label>
                    <Input placeholder="Hotel name, airport, or address" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destination</label>
                    <Input placeholder="Final destination" />
                  </div>
                </div>

                {/* Date and Time Section */}
                <div className={cn(
                  "grid gap-4",
                  isMobile ? "grid-cols-1" : "grid-cols-2"
                )}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Date</label>
                    <Input type="date" min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Time</label>
                    <Input type="time" />
                  </div>
                </div>

                {/* Vehicle and Passengers Section */}
                <div className={cn(
                  "grid gap-4",
                  isMobile ? "grid-cols-1" : "grid-cols-2"
                )}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vehicle Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        {dummyBookingData.vehicleTypes.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{vehicle.name}</span>
                              <span className="text-xs text-muted-foreground">
                                Up to {vehicle.features.includes("Extra Luggage Space") ? "12" : "6"} passengers
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Passengers</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select passengers" />
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
                </div>

                {/* Price and Payment Section */}
                <div className={cn(
                  "grid gap-4",
                  isMobile ? "grid-cols-1" : "grid-cols-2"
                )}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Trip Price ($)</label>
                    <Input type="number" placeholder="Enter trip price" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Status</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partial">Partial Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Special Requirements</label>
                    <Textarea 
                      placeholder="Child seat, wheelchair access, specific language driver, etc."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Admin Notes</label>
                    <Textarea 
                      placeholder="Internal notes (not visible to customer)"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
                <Button variant="outline" className="w-full sm:w-auto">Save as Draft</Button>
                <Button className="w-full sm:w-auto">Create Trip</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Trips */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold">Upcoming Trips</CardTitle>
                <CardDescription>View and manage scheduled rides</CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Search trips..."
                  className="w-full sm:w-[300px]"
                />
                <Button variant="outline" className="shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className={cn(
              isMobile ? "max-h-[300px]" : "max-h-[400px]"
            )}>
              {isMobile ? (
                // Mobile view - Card layout
                <div className="divide-y">
                  {dummyAdminStats.recentRides?.map((ride) => (
                    <div key={ride.id} className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{ride.customerName}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {ride.time}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="mr-1 h-3 w-3" />
                            {ride.destination}
                          </div>
                        </div>
                        <div className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          ride.status === "Completed" ? "bg-green-500/10 text-green-500" :
                          ride.status === "In Progress" ? "bg-blue-500/10 text-blue-500" :
                          "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {ride.status}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm">Driver: {ride.driverName}</p>
                          <p className="text-sm font-medium">$150.00</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Desktop view - Table layout
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummyAdminStats.recentRides?.map((ride) => (
                        <TableRow key={ride.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium">Mar 15, 2024</p>
                              <p className="text-sm text-muted-foreground">{ride.time}</p>
                            </div>
                          </TableCell>
                          <TableCell>{ride.customerName}</TableCell>
                          <TableCell>{ride.driverName}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">{ride.destination}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                              ride.status === "Completed" ? "bg-green-500/10 text-green-500" :
                              ride.status === "In Progress" ? "bg-blue-500/10 text-blue-500" :
                              "bg-yellow-500/10 text-yellow-500"
                            )}>
                              {ride.status}
                            </div>
                          </TableCell>
                          <TableCell>$150.00</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">View</Button>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 