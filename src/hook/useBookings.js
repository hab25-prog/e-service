import { useQuery } from "@tanstack/react-query";
import { api } from "../service/api";

function useBookings(filters = {}, options = {}) {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const result = await api.listJobs(filters);
      return result.jobs;
    },
    ...options,
  });
}

export default useBookings;
