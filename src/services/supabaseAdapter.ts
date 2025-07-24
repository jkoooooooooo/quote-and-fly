import { SupabaseService } from './supabaseService';
import type { Flight, Booking } from '@/types/flight';
import type { Database } from '@/integrations/supabase/types';

type SupabaseFlight = Database['public']['Tables']['flights']['Row'];
type SupabaseFlightInsert = Database['public']['Tables']['flights']['Insert'];
type SupabaseBooking = Database['public']['Tables']['bookings']['Row'];

export class SupabaseAdapter {
  // Convert Supabase flight to frontend flight format
  static supabaseFlightToFrontend(supabaseFlight: SupabaseFlight): Flight {
    return {
      id: supabaseFlight.id,
      flightNumber: supabaseFlight.flight_number,
      fromCity: supabaseFlight.from_city,
      toCity: supabaseFlight.to_city,
      departureTime: supabaseFlight.departure_time,
      arrivalTime: supabaseFlight.arrival_time,
      seatsAvailable: supabaseFlight.seats_available,
      totalSeats: supabaseFlight.total_seats,
      price: supabaseFlight.price,
      airline: supabaseFlight.airline,
      duration: supabaseFlight.duration
    };
  }

  // Convert frontend flight to Supabase format
  static frontendFlightToSupabase(flight: Omit<Flight, 'id'>): SupabaseFlightInsert {
    return {
      flight_number: flight.flightNumber,
      from_city: flight.fromCity,
      to_city: flight.toCity,
      departure_time: flight.departureTime,
      arrival_time: flight.arrivalTime,
      seats_available: flight.seatsAvailable,
      total_seats: flight.totalSeats,
      price: flight.price,
      airline: flight.airline,
      duration: flight.duration
    };
  }

  // Convert Supabase booking to frontend booking format
  static supabaseBookingToFrontend(supabaseBooking: SupabaseBooking): Booking {
    return {
      id: supabaseBooking.id,
      flightId: supabaseBooking.flight_id,
      passengerName: supabaseBooking.passenger_name,
      email: supabaseBooking.email,
      bookingDate: supabaseBooking.booking_date,
      status: supabaseBooking.status as 'confirmed' | 'pending' | 'cancelled'
    };
  }

  // Adapter methods for the FlightService interface
  static async getAllFlights(): Promise<Flight[]> {
    const supabaseFlights = await SupabaseService.getAllFlights();
    return supabaseFlights.map(this.supabaseFlightToFrontend);
  }

  static async getFlightById(flightId: string): Promise<Flight | null> {
    const supabaseFlight = await SupabaseService.getFlightById(flightId);
    return supabaseFlight ? this.supabaseFlightToFrontend(supabaseFlight) : null;
  }

  static async searchFlights(params: {
    fromCity: string;
    toCity: string;
    departureDate: string;
    passengers: number;
  }): Promise<Flight[]> {
    const supabaseFlights = await SupabaseService.searchFlights(params);
    return supabaseFlights.map(this.supabaseFlightToFrontend);
  }

  static async createFlight(flightData: Omit<Flight, 'id'>): Promise<Flight> {
    const supabaseFlightData = this.frontendFlightToSupabase(flightData);
    const supabaseFlight = await SupabaseService.createFlight(supabaseFlightData);
    return this.supabaseFlightToFrontend(supabaseFlight);
  }

  static async updateFlight(flightId: string, flightData: Omit<Flight, 'id'>): Promise<Flight> {
    const supabaseFlightData = this.frontendFlightToSupabase(flightData);
    const supabaseFlight = await SupabaseService.updateFlight(flightId, supabaseFlightData);
    return this.supabaseFlightToFrontend(supabaseFlight);
  }

  static async deleteFlight(flightId: string): Promise<void> {
    return SupabaseService.deleteFlight(flightId);
  }

  // Booking methods
  static async getAllBookings(): Promise<Booking[]> {
    const supabaseBookings = await SupabaseService.getAllBookings();
    return supabaseBookings.map(this.supabaseBookingToFrontend);
  }

  static async getBookingsByEmail(email: string): Promise<Booking[]> {
    const supabaseBookings = await SupabaseService.getBookingsByEmail(email);
    return supabaseBookings.map(this.supabaseBookingToFrontend);
  }

  static async createBooking(bookingData: {
    flightId: string;
    passengerName: string;
    email: string;
  }): Promise<Booking> {
    const supabaseBookingData = {
      flight_id: bookingData.flightId,
      passenger_name: bookingData.passengerName,
      email: bookingData.email,
      booking_date: new Date().toISOString().split('T')[0], // Today's date
      status: 'confirmed'
    };

    const supabaseBooking = await SupabaseService.createBooking(supabaseBookingData);
    return this.supabaseBookingToFrontend(supabaseBooking);
  }

  static async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const supabaseBooking = await SupabaseService.updateBookingStatus(bookingId, status);
    return this.supabaseBookingToFrontend(supabaseBooking);
  }

  static async cancelBooking(bookingId: string): Promise<void> {
    return SupabaseService.cancelBooking(bookingId);
  }

  // Analytics
  static async getFlightStats() {
    return SupabaseService.getFlightStats();
  }

  // Admin Authentication
  static async authenticateAdmin(username: string, password: string): Promise<boolean> {
    return SupabaseService.authenticateAdmin(username, password);
  }
}