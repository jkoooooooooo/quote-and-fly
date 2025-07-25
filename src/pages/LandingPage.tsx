import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import FlightSearchForm from '@/components/flight/FlightSearchForm';
import { SearchParams } from '@/types/flight';
import { SEAT_CLASSES } from '@/types/seatClass';
import { 
  Plane, 
  MapPin, 
  Clock, 
  Shield, 
  Star, 
  Users, 
  Globe, 
  CreditCard,
  PhoneCall,
  Award,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSearch = (params: SearchParams) => {
    // Store search params and navigate to search results
    sessionStorage.setItem('searchParams', JSON.stringify(params));
    navigate('/search');
  };

  const features = [
    {
      icon: <Globe className="h-8 w-8 text-blue-500" />,
      title: "Global Coverage",
      description: "Access to over 1000+ destinations worldwide with our extensive airline partnerships"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Secure Booking",
      description: "Your transactions are protected with bank-level security and encryption"
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you with any travel needs"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
      title: "Best Prices",
      description: "Competitive pricing with price match guarantee and exclusive deals"
    },
    {
      icon: <PhoneCall className="h-8 w-8 text-red-500" />,
      title: "Instant Confirmation",
      description: "Get immediate booking confirmation and e-tickets delivered instantly"
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: "Trusted Platform",
      description: "Trusted by millions of travelers with 4.8+ star rating"
    }
  ];

  const statistics = [
    { number: "10M+", label: "Happy Travelers" },
    { number: "500+", label: "Airlines" },
    { number: "1000+", label: "Destinations" },
    { number: "4.8★", label: "Rating" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-4">
                ✈️ Your Journey Begins Here
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover the World
              <span className="block text-yellow-300">One Flight at a Time</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Book flights to over 1000+ destinations worldwide with our secure platform. 
              Experience comfort, convenience, and unbeatable prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
                onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Plane className="mr-2 h-5 w-5" />
                Book Your Flight
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6"
                onClick={() => navigate('/search')}
              >
                Explore Destinations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm md:text-base opacity-90">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Floating Plane Animation */}
        <div className="absolute top-20 right-10 opacity-20">
          <Plane className="h-24 w-24 text-white animate-pulse" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-20">
          <Plane className="h-16 w-16 text-white animate-bounce" />
        </div>
      </section>

      {/* Search Section */}
      <section id="search-section" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your Perfect Flight
              </h2>
              <p className="text-xl text-gray-600">
                Search and compare flights from hundreds of airlines
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <FlightSearchForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Seat Classes Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Travel Experience
            </h2>
            <p className="text-xl text-gray-600">
              From comfortable economy to luxurious first class
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {SEAT_CLASSES.map((seatClass) => (
              <Card key={seatClass.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">{seatClass.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{seatClass.name}</h3>
                    <p className="text-gray-600 text-sm">{seatClass.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {seatClass.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                    {seatClass.features.length > 3 && (
                      <div className="text-sm text-gray-500 font-medium">
                        +{seatClass.features.length - 3} more features
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {seatClass.priceMultiplier}x
                      </span>
                      <div className="text-sm text-gray-500">Base price</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose FlightBooker?
            </h2>
            <p className="text-xl text-gray-600">
              We make booking flights simple, secure, and affordable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join millions of travelers who trust FlightBooker for their travel needs. 
            Book now and save up to 30% on your next flight.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => navigate('/auth')}
            >
              <Users className="mr-2 h-5 w-5" />
              Sign Up Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-6"
              onClick={() => navigate('/search')}
            >
              <Plane className="mr-2 h-5 w-5" />
              Browse Flights
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Plane className="mr-2 h-6 w-6" />
                FlightBooker
              </h3>
              <p className="text-gray-400">
                Your trusted partner for hassle-free flight bookings worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/search')} className="hover:text-white transition-colors">Search Flights</button></li>
                <li><button onClick={() => navigate('/my-bookings')} className="hover:text-white transition-colors">My Bookings</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">Sign In</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
                  <span className="text-sm">i</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FlightBooker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;