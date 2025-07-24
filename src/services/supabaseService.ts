import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Flight = Database['public']['Tables']['flights']['Row'];
type FlightInsert = Database['public']['Tables']['flights']['Insert'];
type FlightUpdate = Database['public']['Tables']['flights']['Update'];
type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

export class SupabaseService {
  // Flight Management
  static async getAllFlights(): Promise<Flight[]> {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .order('departure_time', { ascending: true });

    if (error) {
      console.error('Error fetching flights:', error);
      throw new Error('Failed to fetch flights');
    }

    return data || [];
  }

  static async getFlightById(flightId: string): Promise<Flight | null> {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('id', flightId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows found
      }
      console.error('Error fetching flight:', error);
      throw new Error('Failed to fetch flight');
    }

    return data;
  }

  static async searchFlights(params: {
    fromCity: string;
    toCity: string;
    departureDate: string;
    passengers: number;
  }): Promise<Flight[]> {
    const startDate = new Date(params.departureDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('from_city', params.fromCity)
      .eq('to_city', params.toCity)
      .gte('departure_time', startDate.toISOString())
      .lt('departure_time', endDate.toISOString())
      .gte('seats_available', params.passengers)
      .order('departure_time', { ascending: true });

    if (error) {
      console.error('Error searching flights:', error);
      throw new Error('Failed to search flights');
    }

    return data || [];
  }

  static async createFlight(flightData: FlightInsert): Promise<Flight> {
    const { data, error } = await supabase
      .from('flights')
      .insert([flightData])
      .select()
      .single();

    if (error) {
      console.error('Error creating flight:', error);
      throw new Error('Failed to create flight');
    }

    return data;
  }

  static async updateFlight(flightId: string, flightData: FlightUpdate): Promise<Flight> {
    const { data, error } = await supabase
      .from('flights')
      .update(flightData)
      .eq('id', flightId)
      .select()
      .single();

    if (error) {
      console.error('Error updating flight:', error);
      throw new Error('Failed to update flight');
    }

    return data;
  }

  static async deleteFlight(flightId: string): Promise<void> {
    const { error } = await supabase
      .from('flights')
      .delete()
      .eq('id', flightId);

    if (error) {
      console.error('Error deleting flight:', error);
      throw new Error('Failed to delete flight');
    }
  }

  // Booking Management
  static async getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        flights (
          flight_number,
          airline,
          from_city,
          to_city,
          departure_time,
          arrival_time
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }

    return data || [];
  }

  static async getBookingsByEmail(email: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        flights (
          flight_number,
          airline,
          from_city,
          to_city,
          departure_time,
          arrival_time,
          price
        )
      `)
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }

    return data || [];
  }

  static async createBooking(bookingData: BookingInsert): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create booking');
    }

    // Update flight seats
    const { error: updateError } = await supabase.rpc('decrease_flight_seats', {
      flight_id: bookingData.flight_id,
      seats_count: 1
    });

    if (updateError) {
      console.error('Error updating flight seats:', updateError);
      // Consider rolling back the booking creation
    }

    return data;
  }

  static async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status');
    }

    return data;
  }

  static async cancelBooking(bookingId: string): Promise<void> {
    // Get booking details first
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('flight_id')
      .eq('id', bookingId)
      .single();

    if (fetchError) {
      console.error('Error fetching booking:', fetchError);
      throw new Error('Failed to fetch booking details');
    }

    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    if (updateError) {
      console.error('Error cancelling booking:', updateError);
      throw new Error('Failed to cancel booking');
    }

    // Increase flight seats
    const { error: seatsError } = await supabase.rpc('increase_flight_seats', {
      flight_id: booking.flight_id,
      seats_count: 1
    });

    if (seatsError) {
      console.error('Error updating flight seats:', seatsError);
    }
  }

  // Analytics
  static async getFlightStats() {
    const { data: flights, error } = await supabase
      .from('flights')
      .select('total_seats, seats_available, price');

    if (error) {
      console.error('Error fetching flight stats:', error);
      throw new Error('Failed to fetch flight statistics');
    }

    const totalFlights = flights.length;
    const totalSeats = flights.reduce((sum, flight) => sum + flight.total_seats, 0);
    const availableSeats = flights.reduce((sum, flight) => sum + flight.seats_available, 0);
    const totalRevenue = flights.reduce((sum, flight) => 
      sum + (flight.total_seats - flight.seats_available) * flight.price, 0
    );

    return {
      totalFlights,
      totalSeats,
      availableSeats,
      bookedSeats: totalSeats - availableSeats,
      totalRevenue,
      occupancyRate: totalSeats > 0 ? ((totalSeats - availableSeats) / totalSeats) * 100 : 0,
      averagePrice: flights.length > 0 ? flights.reduce((sum, f) => sum + f.price, 0) / flights.length : 0
    };
  }

  // Admin Authentication
  static async authenticateAdmin(username: string, password: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('username', username)
      .single();

    if (error || !data) {
      return false;
    }

    // In a real app, you'd use proper password hashing (bcrypt, etc.)
    // For now, this is a simple comparison
    return data.password_hash === password;
  }
}