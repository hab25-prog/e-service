import { useQuery } from "@tanstack/react-query";
import { getAllTechnicians } from "../service/apiEndPoint";

export function useTechnicians() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["technicians"],
    queryFn: getAllTechnicians,
  });
  return {
    data,
    isLoading,
    isError,
  };
}
