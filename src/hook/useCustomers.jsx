import { useQuery } from "@tanstack/react-query";
import { getAllcustomers } from "../service/apiEndPoint";

export function useCustomers() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["customers"],
    queryFn: getAllcustomers,
    staleTime: 5,
  });
  return { data, isLoading, isError };
}
