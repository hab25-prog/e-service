import React, { useState } from "react";
import {
  Clock3,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
  Timer,
  MessageSquare,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import Loader from "../pages/Loader";
import useAuth from "../context/useAuth";
// import useBookings from "../hook/useBookings";
import { useCustomerBookings } from "../hook/useCustomerBookings";
import ChatRoom from "../component/layout/ChatRoom";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("active");
  const [activeChatJobId, setActiveChatJobId] = useState(null);
  const { user } = useAuth();
  // console.log("User Dashboard Rendered for:", user?.id || "Unknown User");

  // Fetch jobs where this user is the owner/customer
  const {
    data: bookings,
    isLoading,
    isError,
  } = useCustomerBookings({
    id: user?.id,
  });
  console.log("Bookings fetched for user:", bookings);
  // Filter logic tailored for Customer perspective
  // Active means the technician is currently handling it
  const activeJobs =
    bookings?.jobs.filter(
      (b) => b.status === "accepted" || b.status === "in_progress",
    ) || [];
  const pendingJobs =
    bookings?.jobs.filter((b) => b.status === "pending") || [];
  const completedJobs =
    bookings?.jobs.filter(
      (b) => b.status === "completed" || b.status === "cancelled",
    ) || [];

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-red-50 rounded-2xl border border-red-100 text-center space-y-3">
        <ShieldAlert className="mx-auto text-red-500" size={40} />
        <h3 className="font-black text-red-950 text-lg">
          Failed to load dashboard
        </h3>
        <p className="text-sm text-red-700">
          There was an issue connecting to the server. Please try refreshing.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          My Bookings
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Track and manage your service requests
        </p>
      </div>

      {/* --- MODERN TAB NAVIGATION --- */}
      <nav className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: "active", label: "Active Jobs", count: activeJobs.length },
          { id: "pending", label: "Awaiting Tech", count: pendingJobs.length },
          { id: "history", label: "History", count: completedJobs.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-white text-[#10B981] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* --- CONTENT AREA --- */}
      <div className="mt-6">
        {activeTab === "active" && (
          <ActiveList
            setActiveChatJobId={setActiveChatJobId}
            jobs={activeJobs}
          />
        )}
        {activeTab === "pending" && <PendingList jobs={pendingJobs} />}
        {activeTab === "history" && <HistoryList jobs={completedJobs} />}
      </div>
      {activeChatJobId && (
        <ChatRoom
          jobId={activeChatJobId.jobId}
          jobDescription={activeChatJobId.jobDescription}
          jobAddress={activeChatJobId.jobAddress}
          scheduled_at={activeChatJobId.scheduled_at}
          technician_id={activeChatJobId.technician_id}
          onClose={() => setActiveChatJobId(null)} // Closes out when requested
        />
      )}
    </div>
  );
}

export default UserDashboard;

// --- SUBCOMPONENT: ACTIVE JOBS ---
function ActiveList({ jobs, setActiveChatJobId }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
        <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 font-bold">
          No active jobs in progress right now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="group bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 hover:shadow-2xl hover:shadow-emerald-50 transition-all duration-300 flex flex-col lg:flex-row lg:items-center gap-6"
        >
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-[#10B981] rounded-2xl animate-pulse">
                <Timer size={24} />
              </div>
              <div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {job.status.replace("_", " ")}
                </span>
                <h3 className="text-lg font-black text-[#0F172A] mt-1.5 leading-tight">
                  {job.description || "Requested Service"}
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-400 text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#10B981]" />
                {new Date(job.scheduled_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 size={14} className="text-[#10B981]" />
                {new Date(job.scheduled_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-500 font-medium">
              <MapPin size={16} className="text-[#10B981] shrink-0 mt-0.5" />
              <span>{job.address_text}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <button
              onClick={() =>
                setActiveChatJobId({
                  jobId: job.id,
                  jobDescription: job.description,
                  jobAddress: job.address_text,
                  scheduled_at: job.scheduled_at,
                  technician_id: job.technician_id,
                })
              }
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-md transition-all active:scale-95 group/btn"
            >
              <MessageSquare size={18} />
              Chat with Tech
            </button>
            <button className="cursor-pointer p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-black transition-colors">
              Finishd Job
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- SUBCOMPONENT: PENDING JOBS ---
function PendingList({ jobs }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
        <Briefcase className="mx-auto text-slate-200 mb-4" size={48} />
        <p className="text-slate-400 font-medium">
          No pending requests. Need something fixed?
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4"
        >
          <div className="space-y-2">
            <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Finding Technician
            </span>
            <h3 className="font-black text-slate-900 text-md">
              {job.description}
            </h3>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <MapPin size={12} className="text-amber-500" /> {job.address_text}
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400 font-bold block">
              Estimated Cost
            </span>
            <span className="font-black text-slate-800 text-base">
              ETB {job.total_price || "---"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- SUBCOMPONENT: HISTORY ---
function HistoryList({ jobs }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 font-medium">
        No completed booking history found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <th className="px-6 py-4">Service</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Amount</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-600">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-black text-slate-900">
                {job.description}
              </td>
              <td className="px-6 py-4 text-xs text-slate-400 font-bold">
                {new Date(job.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 font-bold">
                ETB {job.total_price || "0"}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                    job.status === "completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {job.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
