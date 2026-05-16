import { useQuery } from "@tanstack/react-query";
import { supabase } from "../service/supaBaseConf";

export default function useSubscription(userId) {
  return useQuery({
    queryKey: ["subscription", userId], // Added userId to key for cache safety
    enabled: !!userId,
    queryFn: async () => {
      // Use unique names (subData, subError) to avoid shadowing
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId);

      if (subError) throw subError;
      return { data: subData || [] };
    },
  });
}
