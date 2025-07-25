import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Header from "@/components/layout/Header";
import { FlightForm } from "@/components/flight/FlightForm";
import { useFlights, useDeleteFlight, useCreateFlight, useUpdateFlight } from "@/hooks/useFlights";
import { useAllBookings } from "@/hooks/useBookings";
import { toast } from "sonner";
import { Plane, Users, Calendar, DollarSign, Edit, Trash2, Plus, Loader2 } from "lucide-react";
import type { Database } from '@/integrations/supabase/types';

type Flight = Database['public']['Tables']['flights']['Row'];

const Admin = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [deletingFlight, setDeletingFlight] = useState<Flight | null>(null);
  
  const { data: flights = [], isLoading: loadingFlights, error: flightsError } = useFlights();
  const { data: bookings = [], isLoading: loadingBookings, error: bookingsError } = useAllBookings();
  const deleteFlightMutation = useDeleteFlight();
  const createFlightMutation = useCreateFlight();
  const updateFlightMutation = useUpdateFlight();

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
      await deleteFlightMutation.mutateAsync(deletingFlight.id);
      setDeletingFlight(null);
    } catch (error) {
      console.error('Failed to delete flight:', error);
    }
  };

  const handleSubmitFlight = async (flightData: any) => {
    try {
      if (editingFlight) {
        await updateFlightMutation.mutateAsync({ id: editingFlight.id, updates: flightData });
      } else {
        await createFlightMutation.mutateAsync(flightData);
      }
      
      setShowForm(false);
      setEditingFlight(null);
    } catch (error) {
      console.error(`Failed to ${editingFlight ? 'update' : 'add'} flight:`, error);
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

  const totalFlights = flights.length;
  const totalSeats = flights.reduce((sum, flight) => sum + flight.total_seats, 0);
  const availableSeats = flights.reduce((sum, flight) => sum + flight.seats_available, 0);
  const totalRevenue = flights.reduce((sum, flight) => 
    sum + (flight.total_seats - flight.seats_available) * flight.price, 0
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
              <div className="text-2xl font-bold">{bookings.length}</div>
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
              <Button onClick={handleAddFlight}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Flight
              </Button>
            </div>

            {loadingFlights ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading flights...</p>
              </div>
            ) : flightsError ? (
              <div className="text-center py-8 text-destructive">
                <p>Error loading flights. Please try again.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {flights.map((flight) => (
                  <Card key={flight.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="text-lg font-semibold">
                              {flight.airline} {flight.flight_number}
                            </div>
                            <Badge variant={flight.seats_available > 10 ? "default" : "destructive"}>
                              {flight.seats_available} seats available
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Route</div>
                              <div className="text-muted-foreground">
                                {flight.from_city} → {flight.to_city}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">Departure</div>
                              <div className="text-muted-foreground">
                                Today at 08:00 AM
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">Arrival</div>
                              <div className="text-muted-foreground">
                                Today at 11:30 AM
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
            <h2 className="text-2xl font-bold">Booking Management</h2>
            {loadingBookings ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading bookings...</p>
              </div>
            ) : bookingsError ? (
              <div className="text-center py-8 text-destructive">
                <p>Error loading bookings. Please try again.</p>
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8 text-muted-foreground">
                    No bookings found.
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <div className="font-medium">Booking ID</div>
                          <div className="text-muted-foreground">{booking.id.slice(0, 8)}...</div>
                        </div>
                        <div>
                          <div className="font-medium">Passenger</div>
                          <div className="text-muted-foreground">{booking.passenger_name}</div>
                        </div>
                        <div>
                          <div className="font-medium">Email</div>
                          <div className="text-muted-foreground">{booking.email}</div>
                        </div>
                        <div>
                          <div className="font-medium">Flight</div>
                          <div className="text-muted-foreground">
                            {booking.flights?.flight_number} - {booking.flights?.from_city} → {booking.flights?.to_city}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">Status</div>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'cancelled' ? 'destructive' : 'secondary'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
              isSubmitting={createFlightMutation.isPending || updateFlightMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingFlight} onOpenChange={() => setDeletingFlight(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Flight</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete flight {deletingFlight?.flight_number}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteFlight} disabled={deleteFlightMutation.isPending}>
                {deleteFlightMutation.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Admin;