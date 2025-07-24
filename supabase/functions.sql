-- Function to decrease flight seats when a booking is made
CREATE OR REPLACE FUNCTION decrease_flight_seats(flight_id uuid, seats_count integer)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE flights 
  SET seats_available = seats_available - seats_count,
      updated_at = NOW()
  WHERE id = flight_id 
    AND seats_available >= seats_count;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Flight not found or insufficient seats available';
  END IF;
END;
$$;

-- Function to increase flight seats when a booking is cancelled
CREATE OR REPLACE FUNCTION increase_flight_seats(flight_id uuid, seats_count integer)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE flights 
  SET seats_available = seats_available + seats_count,
      updated_at = NOW()
  WHERE id = flight_id;
    
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Flight not found';
  END IF;
END;
$$;

-- Function to get booking with flight details
CREATE OR REPLACE FUNCTION get_booking_with_flight(booking_id uuid)
RETURNS TABLE (
  booking_id uuid,
  passenger_name text,
  email text,
  booking_date date,
  status text,
  flight_id uuid,
  flight_number text,
  airline text,
  from_city text,
  to_city text,
  departure_time timestamptz,
  arrival_time timestamptz,
  price decimal
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as booking_id,
    b.passenger_name,
    b.email,
    b.booking_date,
    b.status,
    f.id as flight_id,
    f.flight_number,
    f.airline,
    f.from_city,
    f.to_city,
    f.departure_time,
    f.arrival_time,
    f.price
  FROM bookings b
  JOIN flights f ON b.flight_id = f.id
  WHERE b.id = booking_id;
END;
$$;