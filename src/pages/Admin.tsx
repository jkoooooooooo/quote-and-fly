import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { FlightService } from "@/services/flightService";
import { Flight } from "@/types/flight";
import { useToast } from "@/hooks/use-toast";
import { Plane, Users, Calendar, DollarSign, Edit, Trash2 } from "lucide-react";

const Admin = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      setLoading(true);
      const flightsData = await FlightService.getAllFlights();
      setFlights(flightsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load flights",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalFlights = flights.length;
  const totalSeats = flights.reduce((sum, flight) => sum + flight.totalSeats, 0);
  const availableSeats = flights.reduce((sum, flight) => sum + flight.seatsAvailable, 0);
  const totalRevenue = flights.reduce((sum, flight) => 
    sum + (flight.totalSeats - flight.seatsAvailable) * flight.price, 0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage flights, bookings, and view analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Flights</CardTitle>
              <Plane className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFlights}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Seats</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableSeats}</div>
              <p className="text-xs text-muted-foreground">of {totalSeats} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSeats - availableSeats}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="flights" className="space-y-6">
          <TabsList>
            <TabsTrigger value="flights">Flight Management</TabsTrigger>
            <TabsTrigger value="bookings">Booking Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="flights" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Flight Management</h2>
              <Button>Add New Flight</Button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading flights...</div>
            ) : (
              <div className="grid gap-4">
                {flights.map((flight) => (
                  <Card key={flight.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-lg font-semibold">
                              {flight.airline} {flight.flightNumber}
                            </div>
                            <Badge variant={flight.seatsAvailable > 10 ? "default" : "destructive"}>
                              {flight.seatsAvailable} seats available
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Route</div>
                              <div className="text-muted-foreground">
                                {flight.fromCity} → {flight.toCity}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">Departure</div>
                              <div className="text-muted-foreground">
                                {formatDate(flight.departureTime)} at {formatTime(flight.departureTime)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">Arrival</div>
                              <div className="text-muted-foreground">
                                {formatDate(flight.arrivalTime)} at {formatTime(flight.arrivalTime)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">Price</div>
                              <div className="text-muted-foreground">${flight.price}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <h2 className="text-2xl font-bold">Booking Management</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8 text-muted-foreground">
                  Booking management features will be available once connected to a database.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {totalSeats > 0 ? Math.round(((totalSeats - availableSeats) / totalSeats) * 100) : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {totalSeats - availableSeats} of {totalSeats} seats booked
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Flight Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${flights.length > 0 ? Math.round(flights.reduce((sum, f) => sum + f.price, 0) / flights.length) : 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Across {flights.length} flights
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;