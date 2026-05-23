import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJobStatus } from "../service/apiEndPoint";

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    // Receive the explicit object payload down from your UI components directly
    mutationFn: async ({ jobId, newStatus }) => {
      return await updateJobStatus({ jobId, newStatus });
    },
    onSuccess: (response) => {
      console.log("Job status updated successfully:", response);
      // Automatically refresh bookings grids instantly
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });
}
