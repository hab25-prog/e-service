import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  User,
  Shield,
  MapPin,
  Calendar,
  X,
  Paperclip,
} from "lucide-react";
import useAuth from "../../context/useAuth";
import { useMessage } from "../../hook/useMessage";
import { useSendMessage } from "../../hook/useSendMessage";

function ChatRoom({
  jobId,
  onClose,
  jobDescription,
  jobAddress,
  scheduled_at,
  technician_id,
  technicianName = "Service Provider",
}) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  // 1. Fetch raw query payload data wrapper safely
  const { messages, isLoading, isError } = useMessage({ jobId });

  // FIXED: Guarantees messages fallback is ALWAYS an iterable array instance
  //   const messages = data || [];

  const jobDetails = {
    description: jobDescription,
    address: jobAddress,
    scheduledAt: scheduled_at,
    technician_id: technician_id,
    technicianName: technicianName,
    customerName: user?.full_name || "Customer",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    sendMessage({
      jobId: jobId,
      senderId: user?.id,
      messageText: newMessage,
    });

    setNewMessage("");
  };

  console.log("messages from useMessage hook in ChatRoom.jsx:", messages);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl h-[85vh] bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200 z-10">
        {/* --- CHAT COLUMN --- */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/50">
          <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-emerald-50 text-[#10B981] rounded-2xl flex items-center justify-center font-black text-lg">
                  <User size={22} />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h2 className="font-black text-slate-900 text-base leading-tight">
                  {user?.role === "customer"
                    ? jobDetails.technicianName
                    : jobDetails.customerName}
                </h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5 capitalize tracking-wide">
                  {user?.role === "customer"
                    ? "Authorized Technician"
                    : "Customer (Job Owner)"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </header>

          {/* MESSAGES VIEWPORT ROW */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold animate-pulse text-sm">
                Syncing workspace stream logs...
              </div>
            ) : isError ? (
              <div className="h-full flex items-center justify-center text-rose-500 font-bold text-sm">
                Failed to pull message pipeline safely.
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="p-4 bg-emerald-50 text-[#10B981] rounded-3xl mb-3">
                  <Shield size={32} />
                </div>
                <h3 className="font-black text-slate-800 text-base">
                  Secure Job Workspace
                </h3>
                <p className="text-slate-400 text-xs font-medium max-w-xs mt-1 leading-relaxed">
                  Messages are protected under Row Level Security constraints.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-[1.75rem] px-5 py-3.5 space-y-1 ${
                        isMe
                          ? "bg-[#10B981] text-white rounded-br-sm"
                          : "bg-white text-slate-800 border border-slate-100 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      {/* FIXED: Removed the erroneous '.data' path reference */}
                      <p className="text-sm font-medium leading-relaxed break-words">
                        {msg.message_text}
                      </p>
                      <div
                        className={`flex items-center justify-end gap-1.5 text-[10px] font-bold ${isMe ? "text-emerald-100" : "text-slate-400"}`}
                      >
                        <span>
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT PORT COMPONENT */}
          <footer className="p-4 bg-white border-t border-slate-100 shrink-0">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-2 focus-within:border-[#10B981] focus-within:bg-white focus-within:shadow-md transition-all"
            >
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-colors"
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={isSending}
                placeholder={
                  isSending
                    ? "Publishing comment text..."
                    : "Type a message regarding your service request..."
                }
                className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-sm font-medium text-slate-800 px-2"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isSending}
                className="p-3 bg-[#10B981] disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl shadow-md transition-all shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
          </footer>
        </div>

        {/* --- DETAILS SIDEBAR --- */}
        <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-100 p-6 flex flex-col justify-between shrink-0 bg-white hidden sm:flex">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                Order Workspace
              </span>
              <h3 className="font-black text-slate-900 text-lg leading-tight mt-3">
                {jobDetails.description}
              </h3>
            </div>
            <div className="space-y-4 text-sm font-bold text-slate-500">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-slate-600 font-medium">
                  {jobDetails.address}
                </span>
              </div>
              {jobDetails.scheduledAt && (
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-[#10B981] shrink-0" />
                  <span className="text-slate-600 font-medium">
                    {new Date(jobDetails.scheduledAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default ChatRoom;
