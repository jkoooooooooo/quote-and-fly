import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plane, Clock, Users, MapPin, Calendar, Shield, Wifi, Coffee, Luggage, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Flight } from '@/types/flight';
import { FlightService } from '@/services/flightService';
import { useToast } from '@/hooks/use-toast';

const FlightDetails = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlight = async () => {
      if (!flightId) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const flightData = await FlightService.getFlightById(flightId);
        
        if (flightData) {
          setFlight(flightData);
        } else {
          setError('Flight not found');
        }
      } catch (err) {
        console.error('Failed to fetch flight:', err);
        setError('Failed to load flight details. Please try again.');
        toast({
          title: "Error",
          description: "Failed to load flight details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [flightId, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Plane className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold mb-2">Loading flight details...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{error || 'Flight not found'}</h2>
            <Link to="/" className="text-primary hover:underline">
              Return to search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBookFlight = () => {
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
    navigate('/book');
  };

  const availabilityColor = () => {
    const percentage = (flight.seatsAvailable / flight.totalSeats) * 100;
    if (percentage > 50) return 'success';
    if (percentage > 20) return 'warning';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Navigation */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to search
            </Button>
          </div>

          {/* Flight Header */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Plane className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">{flight.flightNumber}</CardTitle>
                    <p className="text-muted-foreground">{flight.airline}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">${flight.price}</div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Flight Route */}
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Departure */}
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold mb-2">{formatTime(flight.departureTime)}</div>
                  <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-medium">{flight.fromCity}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{formatDate(flight.departureTime)}</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex-1 h-0.5 bg-primary/30 hidden md:block"></div>
                    <div className="mx-4 flex flex-col items-center">
                      <Plane className="h-6 w-6 text-primary mb-2" />
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{flight.duration}</span>
                      </div>
                    </div>
                    <div className="flex-1 h-0.5 bg-primary/30 hidden md:block"></div>
                  </div>
                  <Badge variant="secondary">Direct Flight</Badge>
                </div>

                {/* Arrival */}
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold mb-2">{formatTime(flight.arrivalTime)}</div>
                  <div className="flex items-center justify-center md:justify-end space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-medium">{flight.toCity}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-end space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{formatDate(flight.arrivalTime)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Flight Information */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plane className="h-5 w-5" />
                  <span>Flight Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flight Number</span>
                  <span className="font-medium">{flight.flightNumber}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Airline</span>
                  <span className="font-medium">{flight.airline}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aircraft Type</span>
                  <span className="font-medium">Boeing 737-800</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Seat Availability</span>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{flight.seatsAvailable}/{flight.totalSeats}</span>
                    <Badge variant={availabilityColor() as any} className="text-xs">
                      {((flight.seatsAvailable / flight.totalSeats) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services & Amenities */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Services & Amenities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Wifi className="h-4 w-4 text-primary" />
                    <span className="text-sm">Free WiFi</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coffee className="h-4 w-4 text-primary" />
                    <span className="text-sm">Meal Service</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Luggage className="h-4 w-4 text-primary" />
                    <span className="text-sm">Checked Bag</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">Travel Insurance</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Included Services</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• One carry-on bag (10kg)</li>
                    <li>• One checked bag (23kg)</li>
                    <li>• Seat selection</li>
                    <li>• In-flight entertainment</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Flight */}
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ready to book this flight?</h3>
                  <p className="text-muted-foreground">
                    Complete your booking in just a few simple steps
                  </p>
                </div>
                <Button 
                  onClick={handleBookFlight}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-flight"
                  disabled={flight.seatsAvailable === 0}
                >
                  {flight.seatsAvailable === 0 ? 'Sold Out' : `Book Flight - $${flight.price}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;