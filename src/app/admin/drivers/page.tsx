import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Car, Mail, Phone, Star } from "lucide-react";

const dummyDriversExtended = [
  {
    id: 1,
    name: "Carlos Martinez",
    email: "carlos@jacorides.com",
    phone: "+506 8888-1111",
    status: "Active",
    vehicle: {
      model: "Toyota Fortuner",
      year: "2023",
      plate: "CRC-123",
      seats: 6,
      color: "Silver"
    },
    rating: 4.8,
    totalRides: 156,
    earnings: {
      month: 4500.00
    },
    documents: {
      license: "Valid until 2025",
      insurance: "Up to date",
      background: "Verified"
    },
    joinDate: "2023-01-15"
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    email: "maria@jacorides.com",
    phone: "+506 8888-2222",
    status: "Active",
    vehicle: {
      model: "Honda CR-V",
      year: "2022",
      plate: "CRC-456",
      seats: 5,
      color: "White"
    },
    rating: 4.9,
    totalRides: 203,
    earnings: {
      month: 5200.00
    },
    documents: {
      license: "Valid until 2024",
      insurance: "Up to date",
      background: "Verified"
    },
    joinDate: "2022-11-20"
  },
  {
    id: 3,
    name: "Juan Perez",
    email: "juan@jacorides.com",
    phone: "+506 8888-3333",
    status: "Inactive",
    vehicle: {
      model: "Hyundai Tucson",
      year: "2023",
      plate: "CRC-789",
      seats: 5,
      color: "Black"
    },
    rating: 4.7,
    totalRides: 98,
    earnings: {
      month: 2800.00
    },
    documents: {
      license: "Valid until 2026",
      insurance: "Up to date",
      background: "Verified"
    },
    joinDate: "2023-06-10"
  }
];

export default function DriversPage() {
  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Drivers</h2>
            <p className="text-muted-foreground">
              Manage and monitor your driver fleet
            </p>
          </div>
          <Button>Add New Driver</Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dummyDriversExtended.filter(d => d.status === "Active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently on duty
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(dummyDriversExtended.reduce((acc, curr) => acc + curr.rating, 0) / dummyDriversExtended.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Overall driver rating
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dummyDriversExtended.reduce((acc, curr) => acc + curr.totalRides, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Combined completed rides
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Drivers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Fleet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Documents</TableHead>
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
                            {driver.vehicle.plate} • {driver.vehicle.seats} seats
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
                        <div className="space-y-1">
                          <p className="text-xs">License: {driver.documents.license}</p>
                          <p className="text-xs">Insurance: {driver.documents.insurance}</p>
                          <p className="text-xs">Background: {driver.documents.background}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            driver.status === "Active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 