import { Clock, Users, Plane, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flight } from '@/types/flight';
import { useNavigate } from 'react-router-dom';

interface FlightCardProps {
  flight: Flight;
  onBook: (flight: Flight) => void;
}

const FlightCard = ({ flight, onBook }: FlightCardProps) => {
  const navigate = useNavigate();
  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const availabilityColor = () => {
    const percentage = (flight.seatsAvailable / flight.totalSeats) * 100;
    if (percentage > 50) return 'success';
    if (percentage > 20) return 'warning';
    return 'destructive';
  };

  return (
    <Card className="bg-gradient-card shadow-flight hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Flight Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plane className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">{flight.flightNumber}</span>
                <Badge variant="secondary" className="text-xs">
                  {flight.airline}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">${flight.price}</div>
                <div className="text-sm text-muted-foreground">per person</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center">
              {/* Departure */}
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(flight.departureTime)}</div>
                <div className="text-sm font-medium">{flight.fromCity}</div>
                <div className="text-xs text-muted-foreground">{formatDate(flight.departureTime)}</div>
              </div>

              {/* Duration */}
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

              {/* Arrival */}
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(flight.arrivalTime)}</div>
                <div className="text-sm font-medium">{flight.toCity}</div>
                <div className="text-xs text-muted-foreground">{formatDate(flight.arrivalTime)}</div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {flight.seatsAvailable} of {flight.totalSeats} seats available
                </span>
                <Badge variant={availabilityColor() as any} className="text-xs">
                  {((flight.seatsAvailable / flight.totalSeats) * 100).toFixed(0)}% available
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:ml-6 flex flex-col gap-2">
            <Button 
              onClick={() => navigate(`/flight/${flight.id}`)}
              variant="outline"
              size="lg"
              className="w-full md:w-auto"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button 
              onClick={() => onBook(flight)}
              size="lg"
              className="w-full md:w-auto bg-gradient-primary hover:opacity-90 transition-opacity shadow-flight"
              disabled={flight.seatsAvailable === 0}
            >
              {flight.seatsAvailable === 0 ? 'Sold Out' : 'Book Flight'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightCard;