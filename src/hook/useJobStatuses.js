import { useQuery } from "@tanstack/react-query";
import { fetchJobStatuses } from "../service/apiEndPoint";

function useJobStatuses(options = {}) {
  return useQuery({
    queryKey: ["job-statuses"],
    queryFn: async () => {
      const result = await fetchJobStatuses();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.jobs;
    },
    ...options,
  });
}

export default useJobStatuses;
