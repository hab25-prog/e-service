import { useQuery } from "@tanstack/react-query";
import { fetchCustomerBookings } from "../service/apiEndPoint";

export function useCustomerBookings({ id }) {
  console.log(
    "from useCustomerBookings Fetching customer bookings for ID:",
    id,
  );
  const { data, isLoading, isError } = useQuery({
    queryKey: ["customerBookings", id],
    queryFn: () => fetchCustomerBookings({ id }),
    staleTime: 60 * 1000, // Cache for 5 minutes
  });
  return { data, isLoading, isError };
}
