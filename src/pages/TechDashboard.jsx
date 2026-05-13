import React, { useMemo } from "react";
import {
  Clock3,
  MapPin,
  Search,
  ChevronRight,
  Briefcase,
  CheckCircle2,
  Timer,
  Star,
} from "lucide-react";
import useAuth from "../context/useAuth";
import { technicianPerformance, technicianQueue } from "../data/mockData";
import useBookings from "../hook/useBookings";
import useJobStatuses from "../hook/useJobStatuses";

function TechDashboard() {
  const { user } = useAuth();
  const technicianName =
    user?.full_name?.trim() || user?.username || "Technician";

  const { data: liveBookings = [] } = useBookings(
    { technicianName },
    { enabled: Boolean(technicianName) },
  );

  const { data: jobStatuses = [], isLoading: isLoadingStatuses } =
    useJobStatuses();

  // Process the queue logic
  const queue = useMemo(() => {
    if (!liveBookings.length) return technicianQueue.slice(0, 5);
    return liveBookings.map((booking) => ({
      id: booking.bookingId ?? booking.id,
      customer: booking.ownerEmail || "Customer",
      service: booking.service,
      schedule: booking.dateLabel,
      location: booking.address,
      status: booking.status,
    }));
  }, [liveBookings]);

  // Process live status cards
  const liveStatusCards = useMemo(() => {
    const counts = jobStatuses.reduce((acc, job) => {
      const s = job?.status?.trim() || "Unknown";
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});

    return [
      {
        label: "Scheduled",
        value: counts["Scheduled"] || 0,
        icon: Clock3,
        color: "text-blue-500",
      },
      {
        label: "Confirmed",
        value: counts["Confirmed"] || 0,
        icon: CheckCircle2,
        color: "text-[#006666]",
      },
      {
        label: "In Progress",
        value: counts["In progress"] || 0,
        icon: Timer,
        color: "text-amber-500",
      },
      {
        label: "Total Jobs",
        value: jobStatuses.length,
        icon: Briefcase,
        color: "text-slate-700",
      },
    ];
  }, [jobStatuses]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
      {/* --- HERO WELCOME SECTION --- */}
      <section className="relative overflow-hidden rounded-[32px] bg-[#111827] p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            Hello,{" "}
            <span className="text-[#006666] bg-white px-3 rounded-xl">
              {technicianName.split(" ")[0]}
            </span>
          </h1>
          <p className="text-slate-400 text-lg font-medium leading-relaxed">
            Your field operations are looking strong today. You have{" "}
            <span className="text-white font-bold">{queue.length} jobs</span>{" "}
            remaining in your current pipeline.
          </p>
        </div>
        {/* Subtle decorative element */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-[#006666] rounded-full blur-[120px] opacity-20" />
      </section>

      {/* --- QUICK STATS GRID --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {liveStatusCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-2xl bg-gray-50 ${stat.color} group-hover:scale-110 transition-transform`}
              >
                <stat.icon size={22} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Live
              </span>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">
              {isLoadingStatuses ? "..." : String(stat.value).padStart(2, "0")}
            </p>
            <p className="text-sm font-bold text-slate-500">{stat.label}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- MAIN QUEUE SECTION --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Daily Workboard
            </h2>
            <div className="flex items-center gap-2 text-sm font-bold text-[#006666] cursor-pointer hover:underline">
              View History <ChevronRight size={16} />
            </div>
          </div>

          <div className="space-y-4">
            {queue.length > 0 ? (
              queue.map((job) => (
                <article
                  key={job.id}
                  className="group bg-white rounded-[28px] border border-gray-100 p-6 hover:border-[#006666]/30 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#006666] font-bold shrink-0">
                        {job.service.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#006666] transition-colors">
                          {job.service}
                        </h3>
                        <p className="text-sm font-medium text-slate-400 mt-0.5">
                          {job.customer} • ID: {job.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest self-start md:self-center ${
                        job.status === "In progress"
                          ? "bg-amber-50 text-amber-600"
                          : job.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      {job.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <Clock3 size={18} className="text-[#006666]" />
                      {job.schedule}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <MapPin size={18} className="text-[#006666]" />
                      {job.location}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="bg-gray-50 rounded-[28px] p-12 text-center border-2 border-dashed border-gray-200">
                <Search size={40} className="mx-auto text-gray-300 mb-4" />
                <p className="text-slate-500 font-bold">
                  No active jobs in your queue
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- PERFORMANCE SIDEBAR --- */}
        <aside className="space-y-6">
          <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900">Performance</h3>
              <Star className="text-amber-400 fill-amber-400" size={20} />
            </div>

            <div className="space-y-8">
              {[
                {
                  label: "Response Rate",
                  value: technicianPerformance.responseRate,
                  sub: "Last 30 days",
                },
                {
                  label: "Job Completion",
                  value: technicianPerformance.completionRate,
                  sub: "Target: 98%",
                },
                {
                  label: "Avg. Rating",
                  value: technicianPerformance.monthlyRating,
                  sub: "Top 5% of Pros",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {item.label}
                      </p>
                      <p className="text-xs font-bold text-[#006666]">
                        {item.sub}
                      </p>
                    </div>
                    <p className="text-2xl font-black text-slate-900 leading-none">
                      {item.value}
                    </p>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#006666] rounded-full"
                      style={{
                        width: item.value.includes("%") ? item.value : "95%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Support Card */}
          <div className="bg-[#006666] rounded-[32px] p-8 text-white text-center relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-bold mb-2">Need Assistance?</h4>
              <p className="text-sm text-teal-100/80 mb-6 leading-relaxed">
                Our pro support team is available 24/7 for active field jobs.
              </p>
              <button className="w-full py-3 bg-white text-[#006666] rounded-2xl font-black text-sm hover:bg-teal-50 transition-colors">
                Contact Support
              </button>
            </div>
            <div className="absolute bottom-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform">
              <Briefcase size={120} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default TechDashboard;
