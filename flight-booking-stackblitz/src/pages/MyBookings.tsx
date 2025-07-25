import { Calendar, Clock, User, Plane, MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { useUserBookings, useCancelBooking } from '@/hooks/useBookings';
import { toast } from 'sonner';

const MyBookings = () => {
  const { data: bookings = [], isLoading, error, refetch } = useUserBookings();
  const cancelBookingMutation = useCancelBooking();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

    const cancelBooking = async (bookingId: string) => {
    try {
      await cancelBookingMutation.mutateAsync(bookingId);
      refetch();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-semibold mb-2">Loading Your Bookings</h2>
            <p className="text-muted-foreground">
              Please wait while we fetch your flight reservations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Plane className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Error Loading Bookings</h2>
            <p className="text-muted-foreground mb-6">
              There was an error loading your bookings. Please try again.
            </p>
            <Button onClick={() => refetch()} className="bg-gradient-primary hover:opacity-90">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Plane className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Bookings Found</h2>
            <p className="text-muted-foreground mb-6">
              You haven't made any flight bookings yet.
            </p>
            <Button asChild className="bg-gradient-primary hover:opacity-90">
              <a href="/">Search Flights</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage your flight reservations and travel plans
          </p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => {
            const flight = booking.flights;
            if (!flight) return null;

            return (
              <Card key={booking.id} className="bg-gradient-card shadow-flight hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      <Plane className="h-6 w-6 text-primary" />
                      <span>{flight.flight_number}</span>
                      <Badge variant="secondary">{flight.airline}</Badge>
                    </CardTitle>
                    <Badge variant={getStatusVariant(booking.status)}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Flight Route */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">08:00</div>
                      <div className="flex items-center justify-center space-x-1 text-sm font-medium">
                        <MapPin className="h-3 w-3" />
                        <span>{flight.from_city}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(booking.booking_date)}
                      </div>
                    </div>

                    <div className="text-center relative">
                      <div className="flex items-center justify-center mb-2">
                        <div className="flex-1 h-0.5 bg-primary/30"></div>
                        <Plane className="h-4 w-4 text-primary mx-2" />
                        <div className="flex-1 h-0.5 bg-primary/30"></div>
                      </div>
                      <div className="text-sm font-medium flex items-center justify-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {flight.duration}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold">11:30</div>
                      <div className="flex items-center justify-center space-x-1 text-sm font-medium">
                        <MapPin className="h-3 w-3" />
                        <span>{flight.to_city}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(booking.booking_date)}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Passenger:</span> {booking.passenger_name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          <span className="font-medium">Booked:</span> {formatDate(booking.booking_date)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">${flight.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status === 'confirmed' && (
                    <div className="border-t pt-4 flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;