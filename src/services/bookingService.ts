import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export interface CreateBookingParams {
  flightId: string;
  passengerName: string;
  email: string;
  passengers?: number;
}

export const bookingService = {
  // Create a new booking
  async createBooking(params: CreateBookingParams): Promise<Booking> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create a booking');
    }

    const bookingData: BookingInsert = {
      flight_id: params.flightId,
      passenger_name: params.passengerName,
      email: params.email,
      booking_date: new Date().toISOString(),
      status: 'confirmed',
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all bookings for current user
  async getUserBookings(): Promise<Booking[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        flights (
          id,
          flight_number,
          airline,
          from_city,
          to_city,
          price,
          duration
        )
      `)
      .eq('email', user.email)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get all bookings (admin only)
  async getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        flights (
          id,
          flight_number,
          airline,
          from_city,
          to_city,
          price,
          duration
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get booking by ID
  async getBookingById(id: string): Promise<Booking | null> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        flights (
          id,
          flight_number,
          airline,
          from_city,
          to_city,
          price,
          duration
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Update booking status
  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Cancel booking
  async cancelBooking(id: string): Promise<void> {
    await this.updateBookingStatus(id, 'cancelled');
  },

  // Delete booking (admin only)
  async deleteBooking(id: string): Promise<void> {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};