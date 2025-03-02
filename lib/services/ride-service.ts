import { supabaseClient } from '../supabase-client';
import { supabaseDirect } from '../supabase-client';

export interface RideData {
  id?: number;
  customer_id: number;
  driver_id?: number | null;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string;
  pickup_time: string;
  status?: string;
  trip_type: string;
  vehicle_type: string;
  passengers: number;
  price: number;
  payment_status?: string;
  special_requirements?: string;
  admin_notes?: string;
}

export const RideService = {
  // Create a new ride
  async createRide(rideData: RideData, userId: string) {
    try {
      const { data, error } = await supabaseClient
        .from('rides')
        .insert({
          ...rideData,
          created_by: userId,
          status: rideData.status || 'Pending',
          payment_status: rideData.payment_status || 'Pending'
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating ride:', error);
      return { data: null, error };
    }
  },

  // Get all rides (admin only)
  async getAllRides() {
    try {
      const { data, error } = await supabaseClient
        .from('rides')
        .select(`
          *,
          customer:customers(*),
          driver:drivers(*)
        `)
        .order('pickup_date', { ascending: true })
        .order('pickup_time', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching all rides:', error);
      return { data: null, error };
    }
  },

  // Get rides for a customer
  async getCustomerRides(customerId: number) {
    try {
      const { data, error } = await supabaseClient
        .from('rides')
        .select(`
          *,
          driver:drivers(*)
        `)
        .eq('customer_id', customerId)
        .order('pickup_date', { ascending: true })
        .order('pickup_time', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching customer rides:', error);
      return { data: null, error };
    }
  },

  // Get rides for a driver
  async getDriverRides(driverId: number) {
    try {
      const { data, error } = await supabaseClient
        .from('rides')
        .select(`
          *,
          customer:customers(*)
        `)
        .eq('driver_id', driverId)
        .order('pickup_date', { ascending: true })
        .order('pickup_time', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching driver rides:', error);
      return { data: null, error };
    }
  },

  // Get a single ride by ID
  async getRideById(rideId: number) {
    try {
      const { data, error } = await supabaseClient
        .from('rides')
        .select(`
          *,
          customer:customers(*),
          driver:drivers(*)
        `)
        .eq('id', rideId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching ride:', error);
      return { data: null, error };
    }
  },

  // Update a ride
  async updateRide(rideId: number, rideData: Partial<RideData>) {
    try {
      const { data, error } = await supabaseClient
        .from('rides')
        .update(rideData)
        .eq('id', rideId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating ride:', error);
      return { data: null, error };
    }
  },

  // Delete a ride
  async deleteRide(rideId: number) {
    try {
      const { error } = await supabaseClient
        .from('rides')
        .delete()
        .eq('id', rideId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting ride:', error);
      return { error };
    }
  },

  // Update ride status
  async updateRideStatus(rideId: number, status: string) {
    try {
      const { data, error } = await supabaseClient
        .from('rides')
        .update({ status })
        .eq('id', rideId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating ride status:', error);
      return { data: null, error };
    }
  },

  // Assign driver to ride
  async assignDriver(rideId: number, driverId: number) {
    try {
      const { data, error } = await supabaseClient
        .from('rides')
        .update({ 
          driver_id: driverId,
          status: 'Confirmed' 
        })
        .eq('id', rideId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error assigning driver:', error);
      return { data: null, error };
    }
  }
}; 