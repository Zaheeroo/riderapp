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

export default function AdminUX2() {
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
              {dummyDriversExtended.map((driver) => (
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
                    <div className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      driver.status === "Active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {driver.status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{driver.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {driver.totalRides} rides • ${driver.earnings.month} this month
                      </p>
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
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyDriversExtended.map((driver) => (
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
                            {driver.vehicle.plate}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
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
                        <div className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          driver.status === "Active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {driver.status}
                        </div>
                      </TableCell>
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
  );

  const renderCustomerManagement = () => (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold">Customer Management</CardTitle>
            <CardDescription>Monitor and manage your customers</CardDescription>
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
              {dummyCustomersExtended.map((customer) => (
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
                    <div className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      customer.status === "Active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {customer.status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium">{customer.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {customer.totalRides} rides • ${customer.totalSpent} total spent
                      </p>
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyCustomersExtended.map((customer) => (
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
                          <MapPin className="mr-1 h-3 w-3 text-muted-foreground" />
                          {customer.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <Star className="mr-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
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
                        <div className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          customer.status === "Active"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        )}>
                          {customer.status}
                        </div>
                      </TableCell>
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
  );

  const renderStats = () => (
    <div className={cn(
      "grid gap-4",
      isMobile ? "grid-cols-2" : "grid-cols-4"
    )}>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{dummyAdminStats.overview.totalDrivers}</div>
            <p className="text-xs text-muted-foreground">
              {dummyAdminStats.overview.activeDrivers} active drivers
            </p>
            <p className="text-xs text-green-500">+{dummyAdminStats.overview.driverPercentageChange}% from last month</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{dummyAdminStats.overview.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {dummyAdminStats.overview.activeCustomers} active this month
            </p>
            <p className="text-xs text-green-500">+{dummyAdminStats.overview.customerPercentageChange}% from last month</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{dummyAdminStats.overview.activeChats}</div>
            <p className="text-xs text-muted-foreground">
              {dummyAdminStats.overview.attentionNeeded} require attention
            </p>
            <p className="text-xs text-green-500">+{dummyAdminStats.overview.chatPercentageChange}% from last week</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div className="text-2xl font-bold">${dummyAdminStats.earnings.month}</div>
            <p className="text-xs text-muted-foreground">
              +${dummyAdminStats.earnings.monthChange} this month
            </p>
            <p className="text-xs text-green-500">+{dummyAdminStats.earnings.percentageChange}% from last month</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout userType="admin" showMobileHeader={false}>
      {/* Main Container with adaptive max width based on device */}
      <div className={cn(
        "mx-auto px-4 space-y-6",
        isMobile ? "max-w-lg" : "max-w-7xl"
      )}>
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Admin</h1>
            <p className="text-muted-foreground">Here's what's happening with your platform today.</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Driver
            </Button>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        {renderStats()}

        {/* Main Content Grid */}
        {isMobile ? (
          // Mobile Layout
          <div className="space-y-6">
            {/* Recent Communications */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Recent Chats</CardTitle>
                    <CardDescription>Latest communications</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                    <Link href="/admin/messages">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="divide-y max-h-[200px]">
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
                            <div>
                              <p className="font-medium">{otherParticipant?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {otherParticipant?.type === "driver" ? "Driver" : "Customer"}
                              </p>
                            </div>
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
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Rides Management Section */}
            {renderRidesManagement()}

            {/* Driver Fleet Section */}
            {renderDriverFleet()}

            {/* Customer Management Section */}
            {renderCustomerManagement()}
          </div>
        ) : (
          // Desktop Layout
          <div className="grid grid-cols-2 gap-4">
            {/* Driver Fleet Section - Full width on desktop */}
            <div className="col-span-2">
              {renderDriverFleet()}
            </div>

            {/* Customer Management Section - Full width on desktop */}
            <div className="col-span-2">
              {renderCustomerManagement()}
            </div>

            {/* Recent Communications */}
            <div className="col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Recent Chats</CardTitle>
                      <CardDescription>Latest communications</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                      <Link href="/admin/messages">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="divide-y max-h-[300px]">
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
                              <div>
                                <p className="font-medium">{otherParticipant?.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {otherParticipant?.type === "driver" ? "Driver" : "Customer"}
                                </p>
                              </div>
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