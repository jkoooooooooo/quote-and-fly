import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import FlightSearchForm from '@/components/flight/FlightSearchForm';
import FlightCardWithClasses from '@/components/flight/FlightCardWithClasses';
import { SearchParams } from '@/types/flight';
import { useSearchFlights, useFlights } from '@/hooks/useFlights';
import { Plane, MapPin, Filter, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';

type Flight = Database['public']['Tables']['flights']['Row'];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [sortBy, setSortBy] = useState<string>('price');
  const navigate = useNavigate();

  // Load search params from session storage on mount
  useEffect(() => {
    const storedParams = sessionStorage.getItem('searchParams');
    if (storedParams) {
      setSearchParams(JSON.parse(storedParams));
    }
  }, []);

  // Use real flights from Supabase
  const { data: allFlights = [], isLoading: loadingAllFlights } = useFlights();
  const { 
    data: searchResults = [], 
    isLoading: loadingSearch,
    isError: searchError 
  } = useSearchFlights(
    searchParams ? {
      fromCity: searchParams.fromCity,
      toCity: searchParams.toCity,
      departureDate: searchParams.departureDate,
    } : {}
  );

  const handleSearch = async (params: SearchParams) => {
    setSearchParams(params);
    sessionStorage.setItem('searchParams', JSON.stringify(params));
  };

  const handleBookFlight = (flight: Flight, seatClassId: string) => {
    // Store flight and seat class selection for booking page
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
    sessionStorage.setItem('selectedSeatClass', seatClassId);
    navigate('/book');
  };

  const isLoading = loadingAllFlights || loadingSearch;
  const displayFlights = searchParams ? searchResults : allFlights;

  // Sort flights based on selected criteria
  const sortedFlights = [...displayFlights].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'duration':
        return a.duration.localeCompare(b.duration);
      case 'airline':
        return a.airline.localeCompare(b.airline);
      case 'departure':
        return a.from_city.localeCompare(b.from_city);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Header />
      
      {/* Search Header */}
      <section className="bg-gradient-hero text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {searchParams ? 'Search Results' : 'All Available Flights'}
              </h1>
              <p className="text-xl opacity-90">
                {searchParams 
                  ? `Flights from ${searchParams.fromCity} to ${searchParams.toCity}`
                  : 'Discover amazing destinations worldwide'
                }
              </p>
            </div>
            
            {/* Search Form */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <FlightSearchForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Results Header with Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold">
                {isLoading ? 'Loading flights...' : 
                 searchParams ? `Found ${sortedFlights.length} flights` : 
                 `Available flights (${sortedFlights.length})`}
              </h2>
              {searchParams && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="outline">
                    {searchParams.departureDate}
                  </Badge>
                </div>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SortAsc className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="airline">Airline</SelectItem>
                    <SelectItem value="departure">Departure City</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Flight Results */}
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : searchError ? (
            <div className="text-center py-12">
              <Plane className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Error loading flights</h3>
              <p className="text-muted-foreground">
                There was an error loading flights. Please try again later.
              </p>
            </div>
          ) : sortedFlights.length > 0 ? (
            <div className="space-y-6">
              {sortedFlights.map((flight) => (
                <FlightCardWithClasses
                  key={flight.id} 
                  flight={flight} 
                  onBook={handleBookFlight}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchParams ? 'No flights found' : 'No flights available'}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchParams 
                  ? "We couldn't find any flights matching your search criteria. Try adjusting your dates or destinations."
                  : "There are no flights available at the moment. Please check back later or contact an administrator to add flights."}
              </p>
              {searchParams && (
                <Button onClick={() => setSearchParams(null)} variant="outline">
                  <Plane className="mr-2 h-4 w-4" />
                  View All Flights
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchResults;