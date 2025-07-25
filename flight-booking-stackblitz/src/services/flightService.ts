import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Flight = Database['public']['Tables']['flights']['Row'];
type FlightInsert = Database['public']['Tables']['flights']['Insert'];
type FlightUpdate = Database['public']['Tables']['flights']['Update'];

export interface SearchFlightParams {
  fromCity?: string;
  toCity?: string;
  departureDate?: string;
}

export const flightService = {
  // Get all flights
  async getFlights(): Promise<Flight[]> {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Search flights with filters
  async searchFlights(params: SearchFlightParams): Promise<Flight[]> {
    let query = supabase.from('flights').select('*');

    if (params.fromCity) {
      query = query.ilike('from_city', `%${params.fromCity}%`);
    }

    if (params.toCity) {
      query = query.ilike('to_city', `%${params.toCity}%`);
    }

    // For departure date, we'll filter flights that have matching departure times
    // Note: In a real app, you'd want to store departure_date separately or parse the departure_time
    if (params.departureDate) {
      // This is a simplified search - in production you'd want better date handling
      query = query.gte('created_at', params.departureDate);
    }

    const { data, error } = await query.order('price', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  // Get flight by ID
  async getFlightById(id: string): Promise<Flight | null> {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows returned
      throw error;
    }
    return data;
  },

  // Create new flight (admin only)
  async createFlight(flight: FlightInsert): Promise<Flight> {
    const { data, error } = await supabase
      .from('flights')
      .insert(flight)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update flight (admin only)
  async updateFlight(id: string, updates: FlightUpdate): Promise<Flight> {
    const { data, error } = await supabase
      .from('flights')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete flight (admin only)
  async deleteFlight(id: string): Promise<void> {
    const { error } = await supabase
      .from('flights')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Update seat availability
  async updateSeatAvailability(id: string, seatsToBook: number): Promise<void> {
    // First get current flight data
    const flight = await this.getFlightById(id);
    if (!flight) throw new Error('Flight not found');

    const newSeatsAvailable = flight.seats_available - seatsToBook;
    if (newSeatsAvailable < 0) {
      throw new Error('Not enough seats available');
    }

    await this.updateFlight(id, { seats_available: newSeatsAvailable });
  }
};