import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flight } from "@/types/flight";

interface FlightFormProps {
  flight?: Flight;
  onSubmit: (flightData: Omit<Flight, 'id'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const FlightForm = ({ flight, onSubmit, onCancel, isSubmitting }: FlightFormProps) => {
  const [formData, setFormData] = useState({
    flightNumber: flight?.flightNumber || '',
    fromCity: flight?.fromCity || '',
    toCity: flight?.toCity || '',
    departureTime: flight?.departureTime ? new Date(flight.departureTime).toISOString().slice(0, 16) : '',
    arrivalTime: flight?.arrivalTime ? new Date(flight.arrivalTime).toISOString().slice(0, 16) : '',
    seatsAvailable: flight?.seatsAvailable || 0,
    totalSeats: flight?.totalSeats || 0,
    price: flight?.price || 0,
    airline: flight?.airline || '',
    duration: flight?.duration || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      departureTime: new Date(formData.departureTime).toISOString(),
      arrivalTime: new Date(formData.arrivalTime).toISOString(),
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{flight ? 'Edit Flight' : 'Add New Flight'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="airline">Airline</Label>
              <Input
                id="airline"
                value={formData.airline}
                onChange={(e) => handleChange('airline', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="flightNumber">Flight Number</Label>
              <Input
                id="flightNumber"
                value={formData.flightNumber}
                onChange={(e) => handleChange('flightNumber', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fromCity">From City</Label>
              <Input
                id="fromCity"
                value={formData.fromCity}
                onChange={(e) => handleChange('fromCity', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="toCity">To City</Label>
              <Input
                id="toCity"
                value={formData.toCity}
                onChange={(e) => handleChange('toCity', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departureTime">Departure Time</Label>
              <Input
                id="departureTime"
                type="datetime-local"
                value={formData.departureTime}
                onChange={(e) => handleChange('departureTime', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="arrivalTime">Arrival Time</Label>
              <Input
                id="arrivalTime"
                type="datetime-local"
                value={formData.arrivalTime}
                onChange={(e) => handleChange('arrivalTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="totalSeats">Total Seats</Label>
              <Input
                id="totalSeats"
                type="number"
                min="1"
                value={formData.totalSeats}
                onChange={(e) => handleChange('totalSeats', parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="seatsAvailable">Available Seats</Label>
              <Input
                id="seatsAvailable"
                type="number"
                min="0"
                max={formData.totalSeats}
                value={formData.seatsAvailable}
                onChange={(e) => handleChange('seatsAvailable', parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              placeholder="e.g., 2h 30m"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : flight ? 'Update Flight' : 'Add Flight'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};