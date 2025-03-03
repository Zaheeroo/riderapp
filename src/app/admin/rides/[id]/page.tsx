'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Clock, MapPin, Phone, Star, CircleUser, CreditCard, X, AlertCircle, ArrowLeft, Calendar, User, Mail, MapPinned } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../../../../../contexts";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function AdminRideDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [ride, setRide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only fetch data if we have a user and ride ID
    if (!user || !params.id) return;
    
    const fetchRideDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/admin/rides/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch ride details');
        }
        
        const { data, error: fetchError } = await response.json();
        
        if (fetchError) {
          throw new Error(fetchError);
        }
        
        if (!data) {
          throw new Error('Ride not found');
        }
        
        setRide(data);
      } catch (error: any) {
        console.error('Error fetching ride details:', error);
        setError(error.message || 'Failed to load ride details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRideDetails();
  }, [user, params.id]);

  const handleCancelClick = () => {
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    if (!ride) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/rides/update-status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rideId: ride.id, status: 'Cancelled' }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel ride');
      }
      
      const { data } = await response.json();
      
      toast({
        title: "Success",
        description: "Ride has been cancelled",
        variant: "success",
      });
      
      // Update the ride data
      setRide({ ...ride, status: 'Cancelled' });
      
      // Close the confirmation dialog
      setShowCancelConfirmation(false);
    } catch (error: any) {
      console.error('Error cancelling ride:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel the ride",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ride Details</h2>
          </div>
          {ride && ride.status !== 'Cancelled' && ride.status !== 'Completed' && (
            <Button variant="destructive" onClick={handleCancelClick}>
              <X className="mr-2 h-4 w-4" />
              Cancel Ride
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8 text-destructive">
                <p>{error}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : ride ? (
          <>
            {/* Status Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Ride #{ride.id}</h3>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(ride.pickup_date)} at {formatTime(ride.pickup_time)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={
                        ride.status === 'Completed' ? 'default' : 
                        ride.status === 'Cancelled' ? 'destructive' : 
                        ride.status === 'In Progress' ? 'secondary' : 
                        'outline'
                      }
                      className="text-sm py-1 px-3"
                    >
                      {ride.status}
                    </Badge>
                    <div className="font-medium text-lg">${parseFloat(ride.price).toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer and Driver Info */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={ride.customer?.avatar || '/placeholder-avatar.png'} alt={ride.customer?.name || 'Customer'} />
                      <AvatarFallback>{ride.customer?.name?.[0] || 'C'}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-medium">{ride.customer?.name || 'Unknown Customer'}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4" />
                        {ride.customer?.phone || 'No phone number'}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        {ride.customer?.email || 'No email'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Driver Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {ride.driver ? (
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={ride.driver?.avatar || '/placeholder-avatar.png'} alt={ride.driver?.name || 'Driver'} />
                        <AvatarFallback>{ride.driver?.name?.[0] || 'D'}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{ride.driver?.name}</h3>
                          <div className="flex items-center ml-2">
                            <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                            <span className="text-sm ml-1">{ride.driver?.rating || '4.8'}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-2 h-4 w-4" />
                          {ride.driver?.phone || 'No phone number'}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Car className="mr-2 h-4 w-4" />
                          {ride.driver?.vehicle_model} - {ride.driver?.vehicle_color}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CircleUser className="mr-2 h-4 w-4" />
                          {ride.driver?.vehicle_plate}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No driver assigned yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Trip Type</h4>
                        <p>{ride.trip_type || 'Standard'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Vehicle Type</h4>
                        <p>{ride.vehicle_type || 'Standard'}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Passengers</h4>
                        <p>{ride.passengers || '1'}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Payment Status</h4>
                        <Badge variant={ride.payment_status === 'Paid' ? 'default' : 'outline'}>
                          {ride.payment_status || 'Pending'}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Price</h4>
                        <p className="font-medium">${parseFloat(ride.price).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Route</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                          <div>
                            <p className="font-medium">Pickup Location</p>
                            <p className="text-muted-foreground">{ride.pickup_location}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPinned className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                          <div>
                            <p className="font-medium">Dropoff Location</p>
                            <p className="text-muted-foreground">{ride.dropoff_location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {ride.special_requirements && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-2">Special Requirements</h4>
                        <p className="text-muted-foreground">{ride.special_requirements}</p>
                      </div>
                    </>
                  )}

                  {ride.admin_notes && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-sm font-medium mb-2">Admin Notes</h4>
                        <p className="text-muted-foreground">{ride.admin_notes}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={() => router.back()}>
                Back to Rides
              </Button>
              {ride.status !== 'Cancelled' && ride.status !== 'Completed' && (
                <Button variant="destructive" onClick={handleCancelClick}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel Ride
                </Button>
              )}
            </div>
          </>
        ) : null}

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                Confirm Cancellation
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this ride? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {ride && (
              <div className="border rounded-md p-3 bg-muted/50">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Customer: {ride.customer?.name || 'Unknown'}</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-sm text-muted-foreground">{ride.pickup_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPinned className="h-4 w-4 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Dropoff</p>
                      <p className="text-sm text-muted-foreground">{ride.dropoff_location}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">{ride.pickup_date}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">{ride.pickup_time}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCancelConfirmation(false)}
                disabled={isSubmitting}
              >
                Keep Ride
              </Button>
              <Button 
                variant="destructive"
                onClick={handleConfirmCancel}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Cancelling...' : 'Cancel Ride'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
} 