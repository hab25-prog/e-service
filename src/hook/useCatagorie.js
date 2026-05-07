import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../service/apiEndPoint";
export function useCategories() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetchCategories();
      // If your API returns { success: true, data: [...] }, return the array part
      return response.data || [];
    },
  });

  return { data, isLoading, isError };
}
