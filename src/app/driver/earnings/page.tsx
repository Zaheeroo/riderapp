import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dummyDriverEarnings } from "@/data/dummy";
import { Clock, DollarSign, Star, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DriverEarningsPage() {
  return (
    <DashboardLayout userType="driver">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Earnings</h2>
          <p className="text-muted-foreground">
            Track your earnings and payment history
          </p>
        </div>

        {/* Earnings Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dummyDriverEarnings.summary.today.total}</div>
              <p className="text-xs text-muted-foreground">
                {dummyDriverEarnings.summary.today.rides} rides • ${dummyDriverEarnings.summary.today.tips} tips
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dummyDriverEarnings.summary.week.total}</div>
              <p className="text-xs text-muted-foreground">
                {dummyDriverEarnings.summary.week.rides} rides • ${dummyDriverEarnings.summary.week.tips} tips
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dummyDriverEarnings.summary.month.total}</div>
              <p className="text-xs text-muted-foreground">
                {dummyDriverEarnings.summary.month.rides} rides • ${dummyDriverEarnings.summary.month.tips} tips
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dummyDriverEarnings.statistics.ratings.overall}</div>
              <p className="text-xs text-muted-foreground">
                Last month: {dummyDriverEarnings.statistics.ratings.lastMonth}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Next Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${dummyDriverEarnings.paymentSchedule.pendingAmount}</p>
                <p className="text-sm text-muted-foreground">
                  Scheduled for {dummyDriverEarnings.paymentSchedule.nextPayout}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{dummyDriverEarnings.paymentSchedule.payoutMethod}</p>
                <p className="text-sm text-muted-foreground">
                  Account: {dummyDriverEarnings.paymentSchedule.bankAccount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyDriverEarnings.recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        transaction.type === "Tip" 
                          ? "bg-green-500/10 text-green-500"
                          : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {transaction.type}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>{transaction.paymentMethod}</TableCell>
                    <TableCell className="text-right">${transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Peak Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dummyDriverEarnings.statistics.peakHours.map((peak, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{peak.hour}</p>
                      <p className="text-sm text-muted-foreground">{peak.rides} rides</p>
                    </div>
                    <p className="text-lg font-semibold">${peak.earnings}</p>
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
                {dummyDriverEarnings.statistics.popularRoutes.map((route, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{route.route}</p>
                      <p className="text-sm text-muted-foreground">{route.rides} rides</p>
                    </div>
                    <p className="text-lg font-semibold">${route.earnings}</p>
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