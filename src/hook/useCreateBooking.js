import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../service/api";

function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingPayload) => api.createBooking(bookingPayload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export default useCreateBooking;
