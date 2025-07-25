export interface Flight {
  id: string;
  flightNumber: string;
  fromCity: string;
  toCity: string;
  departureTime: string;
  arrivalTime: string;
  seatsAvailable: number;
  totalSeats: number;
  price: number;
  airline: string;
  duration: string;
}

export interface Booking {
  id: string;
  flightId: string;
  passengerName: string;
  email: string;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface AdminUser {
  id: string;
  username: string;
  password: string;
}

export interface SearchParams {
  fromCity: string;
  toCity: string;
  departureDate: string;
  passengers: number;
}