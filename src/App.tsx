import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import SearchResults from "./pages/SearchResults";
import SearchFlights from "./pages/SearchFlights";
import BookFlight from "./pages/BookFlight";
import MyBookings from "./pages/MyBookings";
import FlightDetails from "./pages/FlightDetails";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/flights" element={<SearchFlights />} />
            <Route path="/flight/:flightId" element={<FlightDetails />} />
            <Route 
              path="/book" 
              element={
                <ProtectedRoute>
                  <BookFlight />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-bookings" 
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
