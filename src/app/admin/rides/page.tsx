import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dummyCustomersExtended, dummyDrivers, dummyBookingData } from "@/data/dummy";
import { Car, Clock, MapPin, Plus, Search, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminRidesPage() {
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
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create New Trip
          </Button>
        </div>

        {/* Create New Trip Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Trip</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Customer Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Customer</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyCustomersExtended.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span>{customer.name}</span>
                          <span className="text-xs text-muted-foreground">{customer.phone}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Driver Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Driver</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id.toString()}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span>{driver.name}</span>
                          <span className="text-xs text-muted-foreground">{driver.vehicle.model}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              {/* Price and Payment */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trip Price ($)</label>
                  <Input type="number" placeholder="Enter trip price" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Status</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Special Requirements</label>
                <Textarea 
                  placeholder="Child seat, wheelchair access, specific language driver, or any other special needs"
                  className="min-h-[100px]"
                />
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <Textarea 
                  placeholder="Internal notes about the trip (not visible to customer)"
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" className="w-full sm:w-auto">Save as Draft</Button>
              <Button className="w-full sm:w-auto">Create Trip</Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Trips */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Upcoming Trips</CardTitle>
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
          <CardContent className="overflow-auto">
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
                  {/* Example row - In real app, map through actual trips */}
                  <TableRow>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">Mar 15, 2024</p>
                        <p className="text-sm text-muted-foreground">10:00 AM</p>
                      </div>
                    </TableCell>
                    <TableCell>John Smith</TableCell>
                    <TableCell>Carlos M.</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm">Jaco Beach → Manuel Antonio</p>
                        <p className="text-xs text-muted-foreground">2 passengers</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-500">
                        Confirmed
                      </div>
                    </TableCell>
                    <TableCell>$85.00</TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">Edit</Button>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">Cancel</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 