import { useMutation } from "@tanstack/react-query";
import { supabase } from "../service/supaBaseConf";

export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ jobId, senderId, messageText }) => {
      if (!messageText.trim() || !jobId) {
        throw new Error("Message text and Job ID are required.");
      }

      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          job_id: jobId,
          sender_id: senderId,
          message_text: messageText.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      console.error("Mutation failure. Row not inserted:", error.message);
    },
  });
}
