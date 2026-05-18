import { fetchTechnicians } from "../service/apiEndPoint";
import { useQuery } from "@tanstack/react-query";
export function useTechnician() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["technician"],
    queryFn: fetchTechnicians,
  });
  const technician = data || []; // Ensure it's always an array
  if (error) console.error("Error fetching technicians:", error);
  console.log("Fetched technicians:", technician);
  return { technician, error, isLoading };
}
