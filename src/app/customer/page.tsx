import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyCustomers } from "@/data/dummy";
import { Car, MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboard() {
  const customer = dummyCustomers[0]; // Using first customer as example

  return (
    <DashboardLayout userType="customer">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back, {customer.name}! Ready for your next adventure?
            </p>
          </div>
          <Button asChild>
            <Link href="/customer/book">
              <Plus className="mr-2 h-4 w-4" />
              Book a Ride
            </Link>
          </Button>
        </div>

        {/* Upcoming Rides */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customer.upcomingRides.map((ride) => (
                <div
                  key={ride.id}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {ride.from} → {ride.to}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Driver: {ride.driver}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Car className="h-4 w-4" />
                      <span>{ride.date} at {ride.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${ride.price}</p>
                    <p className="text-xs text-muted-foreground">{ride.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Past Rides */}
        <Card>
          <CardHeader>
            <CardTitle>Past Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customer.pastRides.map((ride) => (
                <div
                  key={ride.id}
                  className="flex items-center justify-between space-x-4 rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {ride.from} → {ride.to}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Driver: {ride.driver}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Car className="h-4 w-4" />
                      <span>{ride.date} at {ride.time}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${ride.price}</p>
                    <p className="text-xs text-muted-foreground">{ride.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 