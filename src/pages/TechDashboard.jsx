import React, { useMemo, useState } from "react";
import {
  Clock3,
  MapPin,
  Calendar,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  Timer,
  AlertCircle,
  ArrowRight,
  User,
  Clock,
  Navigation,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import useAuth from "../context/useAuth";
import useBookings from "../hook/useBookings";
import { useUpdateJobStatus } from "../hook/updateJobStatus";
import { useMutation } from "@tanstack/react-query";

function TechDashboard() {
  const [clickedButton, setClickedButton] = useState("active");
  const { user } = useAuth();
  const { bookings, isLoading } = useBookings({ id: user.id });

  // Filtering Logic
  const activeJobs = bookings?.filter((b) => b.status === "accepted") || [];
  const finishedJobs = bookings?.filter((b) => b.status === "completed") || [];
  const pendingJobs = bookings?.filter((b) => b.status === "pending") || [];

  if (isLoading)
    return (
      <div className="p-10 text-center animate-pulse font-bold text-slate-400">
        Loading your schedule...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* --- MODERN TAB NAVIGATION --- */}
      <nav className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: "active", label: "Active", count: activeJobs.length },
          { id: "pending", label: "Requests", count: pendingJobs.length },
          { id: "finished", label: "History", count: finishedJobs.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setClickedButton(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              clickedButton === tab.id
                ? "bg-white text-[#10B981] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${clickedButton === tab.id ? "bg-emerald-100" : "bg-slate-200"}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* --- CONTENT AREA --- */}
      <div className="mt-6">
        {clickedButton === "active" && <ActiveJobs jobs={activeJobs} />}
        {clickedButton === "finished" && <FinishedJobs jobs={finishedJobs} />}
        {clickedButton === "pending" && <PendingJobs jobs={pendingJobs} />}
      </div>
    </div>
  );
}

export default TechDashboard;

// --- COMPONENT: PENDING JOBS LIST ---
function PendingJobs({ jobs }) {
  const { mutate } = useUpdateJobStatus();

  const handleAccept = (id) => {
    // Pass everything cleanly as one object parameter layout here
    mutate({
      jobId: id,
      newStatus: "accepted",
    });
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
        <Briefcase className="mx-auto text-slate-200 mb-4" size={48} />
        <p className="text-slate-400 font-medium">
          No new job requests at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-xl font-black text-[#0F172A]">New Requests</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Awaiting Approval
        </p>
      </div>

      {jobs.map((job) => (
        <div
          key={job.id}
          className="group bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 hover:border-[#10B981] transition-all hover:shadow-xl hover:shadow-emerald-50 flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-[#10B981] rounded-2xl">
                <Timer size={20} />
              </div>
              <div>
                <h3 className="font-black text-[#0F172A] text-lg leading-tight">
                  {job.description || "General Maintenance Service"}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-slate-400 text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />{" "}
                    {new Date(job.scheduled_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 size={14} />{" "}
                    {new Date(job.scheduled_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-slate-500 font-medium ml-1">
              <MapPin size={16} className="text-[#10B981] shrink-0 mt-0.5" />
              <span>{job.address_text}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0">
            <button className="flex-1 md:flex-none px-6 py-3 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors">
              Decline
            </button>
            <button
              onClick={() => handleAccept(job.id)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-95 group/btn"
            >
              Accept Job
              <ArrowRight
                size={18}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Stubs for other sections
function ActiveJobs({ jobs }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
        <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500 font-bold">No active jobs in progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between px-4">
        <h2 className="text-xl font-black text-[#0F172A]">In Progress</h2>
        <span className="bg-emerald-100 text-[#10B981] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
          Live Tracking
        </span>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="group bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 flex flex-col lg:flex-row lg:items-center gap-8"
          >
            {/* 1. Job Identity & Time */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#0F172A] text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Navigation size={24} className="text-[#10B981]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#0F172A] leading-tight mb-1">
                    {job.description || "Active Service Job"}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-tight">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#10B981]" />
                      {new Date(job.scheduled_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-[#10B981]" />
                      {new Date(job.scheduled_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. Location Detail */}
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <MapPin size={18} className="text-[#10B981] shrink-0" />
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  {job.address_text}
                </p>
              </div>
            </div>

            {/* 3. Actions Row */}
            <div className="flex items-center gap-3 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-50">
              {/* Chat Button */}
              <button
                onClick={() => console.log("Open Chat Room:", job.id)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-[#10B981] hover:bg-emerald-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-100 transition-all active:scale-95 group/btn"
              >
                <MessageSquare
                  size={20}
                  className="group-hover/btn:rotate-12 transition-transform"
                />
                Open Chat Room
              </button>

              {/* Job Details/Complete Button */}
              <button className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-colors shadow-lg">
                <ExternalLink size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinishedJobs({ jobs }) {
  return (
    <div className="p-12 text-center text-slate-400 font-medium">
      Viewing completed work history.
    </div>
  );
}
