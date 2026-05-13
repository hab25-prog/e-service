import { useQuery } from "@tanstack/react-query";
import { supabase } from "../service/supaBaseConf";

export default function useSubscription(userId) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      let { data, isLoading, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId);
      return { data, isLoading, error };
    },
  });
  return { subscriptiondata: data, isLoading, error };
}
