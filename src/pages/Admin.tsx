import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Header from "@/components/layout/Header";
import { FlightForm } from "@/components/flight/FlightForm";
import { SupabaseAdapter } from "@/services/supabaseAdapter";
import { Flight, Booking } from "@/types/flight";
import { useToast } from "@/hooks/use-toast";
import { Plane, Users, Calendar, DollarSign, Edit, Trash2, Plus } from "lucide-react";
import { SupabaseConnectionTest } from "@/components/SupabaseConnectionTest";

const Admin = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [deletingFlight, setDeletingFlight] = useState<Flight | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalFlights: 0,
    totalSeats: 0,
    availableSeats: 0,
    bookedSeats: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    averagePrice: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadFlights();
    loadBookings();
    loadStats();
  }, []);

  const loadFlights = async () => {
    try {
      setLoading(true);
      const flightsData = await SupabaseAdapter.getAllFlights();
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

  const loadBookings = async () => {
    try {
      setBookingsLoading(true);
      const bookingsData = await SupabaseAdapter.getAllBookings();
      setBookings(bookingsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setBookingsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await SupabaseAdapter.getFlightStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleAddFlight = () => {
    setEditingFlight(null);
    setShowForm(true);
  };

  const handleEditFlight = (flight: Flight) => {
    setEditingFlight(flight);
    setShowForm(true);
  };

  const handleDeleteFlight = (flight: Flight) => {
    setDeletingFlight(flight);
  };

  const confirmDeleteFlight = async () => {
    if (!deletingFlight) return;

    try {
      setIsSubmitting(true);
      await SupabaseAdapter.deleteFlight(deletingFlight.id);
      setFlights(prev => prev.filter(f => f.id !== deletingFlight.id));
      loadStats(); // Refresh stats
      toast({
        title: "Success",
        description: "Flight deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete flight",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setDeletingFlight(null);
    }
  };

  const handleSubmitFlight = async (flightData: Omit<Flight, 'id'>) => {
    try {
      setIsSubmitting(true);
      
      if (editingFlight) {
        const updatedFlight = await SupabaseAdapter.updateFlight(editingFlight.id, flightData);
        setFlights(prev => prev.map(f => f.id === editingFlight.id ? updatedFlight : f));
        toast({
          title: "Success",
          description: "Flight updated successfully",
        });
      } else {
        const newFlight = await SupabaseAdapter.createFlight(flightData);
        setFlights(prev => [...prev, newFlight]);
        toast({
          title: "Success",
          description: "Flight added successfully",
        });
      }
      
      loadStats(); // Refresh stats
      setShowForm(false);
      setEditingFlight(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingFlight ? 'update' : 'add'} flight`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingFlight(null);
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

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await SupabaseAdapter.updateBookingStatus(bookingId, newStatus);
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, status: newStatus as 'confirmed' | 'pending' | 'cancelled' } : b
      ));
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

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
              <div className="text-2xl font-bold">{stats.totalFlights}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Seats</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableSeats}</div>
              <p className="text-xs text-muted-foreground">of {stats.totalSeats} total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.bookedSeats}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Status */}
        <div className="mb-6">
          <SupabaseConnectionTest />
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
              <Button onClick={handleAddFlight}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Flight
              </Button>
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
                          <Button variant="outline" size="sm" onClick={() => handleEditFlight(flight)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteFlight(flight)}>
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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Booking Management</h2>
              <div className="text-sm text-muted-foreground">
                {bookings.length} total bookings
              </div>
            </div>

            {bookingsLoading ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center py-8 text-muted-foreground">
                        No bookings found.
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  bookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                              <div className="text-lg font-semibold">
                                Booking #{booking.id.slice(-8)}
                              </div>
                              <Badge variant={
                                booking.status === 'confirmed' ? 'default' :
                                booking.status === 'pending' ? 'secondary' : 'destructive'
                              }>
                                {booking.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="font-medium">Passenger</div>
                                <div className="text-muted-foreground">{booking.passengerName}</div>
                                <div className="text-muted-foreground">{booking.email}</div>
                              </div>
                              <div>
                                <div className="font-medium">Flight ID</div>
                                <div className="text-muted-foreground">{booking.flightId}</div>
                              </div>
                              <div>
                                <div className="font-medium">Booking Date</div>
                                <div className="text-muted-foreground">
                                  {new Date(booking.bookingDate).toLocaleDateString()}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium">Status</div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                    disabled={booking.status === 'confirmed'}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUpdateBookingStatus(booking.id, 'cancelled')}
                                    disabled={booking.status === 'cancelled'}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
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
                    {Math.round(stats.occupancyRate)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stats.bookedSeats} of {stats.totalSeats} seats booked
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Flight Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ${Math.round(stats.averagePrice)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Across {stats.totalFlights} flights
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Flight Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFlight ? 'Edit Flight' : 'Add New Flight'}</DialogTitle>
            </DialogHeader>
            <FlightForm
              flight={editingFlight || undefined}
              onSubmit={handleSubmitFlight}
              onCancel={handleCancelForm}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingFlight} onOpenChange={() => setDeletingFlight(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Flight</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete flight {deletingFlight?.flightNumber}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteFlight} disabled={isSubmitting}>
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Admin;