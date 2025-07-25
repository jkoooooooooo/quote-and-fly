import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import FlightSearchForm from '@/components/flight/FlightSearchForm';
import FlightCard from '@/components/flight/FlightCard';
import { SearchParams } from '@/types/flight';
import { useSearchFlights, useFlights } from '@/hooks/useFlights';
import { seedDatabase } from '@/scripts/seedDatabase';
import { Plane, MapPin } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type Flight = Database['public']['Tables']['flights']['Row'];

const SearchFlights = () => {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const navigate = useNavigate();

  // Seed database on component mount
  useEffect(() => {
    seedDatabase().catch(console.error);
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
  };

  const handleBookFlight = (flight: Flight) => {
    // Store flight in sessionStorage for booking page
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
    navigate('/book');
  };

  const isLoading = loadingAllFlights || loadingSearch;
  const displayFlights = searchParams ? searchResults : allFlights;

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Flight
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Book flights to destinations worldwide with the best prices and service
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Plane className="h-5 w-5" />
                <span>500+ Airlines</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>1000+ Destinations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto -mt-8 relative z-10">
            <FlightSearchForm onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Search Results */}
      {(displayFlights.length > 0 || isLoading || searchError) && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {searchParams 
                    ? `Flights from ${searchParams.fromCity} to ${searchParams.toCity}`
                    : `Available Flights`
                  }
                </h2>
                {searchParams && (
                  <p className="text-muted-foreground">
                    {new Date(searchParams.departureDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                      <div className="h-20 bg-muted rounded"></div>
                    </div>
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
              ) : displayFlights.length > 0 ? (
                <div className="space-y-4">
                  {displayFlights.map(flight => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onBook={handleBookFlight}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Plane className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {searchParams ? 'No flights found' : 'No flights available'}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchParams 
                      ? 'Try adjusting your search criteria or check other dates'
                      : 'There are no flights available at the moment. Please check back later or contact an administrator to add flights.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchFlights;