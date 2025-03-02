import { supabaseClient, supabaseDirect } from '../supabase-client';
import { SupabaseClient } from '@supabase/supabase-js';

// Client-side only implementation
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
  price: number | string;
  payment_status?: string;
  special_requirements?: string;
  admin_notes?: string;
  created_by?: string; // UUID string
}

// Type guard to check if we have a valid Supabase client
function isValidSupabaseClient(client: any): client is SupabaseClient {
  return client && typeof client.from === 'function';
}

export const RideService = {
  // Create a new ride
  async createRide(rideData: RideData, userId?: string) {
    try {
      console.log('Creating ride with data:', rideData, 'userId:', userId);
      
      // If price is a string, convert it to a number
      const price = typeof rideData.price === 'string' 
        ? parseFloat(rideData.price) 
        : rideData.price;
      
      // Always use supabaseDirect for direct API access without relying on cookies
      // This bypasses RLS policies issues that might occur with the client-side client
      const client = supabaseDirect;
      
      if (!isValidSupabaseClient(client)) {
        console.warn('Using dummy client for createRide');
        return { data: null, error: new Error('Invalid Supabase client') };
      }
      
      // Prepare the ride data with proper defaults
      const ridePayload = {
        ...rideData,
        price,
        created_by: userId || 'customer', // Always provide a fallback
        status: rideData.status || 'Pending',
        payment_status: rideData.payment_status || 'Pending'
      };
      
      console.log('Submitting ride payload:', ridePayload);
      
      const { data, error } = await client
        .from('rides')
        .insert(ridePayload)
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating ride:', error);
        throw error;
      }
      
      console.log('Ride created successfully:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error creating ride:', error);
      return { data: null, error };
    }
  },

  // Get all rides (admin only)
  async getAllRides() {
    try {
      if (!isValidSupabaseClient(supabaseClient)) {
        console.warn('Using dummy client for getAllRides');
        return { data: [], error: null };
      }
      
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
      return { data: [], error };
    }
  },

  // Get rides for a customer
  async getCustomerRides(customerId: number) {
    try {
      // Check if we have cached data for this customer
      if (typeof window !== 'undefined') {
        const cachedData = localStorage.getItem(`customer_rides_${customerId}`);
        const cachedTimestamp = localStorage.getItem(`customer_rides_${customerId}_timestamp`);
        
        // Use cache if it's less than 5 minutes old
        if (cachedData && cachedTimestamp) {
          const now = Date.now();
          const timestamp = parseInt(cachedTimestamp, 10);
          const fiveMinutes = 5 * 60 * 1000;
          
          if (now - timestamp < fiveMinutes) {
            console.log('Using cached ride data for customer:', customerId);
            return { data: JSON.parse(cachedData), error: null };
          }
        }
      }
      
      if (!isValidSupabaseClient(supabaseClient)) {
        console.warn('Using dummy client for getCustomerRides');
        return { data: [], error: null };
      }
      
      // Add a timeout for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout to 8 seconds
      
      let result;
      try {
        result = await supabaseClient
          .from('rides')
          .select(`
            *,
            driver:drivers(*)
          `)
          .eq('customer_id', customerId)
          .order('pickup_date', { ascending: true })
          .order('pickup_time', { ascending: true });
      } catch (e) {
        console.error('Supabase query error:', e);
        result = { data: null, error: e };
      }
      
      clearTimeout(timeoutId);
      
      const { data, error } = result;
      
      if (error) throw error;
      
      // Cache the data if we're in a browser
      if (typeof window !== 'undefined' && data) {
        localStorage.setItem(`customer_rides_${customerId}`, JSON.stringify(data));
        localStorage.setItem(`customer_rides_${customerId}_timestamp`, Date.now().toString());
      }
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching customer rides:', error);
      
      // Try to get data from cache as fallback, even if it's older than 5 minutes
      if (typeof window !== 'undefined') {
        const cachedData = localStorage.getItem(`customer_rides_${customerId}`);
        if (cachedData) {
          console.log('Using stale cached data as fallback for customer:', customerId);
          return { data: JSON.parse(cachedData), error: null };
        }
      }
      
      // Return empty array instead of null to avoid undefined errors
      return { data: [], error };
    }
  },

  // Get rides for a driver
  async getDriverRides(driverId: number) {
    try {
      if (!isValidSupabaseClient(supabaseClient)) {
        console.warn('Using dummy client for getDriverRides');
        return { data: [], error: null };
      }
      
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
      return { data: [], error };
    }
  },

  // Get a single ride by ID
  async getRideById(rideId: number) {
    try {
      if (!isValidSupabaseClient(supabaseClient)) {
        console.warn('Using dummy client for getRideById');
        return { data: null, error: null };
      }
      
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
      if (!isValidSupabaseClient(supabaseClient)) {
        console.warn('Using dummy client for updateRide');
        return { data: null, error: null };
      }
      
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
      if (!isValidSupabaseClient(supabaseClient)) {
        console.warn('Using dummy client for deleteRide');
        return { error: null };
      }
      
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
      if (!isValidSupabaseClient(supabaseClient)) {
        console.warn('Using dummy client for updateRideStatus');
        return { data: null, error: null };
      }
      
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
      if (!isValidSupabaseClient(supabaseClient)) {
        console.warn('Using dummy client for assignDriver');
        return { data: null, error: null };
      }
      
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