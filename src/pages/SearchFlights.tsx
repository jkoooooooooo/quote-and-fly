import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import FlightSearchForm from '@/components/flight/FlightSearchForm';
import FlightCard from '@/components/flight/FlightCard';
import { SearchParams, Flight } from '@/types/flight';
import { SupabaseAdapter } from '@/services/supabaseAdapter';
import { useToast } from '@/hooks/use-toast';
import { Plane, MapPin } from 'lucide-react';

const SearchFlights = () => {
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setSearchParams(params);
    setError(null);
    
    try {
      // Search flights using Supabase
      const results = await SupabaseAdapter.searchFlights({
        fromCity: params.fromCity,
        toCity: params.toCity,
        departureDate: params.departureDate,
        passengers: params.passengers
      });
      
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No flights found",
          description: `No flights available from ${params.fromCity} to ${params.toCity} on ${new Date(params.departureDate).toLocaleDateString()}`,
          variant: "default",
        });
      } else {
        toast({
          title: "Search completed",
          description: `Found ${results.length} flight${results.length > 1 ? 's' : ''} matching your criteria`,
        });
      }
    } catch (err: any) {
      console.error('Flight search error:', err);
      setError(err.message || 'Failed to search flights');
      setSearchResults([]);
      toast({
        title: "Search failed",
        description: "Unable to search flights. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookFlight = (flight: Flight) => {
    // Store flight in sessionStorage for booking page
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
    navigate('/book');
  };

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
      {(searchResults.length > 0 || isLoading) && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {searchParams && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Flights from {searchParams.fromCity} to {searchParams.toCity}
                  </h2>
                  <p className="text-muted-foreground">
                    {new Date(searchParams.departureDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                      <div className="h-20 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map(flight => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onBook={handleBookFlight}
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <Plane className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-red-600">Search Error</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <button 
                    onClick={() => searchParams && handleSearch(searchParams)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  >
                    Try Again
                  </button>
                </div>
              ) : searchParams ? (
                <div className="text-center py-12">
                  <Plane className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No flights found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or check other dates
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SearchFlights;