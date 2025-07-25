import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Database } from '@/integrations/supabase/types';

type Flight = Database['public']['Tables']['flights']['Row'];
type FlightInsert = Database['public']['Tables']['flights']['Insert'];

interface FlightFormProps {
  flight?: Flight;
  onSubmit: (flightData: FlightInsert) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const FlightForm = ({ flight, onSubmit, onCancel, isSubmitting }: FlightFormProps) => {
  const [formData, setFormData] = useState({
    flight_number: flight?.flight_number || '',
    from_city: flight?.from_city || '',
    to_city: flight?.to_city || '',
    seats_available: flight?.seats_available || 0,
    total_seats: flight?.total_seats || 0,
    price: flight?.price || 0,
    airline: flight?.airline || '',
    duration: flight?.duration || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
              <Label htmlFor="flight_number">Flight Number</Label>
              <Input
                id="flight_number"
                value={formData.flight_number}
                onChange={(e) => handleChange('flight_number', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from_city">From City</Label>
              <Input
                id="from_city"
                value={formData.from_city}
                onChange={(e) => handleChange('from_city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="to_city">To City</Label>
              <Input
                id="to_city"
                value={formData.to_city}
                onChange={(e) => handleChange('to_city', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="total_seats">Total Seats</Label>
              <Input
                id="total_seats"
                type="number"
                min="1"
                value={formData.total_seats}
                onChange={(e) => handleChange('total_seats', parseInt(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="seats_available">Available Seats</Label>
              <Input
                id="seats_available"
                type="number"
                min="0"
                max={formData.total_seats}
                value={formData.seats_available}
                onChange={(e) => handleChange('seats_available', parseInt(e.target.value))}
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