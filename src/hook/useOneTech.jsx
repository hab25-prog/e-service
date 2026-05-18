import { useQuery } from "@tanstack/react-query";
import { getTechnicianDetails } from "../service/apiEndPoint";

export function useOneTech(techId) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["onetech"],
    queryFn: () => getTechnicianDetails(techId),
  });
  return { data, isLoading, isError };
}
