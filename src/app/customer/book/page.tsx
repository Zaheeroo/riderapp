"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../../../../contexts";
import { RideService } from "../../../../lib/services/ride-service";
import { Loader2 } from "lucide-react";

export default function BookRidePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [loadingCustomer, setLoadingCustomer] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    pickup_location: "",
    dropoff_location: "",
    pickup_date: "",
    pickup_time: "",
    trip_type: "One-way",
    vehicle_type: "Standard",
    passengers: "1",
    special_requirements: "",
  });

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user) return;
      
      try {
        // Get the customer profile for the current user
        const { data, error } = await fetch(`/api/customers/by-user/${user.id}`)
          .then(res => res.json());
        
        if (error) throw error;
        if (!data) throw new Error('Customer profile not found');
        
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        toast({
          title: "Error",
          description: "Failed to load your profile",
          variant: "destructive",
        });
      } finally {
        setLoadingCustomer(false);
      }
    };
    
    fetchCustomerData();
  }, [user, toast]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, pickup_date: formattedDate }));
    }
  };

  // Handle time change
  const handleTimeChange = (time: string) => {
    setFormData(prev => ({ ...prev, pickup_time: time }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerData) {
      toast({
        title: "Error",
        description: "Customer profile not found",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form
    if (!formData.pickup_location || !formData.dropoff_location || !formData.pickup_date || !formData.pickup_time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Calculate estimated price (in a real app, this would be more sophisticated)
      const basePrice = formData.vehicle_type === "Standard" ? 25 : 
                        formData.vehicle_type === "Premium" ? 40 : 
                        formData.vehicle_type === "SUV" ? 35 : 30;
      const passengerMultiplier = parseInt(formData.passengers) > 2 ? 1.2 : 1;
      const estimatedPrice = (basePrice * passengerMultiplier).toFixed(2);
      
      // Create the ride
      const rideData = {
        customer_id: customerData.id,
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location,
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        status: "Pending",
        trip_type: formData.trip_type,
        vehicle_type: formData.vehicle_type,
        passengers: parseInt(formData.passengers),
        price: estimatedPrice,
        payment_status: "Pending",
        special_requirements: formData.special_requirements,
        created_by: "customer",
      };
      
      const { data, error } = await RideService.createRide(rideData);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your ride has been booked successfully",
        variant: "success",
      });
      
      // Redirect to rides page
      router.push("/customer/rides");
    } catch (error) {
      console.error('Error booking ride:', error);
      toast({
        title: "Error",
        description: "Failed to book your ride",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingCustomer) {
    return (
      <DashboardLayout userType="customer">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="customer">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Book a Ride</h2>
          <p className="text-muted-foreground">
            Fill in the details below to book your ride
          </p>
        </div>

        <Card className="max-w-3xl">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Ride Details</CardTitle>
              <CardDescription>
                Enter your pickup and dropoff locations, along with your preferred time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Locations */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pickup_location">Pickup Location</Label>
                    <Input
                      id="pickup_location"
                      name="pickup_location"
                      placeholder="Enter pickup address"
                      value={formData.pickup_location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropoff_location">Dropoff Location</Label>
                    <Input
                      id="dropoff_location"
                      name="dropoff_location"
                      placeholder="Enter destination address"
                      value={formData.dropoff_location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Pickup Date</Label>
                    <DatePicker
                      date={formData.pickup_date ? new Date(formData.pickup_date) : undefined}
                      onSelect={handleDateChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pickup Time</Label>
                    <TimePicker
                      value={formData.pickup_time}
                      onChange={handleTimeChange}
                    />
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Trip Type</Label>
                    <Select
                      value={formData.trip_type}
                      onValueChange={(value) => handleSelectChange("trip_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trip type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="One-way">One-way</SelectItem>
                        <SelectItem value="Round-trip">Round-trip</SelectItem>
                        <SelectItem value="Multi-stop">Multi-stop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Select
                      value={formData.vehicle_type}
                      onValueChange={(value) => handleSelectChange("vehicle_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Passengers</Label>
                    <Select
                      value={formData.passengers}
                      onValueChange={(value) => handleSelectChange("passengers", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Special Requirements */}
              <div className="space-y-2">
                <Label htmlFor="special_requirements">Special Requirements</Label>
                <Textarea
                  id="special_requirements"
                  name="special_requirements"
                  placeholder="Any special requirements or notes for the driver"
                  value={formData.special_requirements}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Book Ride"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
} 