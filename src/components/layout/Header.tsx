import { Plane, User, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-gradient-primary shadow-hero">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-foreground hover:opacity-80 transition-opacity">
            <Plane className="h-8 w-8" />
            <span className="text-2xl font-bold">SkyBook</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-primary-foreground hover:text-accent transition-colors ${
                location.pathname === '/' ? 'text-accent font-medium' : ''
              }`}
            >
              Search Flights
            </Link>
            <Link 
              to="/my-bookings" 
              className={`text-primary-foreground hover:text-accent transition-colors ${
                location.pathname === '/my-bookings' ? 'text-accent font-medium' : ''
              }`}
            >
              My Bookings
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="bg-white/10 border-white/20 text-primary-foreground hover:bg-white/20"
            >
              <Link to="/admin">
                <User className="h-4 w-4 mr-2" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;