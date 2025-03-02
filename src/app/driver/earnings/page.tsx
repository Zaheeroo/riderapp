"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyDriverEarnings } from "@/data/dummy";
import { Clock, DollarSign, Star, TrendingUp, Calendar, Wallet, CreditCard, MapPin } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeviceType } from "@/hooks/useDeviceType";
import { Badge } from "@/components/ui/badge";

export default function DriverEarningsPage() {
  const { isMobile } = useDeviceType();

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
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">${dummyDriverEarnings.summary.today.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {dummyDriverEarnings.summary.today.rides} rides
                  </p>
                  <p className="text-xs text-green-500">+${dummyDriverEarnings.summary.today.tips} tips</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">${dummyDriverEarnings.summary.week.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {dummyDriverEarnings.summary.week.rides} rides
                  </p>
                  <p className="text-xs text-green-500">+${dummyDriverEarnings.summary.week.tips} tips</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">${dummyDriverEarnings.summary.month.total}</div>
                  <p className="text-xs text-muted-foreground">
                    {dummyDriverEarnings.summary.month.rides} rides
                  </p>
                  <p className="text-xs text-green-500">+${dummyDriverEarnings.summary.month.tips} tips</p>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="flex-shrink-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold">{dummyDriverEarnings.statistics.ratings.overall}</div>
                <p className="text-xs text-muted-foreground">
                  Last month
                </p>
                <p className="text-xs text-green-500">+{(dummyDriverEarnings.statistics.ratings.overall - dummyDriverEarnings.statistics.ratings.lastMonth).toFixed(1)} change</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Next Payout</CardTitle>
            <CardDescription>Your upcoming payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <p className="text-2xl font-bold">${dummyDriverEarnings.paymentSchedule.pendingAmount}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <p>Scheduled for {dummyDriverEarnings.paymentSchedule.nextPayout}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{dummyDriverEarnings.paymentSchedule.payoutMethod}</p>
                </div>
                <p className="text-sm text-muted-foreground pl-6">
                  Account: {dummyDriverEarnings.paymentSchedule.bankAccount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <CardDescription>Your latest earnings and payments</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className={cn(
              isMobile ? "max-h-[300px]" : "max-h-[400px]"
            )}>
              {isMobile ? (
                <div className="divide-y">
                  {dummyDriverEarnings.recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{transaction.customer}</p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                        <p className="text-lg font-semibold">${transaction.amount}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          transaction.type === "Tip" 
                            ? "bg-green-500/10 text-green-500"
                            : "bg-blue-500/10 text-blue-500"
                        }`}>
                          {transaction.type}
                        </div>
                        <p className="text-muted-foreground">{transaction.paymentMethod}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Peak Hours</CardTitle>
              <CardDescription>Your most profitable time slots</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[300px]">
                <div className="space-y-4">
                  {dummyDriverEarnings.statistics.peakHours.map((peak, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{peak.hour}</p>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">{peak.rides} rides</p>
                      </div>
                      <p className="text-lg font-semibold">${peak.earnings}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Popular Routes</CardTitle>
              <CardDescription>Your most frequent destinations</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[300px]">
                <div className="space-y-4">
                  {dummyDriverEarnings.statistics.popularRoutes.map((route, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium">{route.route}</p>
                        </div>
                        <p className="text-sm text-muted-foreground pl-6">{route.rides} rides</p>
                      </div>
                      <p className="text-lg font-semibold">${route.earnings}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Earnings History */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings History</CardTitle>
            <CardDescription>Your most recent earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Rides</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyDriverEarnings.earningsHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.date}</div>
                      </TableCell>
                      <TableCell>{item.rides}</TableCell>
                      <TableCell>${item.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === "Paid" ? "default" : "outline"}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 