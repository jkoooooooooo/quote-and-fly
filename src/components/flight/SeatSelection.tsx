import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Briefcase, Users, Check } from 'lucide-react';
import { SeatAllocation, SeatClass } from '@/types/flight';

interface SeatSelectionProps {
  seatAllocations: SeatAllocation[];
  selectedClass: SeatClass | null;
  onClassSelect: (seatClass: SeatClass, price: number) => void;
}

const SeatSelection = ({ seatAllocations, selectedClass, onClassSelect }: SeatSelectionProps) => {
  const getSeatClassIcon = (seatClass: SeatClass) => {
    switch (seatClass) {
      case 'first':
        return <Crown className="h-5 w-5" />;
      case 'business':
        return <Briefcase className="h-5 w-5" />;
      case 'economy':
        return <Users className="h-5 w-5" />;
    }
  };

  const getSeatClassLabel = (seatClass: SeatClass) => {
    switch (seatClass) {
      case 'first':
        return 'First Class';
      case 'business':
        return 'Business Class';
      case 'economy':
        return 'Economy Class';
    }
  };

  const getSeatClassDescription = (seatClass: SeatClass) => {
    switch (seatClass) {
      case 'first':
        return 'Premium experience with luxury amenities, priority boarding, and gourmet dining';
      case 'business':
        return 'Enhanced comfort with extra legroom, priority services, and business lounge access';
      case 'economy':
        return 'Standard seating with essential amenities and in-flight entertainment';
    }
  };

  const getSeatClassColor = (seatClass: SeatClass) => {
    switch (seatClass) {
      case 'first':
        return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'business':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'economy':
        return 'bg-gradient-to-r from-green-500 to-emerald-600';
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span>Select Your Seat Class</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {seatAllocations.map((allocation) => {
          const isSelected = selectedClass === allocation.class;
          const isAvailable = allocation.availableSeats > 0;

          return (
            <div
              key={allocation.class}
              className={`relative border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                isSelected 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : isAvailable 
                    ? 'border-border hover:border-primary/50 hover:bg-accent/50' 
                    : 'border-muted bg-muted/20 cursor-not-allowed opacity-60'
              }`}
              onClick={() => isAvailable && onClassSelect(allocation.class, allocation.price)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check className="h-5 w-5 text-primary" />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full text-white ${getSeatClassColor(allocation.class)}`}>
                    {getSeatClassIcon(allocation.class)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{getSeatClassLabel(allocation.class)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getSeatClassDescription(allocation.class)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">${allocation.price}</div>
                  <div className="text-xs text-muted-foreground">per person</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={allocation.availableSeats > 5 ? "default" : allocation.availableSeats > 0 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {allocation.availableSeats > 0 
                      ? `${allocation.availableSeats} seats available` 
                      : 'Sold out'
                    }
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    of {allocation.totalSeats} total
                  </span>
                </div>

                {isAvailable && (
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClassSelect(allocation.class, allocation.price);
                    }}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SeatSelection;