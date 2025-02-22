import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyAdminStats } from "@/data/dummy";
import { Car, Clock, DollarSign, MapPin, Phone, Star, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminDashboard() {
  return (
    <DashboardLayout userType="admin">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, Admin! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dummyAdminStats.overview.totalDrivers}</div>
              <p className="text-xs text-muted-foreground">
                {dummyAdminStats.overview.activeDrivers} active now
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
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dummyAdminStats.overview.totalRides}</div>
              <p className="text-xs text-muted-foreground">
                +4% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${dummyAdminStats.earnings.month.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Rides and Popular Routes */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dummyAdminStats.recentRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div>
                      <p className="text-sm font-medium">{ride.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {ride.from} → {ride.to}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${ride.price}</p>
                      <p className="text-xs text-muted-foreground">{ride.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dummyAdminStats.popularRoutes.map((route, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between space-x-4"
                  >
                    <div>
                      <p className="text-sm font-medium">{route.route}</p>
                      <p className="text-xs text-muted-foreground">
                        {route.rides} rides this month
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${route.avgPrice}
                      </p>
                      <p className="text-xs text-muted-foreground">avg. price</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Rides Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Rides</CardTitle>
              <Button variant="outline" size="sm">
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyAdminStats.allRides.map((ride) => (
                    <TableRow key={ride.id}>
                      <TableCell className="font-medium">{ride.id}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{ride.customer.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="mr-1 h-3 w-3" />
                            {ride.customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <span className="font-medium">{ride.driver.name}</span>
                            <div className="ml-2 flex items-center text-yellow-500">
                              <Star className="h-3 w-3 fill-current" />
                              <span className="ml-1 text-xs">{ride.driver.rating}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{ride.driver.vehicle}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-1 h-3 w-3" />
                            {ride.ride.from} → {ride.ride.to}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {ride.ride.duration} ({ride.ride.distance})
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{ride.schedule.date}</p>
                          <p className="text-xs text-muted-foreground">{ride.schedule.time}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">${ride.payment.amount}</p>
                          <p className="text-xs text-muted-foreground">{ride.payment.method}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            ride.schedule.status === "Confirmed"
                              ? "bg-green-500/10 text-green-500"
                              : ride.schedule.status === "In Progress"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-yellow-500/10 text-yellow-500"
                          }`}>
                          {ride.schedule.status}
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