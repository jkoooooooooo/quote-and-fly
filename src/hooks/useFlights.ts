import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flightService, SearchFlightParams } from '@/services/flightService';
import { toast } from 'sonner';

export const useFlights = () => {
  return useQuery({
    queryKey: ['flights'],
    queryFn: flightService.getFlights,
  });
};

export const useSearchFlights = (params: SearchFlightParams) => {
  return useQuery({
    queryKey: ['flights', 'search', params],
    queryFn: () => flightService.searchFlights(params),
    enabled: !!(params.fromCity || params.toCity),
  });
};

export const useFlight = (id: string) => {
  return useQuery({
    queryKey: ['flights', id],
    queryFn: () => flightService.getFlightById(id),
    enabled: !!id,
  });
};

export const useCreateFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: flightService.createFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create flight: ${error.message}`);
    },
  });
};

export const useUpdateFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      flightService.updateFlight(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update flight: ${error.message}`);
    },
  });
};

export const useDeleteFlight = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: flightService.deleteFlight,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast.success('Flight deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete flight: ${error.message}`);
    },
  });
};