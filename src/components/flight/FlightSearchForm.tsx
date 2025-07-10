import { useState } from 'react';
import { Search, Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { SearchParams } from '@/types/flight';
import { popularCities } from '@/data/mockData';

interface FlightSearchFormProps {
  onSearch: (params: SearchParams) => void;
}

const FlightSearchForm = ({ onSearch }: FlightSearchFormProps) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    fromCity: '',
    toCity: '',
    departureDate: '',
    passengers: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search form submitted with params:', searchParams);
    
    if (!searchParams.fromCity || !searchParams.toCity || !searchParams.departureDate) {
      console.log('Missing required fields:', {
        fromCity: !searchParams.fromCity,
        toCity: !searchParams.toCity,
        departureDate: !searchParams.departureDate
      });
      alert('Please fill in all required fields: From City, To City, and Departure Date');
      return;
    }
    
    console.log('Calling onSearch with valid params');
    onSearch(searchParams);
  };

  const handleSwapCities = () => {
    setSearchParams(prev => ({
      ...prev,
      fromCity: prev.toCity,
      toCity: prev.fromCity
    }));
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <div className="space-y-2">
              <Label htmlFor="fromCity" className="text-sm font-medium">From</Label>
              <div className="relative">
                <Input
                  id="fromCity"
                  list="fromCities"
                  placeholder="Departure city"
                  value={searchParams.fromCity}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, fromCity: e.target.value }))}
                  className="pl-4 pr-4 py-3 text-base"
                  required
                />
                <datalist id="fromCities">
                  {popularCities.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="absolute left-1/2 top-8 transform -translate-x-1/2 hidden md:block">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSwapCities}
                className="rounded-full p-2 h-8 w-8 border-primary/20 hover:border-primary hover:bg-primary/10"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toCity" className="text-sm font-medium">To</Label>
              <div className="relative">
                <Input
                  id="toCity"
                  list="toCities"
                  placeholder="Destination city"
                  value={searchParams.toCity}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, toCity: e.target.value }))}
                  className="pl-4 pr-4 py-3 text-base"
                  required
                />
                <datalist id="toCities">
                  {popularCities.map(city => (
                    <option key={city} value={city} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departureDate" className="text-sm font-medium">Departure Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="departureDate"
                  type="date"
                  value={searchParams.departureDate}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                  className="pl-10 pr-4 py-3 text-base"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengers" className="text-sm font-medium">Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="passengers"
                  type="number"
                  min="1"
                  max="9"
                  value={searchParams.passengers}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, passengers: parseInt(e.target.value) || 1 }))}
                  className="pl-10 pr-4 py-3 text-base"
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-flight"
          >
            <Search className="h-5 w-5 mr-2" />
            Search Flights
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FlightSearchForm;