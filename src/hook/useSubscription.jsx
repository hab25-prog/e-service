import { useQuery } from "@tanstack/react-query";
import { supabase } from "../service/supaBaseConf";

export default function useSubscription(userId) {
  return useQuery({
    queryKey: ["subscription"], // Include userId for correct cache
    enabled: !!userId,
    queryFn: async () => {
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId);

      if (subError) throw subError;
      return { data: subData || [] };
    },
  });
}
