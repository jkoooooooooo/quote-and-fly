import { Clock, Users, Plane, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { SEAT_CLASSES, calculateClassPrice, getSeatClassById } from '@/types/seatClass';
import type { Database } from '@/integrations/supabase/types';

type Flight = Database['public']['Tables']['flights']['Row'];

interface FlightCardWithClassesProps {
  flight: Flight;
  onBook: (flight: Flight, seatClassId: string) => void;
}

const FlightCardWithClasses = ({ flight, onBook }: FlightCardWithClassesProps) => {
  const navigate = useNavigate();

  const availabilityColor = () => {
    const percentage = (flight.seats_available / flight.total_seats) * 100;
    if (percentage > 50) return 'success';
    if (percentage > 20) return 'warning';
    return 'destructive';
  };

  return (
    <Card className="bg-gradient-card shadow-flight hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Flight Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Plane className="h-6 w-6 text-primary" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-lg">{flight.flight_number}</span>
                  <Badge variant="secondary" className="text-xs">
                    {flight.airline}
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => navigate(`/flight/${flight.id}`)}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>

          {/* Route and Duration */}
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Departure */}
            <div className="text-center">
              <div className="text-2xl font-bold">08:00</div>
              <div className="text-sm font-medium">{flight.from_city}</div>
              <div className="text-xs text-muted-foreground">Today</div>
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
              <div className="text-2xl font-bold">11:30</div>
              <div className="text-sm font-medium">{flight.to_city}</div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </div>

          {/* Seat Classes */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose Your Class</h3>
            <Tabs defaultValue="economy" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {SEAT_CLASSES.map((seatClass) => (
                  <TabsTrigger key={seatClass.id} value={seatClass.id} className="text-xs">
                    {seatClass.icon}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {SEAT_CLASSES.map((seatClass) => {
                const classPrice = calculateClassPrice(flight.price, seatClass.priceMultiplier);
                const estimatedSeatsAvailable = Math.floor(flight.seats_available / SEAT_CLASSES.length);
                
                return (
                  <TabsContent key={seatClass.id} value={seatClass.id} className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg font-semibold">{seatClass.name}</span>
                              <span className="text-2xl">{seatClass.icon}</span>
                            </div>
                            <p className="text-sm text-gray-600">{seatClass.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${classPrice}</div>
                            <div className="text-sm text-muted-foreground">per person</div>
                          </div>
                        </div>
                        
                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                          {seatClass.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                        
                        {/* Availability and Book Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {estimatedSeatsAvailable} seats available
                            </span>
                            <Badge variant={availabilityColor() as any} className="text-xs">
                              Available
                            </Badge>
                          </div>
                          
                          <Button 
                            onClick={() => onBook(flight, seatClass.id)}
                            className="bg-gradient-primary hover:opacity-90 transition-opacity"
                            disabled={estimatedSeatsAvailable === 0}
                          >
                            {estimatedSeatsAvailable === 0 ? 'Sold Out' : `Book ${seatClass.name}`}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightCardWithClasses;