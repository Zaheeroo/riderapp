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
import { Car, Mail, MapPin, Phone, Star, Users } from "lucide-react";

const dummyCustomersExtended = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 234-567-8900",
    status: "Active",
    location: "Jaco Beach",
    joinDate: "2024-01-15",
    totalRides: 8,
    totalSpent: 680.00,
    lastRide: "2024-02-25",
    preferredPayment: "Credit Card",
    rating: 4.9,
    preferences: {
      language: "English",
      currency: "USD",
      notifications: "Email + SMS"
    }
  },
  {
    id: 2,
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+1 234-567-8901",
    status: "Active",
    location: "Tamarindo",
    joinDate: "2024-01-20",
    totalRides: 5,
    totalSpent: 475.00,
    lastRide: "2024-02-25",
    preferredPayment: "PayPal",
    rating: 4.8,
    preferences: {
      language: "English",
      currency: "USD",
      notifications: "Email"
    }
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 234-567-8902",
    status: "Inactive",
    location: "Manuel Antonio",
    joinDate: "2024-02-01",
    totalRides: 2,
    totalSpent: 90.00,
    lastRide: "2024-02-25",
    preferredPayment: "Cash",
    rating: 4.7,
    preferences: {
      language: "Spanish",
      currency: "USD",
      notifications: "SMS"
    }
  }
];

export default function CustomersPage() {
  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <p className="text-muted-foreground">
              Manage and monitor your customer base
            </p>
          </div>
          <Button>Export Data</Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dummyCustomersExtended.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dummyCustomersExtended.filter(c => c.status === "Active").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Used service this month
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
                {dummyCustomersExtended.reduce((acc, curr) => acc + curr.totalRides, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Combined customer rides
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
                {(dummyCustomersExtended.reduce((acc, curr) => acc + curr.rating, 0) / dummyCustomersExtended.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">
                Customer satisfaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>Preferences</TableHead>
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
                        <div className="space-y-1">
                          <p className="text-xs">Language: {customer.preferences.language}</p>
                          <p className="text-xs">Currency: {customer.preferences.currency}</p>
                          <p className="text-xs">Notifications: {customer.preferences.notifications}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            customer.status === "Active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 