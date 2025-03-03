'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, Clock, MapPin, User, DollarSign } from "lucide-react";
import { useAuth } from "../../../../../contexts";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function CreateRidePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    customer_id: "",
    driver_id: "",
    pickup_location: "",
    dropoff_location: "",
    pickup_date: new Date().toISOString().split('T')[0],
    pickup_time: "12:00",
    price: "",
    status: "Pending",
    trip_type: "One-way",
    vehicle_type: "Standard",
    passengers: 1,
    payment_status: "Pending",
    special_requirements: "",
    admin_notes: ""
  });

  useEffect(() => {
    // Only fetch data if we have a user
    if (!user) return;
    
    const fetchCustomersAndDrivers = async () => {
      try {
        // Fetch customers
        const customersResponse = await fetch('/api/admin/customers');
        if (!customersResponse.ok) {
          throw new Error('Failed to fetch customers');
        }
        const customersData = await customersResponse.json();
        setCustomers(customersData || []);
        
        // Fetch drivers
        const driversResponse = await fetch('/api/admin/drivers');
        if (!driversResponse.ok) {
          throw new Error('Failed to fetch drivers');
        }
        const driversData = await driversResponse.json();
        setDrivers(driversData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load customers and drivers",
          variant: "destructive",
        });
      }
    };
    
    fetchCustomersAndDrivers();
  }, [user, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    console.log(`Updating ${name} to ${value}`);
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      console.log('Updated form data:', updated);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Submitting form data:', formData);
    
    try {
      const response = await fetch('/api/admin/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Error response:', responseData);
        throw new Error(responseData.error || 'Failed to create ride');
      }
      
      console.log('Success response:', responseData);
      
      toast({
        title: "Success",
        description: "Ride has been created",
        variant: "success",
      });
      
      // Redirect to the rides list
      router.push('/admin/rides');
    } catch (error: any) {
      console.error('Error creating ride:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create the ride",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Create New Ride</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ride Details</CardTitle>
            <CardDescription>Enter the details for the new ride</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customer_id">Customer</Label>
                    <Select 
                      key={`customer-select-${formData.customer_id}`}
                      value={formData.customer_id} 
                      onValueChange={(value) => handleSelectChange('customer_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="driver_id">Driver</Label>
                    <Select 
                      key={`driver-select-${formData.driver_id}`}
                      value={formData.driver_id} 
                      onValueChange={(value) => handleSelectChange('driver_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map(driver => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="pickup_location">Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pickup_location"
                      name="pickup_location"
                      placeholder="Enter pickup address"
                      className="pl-8"
                      value={formData.pickup_location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dropoff_location">Dropoff Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dropoff_location"
                      name="dropoff_location"
                      placeholder="Enter dropoff address"
                      className="pl-8"
                      value={formData.dropoff_location}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="pickup_date">Pickup Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pickup_date"
                        name="pickup_date"
                        type="date"
                        className="pl-8"
                        value={formData.pickup_date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pickup_time">Pickup Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pickup_time"
                        name="pickup_time"
                        type="time"
                        className="pl-8"
                        value={formData.pickup_time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-8"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trip_type">Trip Type</Label>
                  <Select 
                    value={formData.trip_type} 
                    onValueChange={(value) => handleSelectChange('trip_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trip type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="One-way">One-way</SelectItem>
                      <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
                      <SelectItem value="Guided Tour">Guided Tour</SelectItem>
                      <SelectItem value="Point to Point Transfer">Point to Point Transfer</SelectItem>
                      <SelectItem value="Hourly Charter">Hourly Charter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle_type">Vehicle Type</Label>
                  <Select 
                    value={formData.vehicle_type} 
                    onValueChange={(value) => handleSelectChange('vehicle_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passengers">Number of Passengers</Label>
                  <Input
                    id="passengers"
                    name="passengers"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.passengers}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_status">Payment Status</Label>
                  <Select 
                    value={formData.payment_status} 
                    onValueChange={(value) => handleSelectChange('payment_status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="special_requirements">Special Requirements</Label>
                  <Input
                    id="special_requirements"
                    name="special_requirements"
                    placeholder="Any special requirements or requests"
                    value={formData.special_requirements}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin_notes">Admin Notes</Label>
                  <Input
                    id="admin_notes"
                    name="admin_notes"
                    placeholder="Internal notes for admin use"
                    value={formData.admin_notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Ride"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 