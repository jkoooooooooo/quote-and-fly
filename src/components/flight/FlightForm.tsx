import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Flight, SeatAllocation, SeatClass } from "@/types/flight";

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
  seatClass: flight?.seatClass || 'economy', // NEW
});


  const [seatAllocations, setSeatAllocations] = useState<SeatAllocation[]>(
    flight?.seatAllocations || [
      { class: 'economy', totalSeats: 150, availableSeats: 150, price: 299 },
      { class: 'business', totalSeats: 30, availableSeats: 30, price: 699 },
      { class: 'first', totalSeats: 12, availableSeats: 12, price: 1299 }
    ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total seats and available seats from allocations
    const totalSeats = seatAllocations.reduce((sum, allocation) => sum + allocation.totalSeats, 0);
    const seatsAvailable = seatAllocations.reduce((sum, allocation) => sum + allocation.availableSeats, 0);
    
    onSubmit({
      ...formData,
      departureTime: new Date(formData.departureTime).toISOString(),
      arrivalTime: new Date(formData.arrivalTime).toISOString(),
      totalSeats,
      seatsAvailable,
      seatAllocations,
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateSeatAllocation = (index: number, field: keyof SeatAllocation, value: any) => {
    setSeatAllocations(prev => prev.map((allocation, i) => 
      i === index ? { ...allocation, [field]: value } : allocation
    ));
  };

  const getSeatClassLabel = (seatClass: SeatClass) => {
    switch (seatClass) {
      case 'first': return 'First Class';
      case 'business': return 'Business Class';
      case 'economy': return 'Economy Class';
    }
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

          <div>
            <Label htmlFor="price">Base Price ($)</Label>
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

          {/* Seat Allocations */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">Seat Class Configuration</Label>
            {seatAllocations.map((allocation, index) => (
              <Card key={allocation.class} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{getSeatClassLabel(allocation.class)}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`totalSeats-${allocation.class}`}>Total Seats</Label>
                    <Input
                      id={`totalSeats-${allocation.class}`}
                      type="number"
                      min="0"
                      value={allocation.totalSeats}
                      onChange={(e) => updateSeatAllocation(index, 'totalSeats', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`availableSeats-${allocation.class}`}>Available Seats</Label>
                    <Input
                      id={`availableSeats-${allocation.class}`}
                      type="number"
                      min="0"
                      max={allocation.totalSeats}
                      value={allocation.availableSeats}
                      onChange={(e) => updateSeatAllocation(index, 'availableSeats', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor={`price-${allocation.class}`}>Price ($)</Label>
                    <Input
                      id={`price-${allocation.class}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={allocation.price}
                      onChange={(e) => updateSeatAllocation(index, 'price', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>
              </Card>
            ))}
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
          <div>
  <Label htmlFor="seatClass">Seat Class</Label>
  <select
    id="seatClass"
    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
    value={formData.seatClass}
    onChange={(e) => handleChange('seatClass', e.target.value)}
    required
  >
    <option value="economy">Economy</option>
    <option value="business">Business</option>
    <option value="first">First Class</option>
  </select>
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
