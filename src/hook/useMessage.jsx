import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../service/supaBaseConf";

export function useMessage({ jobId }) {
  const queryClient = useQueryClient();
  const queryKey = ["chat_messages", jobId];

  // 1. Fetch historical data via TanStack Query
  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("job_id", jobId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!jobId,
  });

  // 2. Realtime WebSocket subscription link
  useEffect(() => {
    if (!jobId) return;

    const channel = supabase
      .channel(`live_chat_${jobId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `job_id=eq.${jobId}`,
        },
        (payload) => {
          const newMessage = payload.new;

          // Target the matching queryKey string array explicitly
          queryClient.setQueryData(
            ["chat_messages", jobId],
            (oldMessages = []) => {
              if (oldMessages.some((msg) => msg.id === newMessage.id)) {
                return oldMessages;
              }
              return [...oldMessages, newMessage];
            },
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [jobId, queryClient]);

  return { messages, isLoading, isError };
}
