import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyDrivers } from "@/data/dummy";
import { Car, DollarSign, Star, Users } from "lucide-react";

export default function DriverDashboard() {
  const driver = dummyDrivers[0]; // Using first driver as example

  return (
    <DashboardLayout userType="driver">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {driver.name}! Here&apos;s your overview.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today&apos;s Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${driver.earnings.today}</div>
              <p className="text-xs text-muted-foreground">
                +10% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driver.totalRides}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime rides completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driver.rating}</div>
              <p className="text-xs text-muted-foreground">
                Based on customer reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{driver.vehicle.model}</div>
              <p className="text-xs text-muted-foreground">
                {driver.vehicle.plate} • {driver.vehicle.year}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Rides */}
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {driver.todayRides.map((ride) => (
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
                    <p className="text-xs text-muted-foreground">{ride.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Earnings Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${driver.earnings.today}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${driver.earnings.week}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${driver.earnings.month}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 