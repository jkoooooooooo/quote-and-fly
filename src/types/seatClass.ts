export interface SeatClass {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceMultiplier: number;
  color: string;
  icon: string;
}

export interface FlightWithClasses {
  id: string;
  flight_number: string;
  airline: string;
  from_city: string;
  to_city: string;
  duration: string;
  base_price: number;
  seat_classes: SeatClassAvailability[];
  created_at?: string;
  updated_at?: string;
}

export interface SeatClassAvailability {
  class_id: string;
  seats_available: number;
  total_seats: number;
  price: number;
}

export interface BookingWithClass extends Omit<BookingWithClass, 'seat_class_id'> {
  id: string;
  flight_id: string;
  passenger_name: string;
  email: string;
  booking_date: string;
  status: string;
  seat_class_id: string;
  passengers: number;
  total_price: number;
  created_at?: string;
  updated_at?: string;
}

export const SEAT_CLASSES: SeatClass[] = [
  {
    id: 'economy',
    name: 'Economy Class',
    description: 'Comfortable and affordable travel',
    features: [
      'Standard seat pitch',
      'In-flight entertainment',
      'Complimentary snacks',
      'Free carry-on baggage'
    ],
    priceMultiplier: 1.0,
    color: 'bg-blue-500',
    icon: '💺'
  },
  {
    id: 'premium-economy',
    name: 'Premium Economy',
    description: 'Extra comfort with enhanced services',
    features: [
      'Extra legroom',
      'Priority boarding',
      'Enhanced meal service',
      'Premium entertainment',
      'Free checked baggage'
    ],
    priceMultiplier: 1.5,
    color: 'bg-purple-500',
    icon: '🛋️'
  },
  {
    id: 'business',
    name: 'Business Class',
    description: 'Premium comfort and luxury',
    features: [
      'Lie-flat seats',
      'Priority check-in',
      'Gourmet meals',
      'Airport lounge access',
      'Priority baggage handling',
      'Extra baggage allowance'
    ],
    priceMultiplier: 3.0,
    color: 'bg-yellow-500',
    icon: '✈️'
  },
  {
    id: 'first',
    name: 'First Class',
    description: 'Ultimate luxury experience',
    features: [
      'Private suites',
      'Personal concierge',
      'Chef-prepared meals',
      'Premium lounge access',
      'Chauffeur service',
      'Unlimited baggage',
      'Priority everything'
    ],
    priceMultiplier: 5.0,
    color: 'bg-amber-500',
    icon: '👑'
  }
];

export const getSeatClassById = (id: string): SeatClass | undefined => {
  return SEAT_CLASSES.find(seatClass => seatClass.id === id);
};

export const calculateClassPrice = (basePrice: number, classMultiplier: number): number => {
  return Math.round(basePrice * classMultiplier);
};