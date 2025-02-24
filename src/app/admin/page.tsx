"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyAdminStats, dummyCommunication, dummyDriversExtended, dummyCustomersExtended } from "@/data/dummy";
import { Car, MapPin, Plus, Clock, Phone, Star, DollarSign, MessageSquare, ArrowRight, Users, Mail, Search, Pencil } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeviceType } from "@/hooks/useDeviceType";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Ride = {
  id: string;
  customerName: string;
  destination: string;
  status: string;
  time: string;
  driverName: string;
};

const rides: Ride[] = [
  {
    id: "1",
    customerName: "John Smith",
    destination: "Manuel Antonio",
    status: "Confirmed",
    time: "10:00 AM",
    driverName: "Carlos M."
  },
  {
    id: "2",
    customerName: "Emma Wilson",
    destination: "Tamarindo",
    status: "In Progress",
    time: "11:30 AM",
    driverName: "Maria R."
  },
  {
    id: "3",
    customerName: "Michael Brown",
    destination: "Jaco Beach",
    status: "Completed",
    time: "2:00 PM",
    driverName: "Juan P."
  }
];

export default function AdminDashboard() {
  const { isMobile } = useDeviceType();
  const recentChats = dummyCommunication.conversations
    .filter(conv => conv.participants.some(p => p.type === "admin"))
    .slice(0, 3); // Only show 3 most recent chats

  const renderRidesManagement = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">Rides Management</CardTitle>
            <CardDescription>Monitor and manage all rides</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search rides..."
              className="w-full sm:w-[300px]"
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link href="/admin/rides">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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
                        <MapPin className="mr-1 h-3 w-3" />
                        {ride.destination}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {ride.time}
                      </div>
                    </div>
                    <Badge variant={
                      ride.status === "In Progress" ? "default" :
                      ride.status === "Completed" ? "secondary" :
                      "outline"
                    }>
                      {ride.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Driver: {ride.driverName}</p>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue={ride.driverName}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Assign Driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {dummyDriversExtended.map((driver) => (
                            <SelectItem key={driver.id} value={driver.name}>
                              <div className="flex flex-col">
                                <span>{driver.name}</span>
                                <span className="text-xs text-muted-foreground">{driver.vehicle.model}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyAdminStats.recentRides?.map((ride) => (
                    <TableRow key={ride.id}>
                      <TableCell>
                        <p className="font-medium">{ride.customerName}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <MapPin className="mr-1 h-3 w-3" />
                          {ride.destination}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-3 w-3" />
                          {ride.time}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={ride.driverName}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Assign Driver" />
                          </SelectTrigger>
                          <SelectContent>
                            {dummyDriversExtended.map((driver) => (
                              <SelectItem key={driver.id} value={driver.name}>
                                <div className="flex flex-col">
                                  <span>{driver.name}</span>
                                  <span className="text-xs text-muted-foreground">{driver.vehicle.model}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          ride.status === "In Progress" ? "default" :
                          ride.status === "Completed" ? "secondary" :
                          "outline"
                        }>
                          {ride.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
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
  );

  const renderDriverFleet = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">Driver Fleet</CardTitle>
            <CardDescription>Manage and monitor your drivers</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search drivers..."
              className="w-full sm:w-[300px]"
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link href="/admin/drivers">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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
              {dummyDriversExtended.slice(0, 5).map((driver) => (
                <div key={driver.id} className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="mr-1 h-3 w-3" />
                        {driver.email}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Phone className="mr-1 h-3 w-3" />
                        {driver.phone}
                      </div>
                    </div>
                    <Badge variant={driver.status === "Active" ? "default" : "secondary"}>
                      {driver.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Car className="mr-1 h-3 w-3" />
                        {driver.vehicle.model}
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="mr-1 h-3 w-3 fill-yellow-400 stroke-yellow-400" />
                        {driver.rating}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
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
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyDriversExtended.slice(0, 5).map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{driver.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="mr-1 h-3 w-3" />
                            {driver.email}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="mr-1 h-3 w-3" />
                            {driver.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{driver.vehicle.model}</p>
                          <p className="text-xs text-muted-foreground">
                            {driver.vehicle.color} • {driver.vehicle.year}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {driver.vehicle.plate} • {driver.vehicle.seats} seats
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Star className="mr-1 h-3 w-3 fill-yellow-400 stroke-yellow-400" />
                            <span className="font-medium">{driver.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {driver.totalRides} rides
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${driver.earnings.month} this month
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={driver.status === "Active" ? "default" : "secondary"}>
                          {driver.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
  );

  const renderCustomerManagement = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">Customer Management</CardTitle>
            <CardDescription>Manage and monitor your customers</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search customers..."
              className="w-full sm:w-[300px]"
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
              <Link href="/admin/customers">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
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
              {dummyCustomersExtended.slice(0, 5).map((customer) => (
                <div key={customer.id} className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="mr-1 h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Phone className="mr-1 h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                    <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                      {customer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-1 h-3 w-3" />
                        {customer.location}
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="mr-1 h-3 w-3 fill-yellow-400 stroke-yellow-400" />
                        {customer.rating}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Edit</Button>
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyCustomersExtended.slice(0, 5).map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{customer.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="mr-1 h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="mr-1 h-3 w-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {customer.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Star className="mr-1 h-3 w-3 fill-yellow-400 stroke-yellow-400" />
                            <span className="font-medium">{customer.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {customer.totalRides} rides
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${customer.totalSpent} total spent
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
  );

  const renderStats = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dummyAdminStats.overview.totalRides}</div>
          <p className="text-xs text-muted-foreground">
            +{dummyAdminStats.overview.ridesIncrease}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dummyAdminStats.overview.activeDrivers}</div>
          <p className="text-xs text-muted-foreground">
            {dummyAdminStats.overview.totalDrivers} total drivers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dummyAdminStats.overview.totalCustomers}</div>
          <p className="text-xs text-muted-foreground">
            +{dummyAdminStats.overview.customerPercentageChange}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${dummyAdminStats.earnings.month.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            +{dummyAdminStats.earnings.percentageChange}% from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {renderStats()}
        {renderRidesManagement()}
        {renderDriverFleet()}
        {renderCustomerManagement()}

        {/* Recent Communications */}
        {isMobile && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Communications</h3>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px]">
                    <div className="divide-y">
                      {recentChats.map((chat) => {
                        const otherParticipant = chat.participants.find(p => p.type !== "admin");
                        const lastMessage = dummyCommunication.messages
                          .filter(m => m.conversation_id === chat.id)
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

                        return (
                          <Link 
                            key={chat.id} 
                            href={`/admin/messages?chat=${chat.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                          >
                            <Avatar>
                              <AvatarImage src={otherParticipant?.avatar} />
                              <AvatarFallback>{otherParticipant?.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{otherParticipant?.name}</p>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(lastMessage?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {lastMessage?.message}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 