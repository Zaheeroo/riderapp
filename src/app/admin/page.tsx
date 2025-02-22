import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyAdminStats } from "@/data/dummy";
import { Car, DollarSign, Users } from "lucide-react";

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

        {/* Recent Rides */}
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
      </div>
    </DashboardLayout>
  );
} 