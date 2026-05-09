import { useQuery } from "@tanstack/react-query";
import { fetchJobStatuses } from "../service/apiEndPoint";
import useAuth from "../context/useAuth";

function useJobStatuses(options = {}) {
  const { user } = useAuth();
  const { data } = useQuery({
    queryKey: ["jobs", user?.id],
    queryFn: () => fetchJobStatuses(user.id),
    // ONLY run this query if user.id is truthy
    enabled: !!user?.id,
  });
  return data || [];
}

export default useJobStatuses;
