import { supabase } from '@/integrations/supabase/client';

const sampleFlights = [
  {
    flight_number: 'AA101',
    airline: 'American Airlines',
    from_city: 'New York',
    to_city: 'Los Angeles',
    price: 299,
    seats_available: 156,
    total_seats: 180,
    duration: '5h 30m'
  },
  {
    flight_number: 'UA202',
    airline: 'United Airlines',
    from_city: 'New York',
    to_city: 'Los Angeles',
    price: 349,
    seats_available: 23,
    total_seats: 160,
    duration: '5h 45m'
  },
  {
    flight_number: 'DL303',
    airline: 'Delta Airlines',
    from_city: 'New York',
    to_city: 'Los Angeles',
    price: 279,
    seats_available: 67,
    total_seats: 200,
    duration: '5h 40m'
  },
  {
    flight_number: 'SW404',
    airline: 'Southwest Airlines',
    from_city: 'Chicago',
    to_city: 'Miami',
    price: 199,
    seats_available: 89,
    total_seats: 150,
    duration: '3h 45m'
  },
  {
    flight_number: 'JB505',
    airline: 'JetBlue Airways',
    from_city: 'Boston',
    to_city: 'San Francisco',
    price: 389,
    seats_available: 34,
    total_seats: 140,
    duration: '6h 35m'
  },
  {
    flight_number: 'AS106',
    airline: 'Alaska Airlines',
    from_city: 'Seattle',
    to_city: 'Portland',
    price: 129,
    seats_available: 78,
    total_seats: 120,
    duration: '1h 15m'
  },
  {
    flight_number: 'F9207',
    airline: 'Frontier Airlines',
    from_city: 'Denver',
    to_city: 'Las Vegas',
    price: 159,
    seats_available: 92,
    total_seats: 180,
    duration: '2h 10m'
  },
  {
    flight_number: 'B6308',
    airline: 'JetBlue Airways',
    from_city: 'Miami',
    to_city: 'New York',
    price: 249,
    seats_available: 56,
    total_seats: 162,
    duration: '3h 20m'
  },
  {
    flight_number: 'WN409',
    airline: 'Southwest Airlines',
    from_city: 'Los Angeles',
    to_city: 'Phoenix',
    price: 89,
    seats_available: 103,
    total_seats: 143,
    duration: '1h 25m'
  },
  {
    flight_number: 'NK510',
    airline: 'Spirit Airlines',
    from_city: 'Orlando',
    to_city: 'Atlanta',
    price: 79,
    seats_available: 67,
    total_seats: 182,
    duration: '1h 40m'
  },
  {
    flight_number: 'LH441',
    airline: 'Lufthansa',
    from_city: 'New York',
    to_city: 'Frankfurt',
    price: 850,
    seats_available: 198,
    total_seats: 250,
    duration: '7h 45m'
  },
  {
    flight_number: 'BA189',
    airline: 'British Airways',
    from_city: 'Los Angeles',
    to_city: 'London',
    price: 920,
    seats_available: 156,
    total_seats: 275,
    duration: '10h 30m'
  },
  {
    flight_number: 'QF12',
    airline: 'Qantas',
    from_city: 'Los Angeles',
    to_city: 'Sydney',
    price: 1200,
    seats_available: 223,
    total_seats: 280,
    duration: '15h 20m'
  }
];

export async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if flights already exist
    const { data: existingFlights, error: checkError } = await supabase
      .from('flights')
      .select('id')
      .limit(1);

    if (checkError) {
      throw checkError;
    }

    if (existingFlights && existingFlights.length > 0) {
      console.log('✅ Database already contains flights. Skipping seed.');
      return;
    }

    // Insert sample flights
    const { error: insertError } = await supabase
      .from('flights')
      .insert(sampleFlights);

    if (insertError) {
      throw insertError;
    }

    console.log(`✅ Successfully seeded ${sampleFlights.length} flights!`);
    
    // Verify the insert
    const { data: verifyData, error: verifyError } = await supabase
      .from('flights')
      .select('*');

    if (verifyError) {
      throw verifyError;
    }

    console.log(`📊 Total flights in database: ${verifyData?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('🚀 Running database seed...');
  seedDatabase()
    .then(() => console.log('🎉 Seeding completed!'))
    .catch(error => console.error('💥 Seeding failed:', error));
}