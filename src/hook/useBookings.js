import { useQuery } from "@tanstack/react-query";

import { fetchBookings } from "../service/apiEndPoint";

function useBookings({ id }) {
  const { data, isLoading, isError, error } = useQuery({
    // 1. Add id to queryKey so it refetches when the ID changes
    queryKey: ["bookings", id],
    queryFn: async () => {
      // Don't run the query if there's no valid ID passed yet
      if (!id) return [];

      const result = await fetchBookings({ id });

      // 2. Explicitly handle API returning success: false
      if (!result.success) {
        throw new Error(result.error || "Failed to fetch bookings");
      }

      return result.jobs;
    },
    enabled: !!id, // Only run the query if ID is truthy
  });

  return {
    bookings: data || [], // Fallback to an empty array instead of undefined
    isLoading,
    isError,
    error,
  };
}

export default useBookings;
