import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, CreditCard, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motivationalQuotes } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateBooking } from '@/hooks/useBookings';
import { toast } from 'sonner';
import { getSeatClassById, calculateClassPrice } from '@/types/seatClass';
import type { Database } from '@/integrations/supabase/types';

type Flight = Database['public']['Tables']['flights']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];

const BookFlight = () => {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [email, setEmail] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [quote, setQuote] = useState('');
  const [selectedSeatClass, setSelectedSeatClass] = useState<string>('economy');
  const navigate = useNavigate();
  const { user } = useAuth();
  const createBookingMutation = useCreateBooking();

  useEffect(() => {
    const selectedFlight = sessionStorage.getItem('selectedFlight');
    const selectedClass = sessionStorage.getItem('selectedSeatClass');
    
    if (selectedFlight) {
      setFlight(JSON.parse(selectedFlight));
    } else {
      navigate('/');
    }
    
    if (selectedClass) {
      setSelectedSeatClass(selectedClass);
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flight || !passengerName || !email) return;

    try {
      const result = await createBookingMutation.mutateAsync({
        flightId: flight.id,
        passengerName,
        email,
        passengers,
      });

      setBooking(result);
      setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      setShowConfirmation(true);
      
      // Clear the stored flight selection
      sessionStorage.removeItem('selectedFlight');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  if (!flight) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No flight selected</h2>
            <Button onClick={() => navigate('/')}>Search Flights</Button>
          </div>
        </div>
      </div>
    );
  }

  if (showConfirmation && booking) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-card shadow-hero">
              <CardHeader className="text-center bg-gradient-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="text-3xl font-bold">Booking Confirmed! ✈️</CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-center space-y-6">
                <div className="text-6xl mb-4">🎉</div>
                
                <div className="bg-accent/10 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-accent-foreground">
                    {quote}
                  </h3>
                </div>

                <div className="space-y-4 text-left bg-muted/50 rounded-lg p-6">
                  <h4 className="font-semibold text-lg mb-4">Booking Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Booking ID:</span>
                      <div className="font-medium">{booking.id}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Flight:</span>
                      <div className="font-medium">{flight.flight_number}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Route:</span>
                      <div className="font-medium">{flight.from_city} → {flight.to_city}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Passenger:</span>
                      <div className="font-medium">{booking.passenger_name}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Departure:</span>
                      <div className="font-medium">
                        Today at 08:00 AM
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Seat Class:</span>
                      <div className="font-medium">{getSeatClassById(selectedSeatClass)?.icon} {getSeatClassById(selectedSeatClass)?.name}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Price:</span>
                      <div className="font-medium text-lg text-primary">${calculateClassPrice(flight.price, getSeatClassById(selectedSeatClass)?.priceMultiplier || 1) * passengers}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('/my-bookings')}
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    View My Bookings
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    size="lg"
                  >
                    Book Another Flight
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Flight Summary */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Flight Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center border-b pb-4">
                  <h3 className="text-2xl font-bold">{flight.flight_number}</h3>
                  <p className="text-muted-foreground">{flight.airline}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From:</span>
                    <span className="font-medium">{flight.from_city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To:</span>
                    <span className="font-medium">{flight.to_city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departure:</span>
                    <span className="font-medium">
                      Today at 08:00 AM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Arrival:</span>
                    <span className="font-medium">
                      Today at 11:30 AM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{flight.duration}</span>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Base Price:</span>
                    <span className="font-medium">${flight.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Seat Class:</span>
                    <span className="font-medium flex items-center">
                      {getSeatClassById(selectedSeatClass)?.icon} {getSeatClassById(selectedSeatClass)?.name || 'Economy Class'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-3">
                    <span className="text-lg font-medium">Total Price:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${calculateClassPrice(flight.price, getSeatClassById(selectedSeatClass)?.priceMultiplier || 1) * passengers}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Passenger Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="passengerName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="passengerName"
                        placeholder="Enter your full name"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passengers">Number of Passengers</Label>
                    <Input
                      id="passengers"
                      type="number"
                      min="1"
                      max="9"
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  <div className="bg-accent/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="h-4 w-4 text-accent-foreground" />
                      <span className="font-medium text-accent-foreground">Payment Information</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This is a demo booking system. No actual payment will be processed.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                    disabled={createBookingMutation.isPending || !passengerName || !email}
                  >
                    {createBookingMutation.isPending ? 'Processing Booking...' : `Book Flight - $${calculateClassPrice(flight.price, getSeatClassById(selectedSeatClass)?.priceMultiplier || 1) * passengers}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFlight;