import { Flight } from '@/types/flight';
import { mockFlights } from '@/data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class FlightService {
  static async getFlightById(flightId: string): Promise<Flight | null> {
    try {
      // For demo purposes, use mock data instead of API call
      const flight = mockFlights.find(f => f.id === flightId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return flight || null;
    } catch (error) {
      console.error('Error fetching flight:', error);
      throw error;
    }
  }

  static async searchFlights(params: {
    fromCity: string;
    toCity: string;
    departureDate: string;
    passengers: number;
  }): Promise<Flight[]> {
    try {
      const searchParams = new URLSearchParams({
        fromCity: params.fromCity,
        toCity: params.toCity,
        departureDate: params.departureDate,
        passengers: params.passengers.toString(),
      });

      const response = await fetch(`${API_BASE_URL}/flights/search?${searchParams}`);
      if (!response.ok) {
        throw new Error(`Failed to search flights: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  }

  static async getAllFlights(): Promise<Flight[]> {
    try {
      // For demo purposes, use mock data instead of API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...mockFlights];
    } catch (error) {
      console.error('Error fetching flights:', error);
      throw error;
    }
  }

  static async updateFlightAvailability(flightId: string, seatsToBook: number): Promise<Flight> {
    try {
      const response = await fetch(`${API_BASE_URL}/flights/${flightId}/book`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seatsToBook }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update flight availability: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating flight availability:', error);
      throw error;
    }
  }

  static async createFlight(flightData: Omit<Flight, 'id'>): Promise<Flight> {
    try {
      const response = await fetch(`${API_BASE_URL}/flights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create flight: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating flight:', error);
      throw error;
    }
  }

  static async updateFlight(flightId: string, flightData: Partial<Flight>): Promise<Flight> {
    try {
      const response = await fetch(`${API_BASE_URL}/flights/${flightId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update flight: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating flight:', error);
      throw error;
    }
  }

  static async deleteFlight(flightId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/flights/${flightId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete flight: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting flight:', error);
      throw error;
    }
  }
}