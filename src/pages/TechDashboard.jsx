import { useMemo } from "react";
import {
  BadgeDollarSign,
  Clock3,
  MapPin,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";
import useAuth from "../context/useAuth";
import {
  paymentOptions,
  payoutHistory,
  serviceCoverage,
  technicianPerformance,
  technicianQueue,
} from "../data/mockData";
import useBookings from "../hook/useBookings";
import useJobStatuses from "../hook/useJobStatuses";
import PaymentMethodBadge from "../ui/PaymentMethodBadge";

function TechDashboard() {
  const { user } = useAuth();
  console.log("Authenticated user:", user);
  const technicianName = user?.full_name?.trim() ?? "";
  const { data: liveBookings = [] } = useBookings(
    { technicianName },
    { enabled: Boolean(technicianName) },
  );
  const {
    data: jobStatuses = [],
    error: jobStatusError,
    isLoading: isLoadingJobStatuses,
  } = useJobStatuses();

  const queue = useMemo(() => {
    if (!liveBookings.length) {
      return technicianQueue;
    }

    return liveBookings.map((booking) => ({
      id: booking.bookingId ?? booking.id,
      customer: booking.ownerEmail || "Customer",
      service: booking.service,
      schedule: booking.dateLabel,
      location: booking.address,
      status: booking.status,
      budget: booking.price,
    }));
  }, [liveBookings]);

  const liveStatusCards = useMemo(() => {
    const statusCounts = jobStatuses.reduce((accumulator, job) => {
      const status = job?.status?.trim() || "Unknown";
      accumulator[status] = (accumulator[status] ?? 0) + 1;
      return accumulator;
    }, {});

    const orderedStatuses = ["Scheduled", "Confirmed", "In progress"];
    const cards = orderedStatuses.map((status) => ({
      label: status,
      value: statusCounts[status] ?? 0,
    }));

    const remainingStatuses = Object.entries(statusCounts)
      .filter(([status]) => !orderedStatuses.includes(status))
      .map(([status, value]) => ({
        label: status,
        value,
      }));

    return [...cards, ...remainingStatuses].slice(0, 4);
  }, [jobStatuses]);

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[2rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
              {`Welcome back, ${technicianName || technicianPerformance.name}!`}
            </p>
            <p className="mt-2 text-base text-[#667085]">
              Stay on top of active jobs, earnings, and customer demand from one
              cleaner workboard.
            </p>
          </div>

          <div className="rounded-[22px] border border-[#edf2f7] bg-[#f8fbf6] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c8a99]">
              This week
            </p>
            <p className="mt-2 text-sm font-medium text-[#35a40b]">
              {technicianPerformance.weeklyEarnings}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-[18px] border border-[#e4e9ef] bg-white px-4 py-3 text-sm text-[#667085] shadow-[0_12px_30px_-28px_rgba(15,23,42,0.16)]">
        <Search className="h-4 w-4 text-[#667085]" />
        <p>Track job flow, payout trends, and service coverage.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-[1.7rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
                  Live Job Status
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Synced directly from the jobs table.
                </p>
              </div>
              <p className="text-sm text-[#98a2b3]">jobs.select("status")</p>
            </div>

            {jobStatusError ? (
              <div className="mt-5 rounded-[22px] border border-[#ffd6d1] bg-[#fff5f3] px-4 py-3 text-sm text-[#8d3b2d]">
                {jobStatusError.message}
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {isLoadingJobStatuses
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-[20px] border border-[#edf1f5] bg-[#fafbfc] p-4"
                    >
                      <div className="h-3 w-20 rounded-full bg-[#e4eaf0]" />
                      <div className="mt-3 h-8 w-12 rounded-full bg-[#e4eaf0]" />
                    </div>
                  ))
                : liveStatusCards.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-[#edf1f5] bg-[#fafbfc] p-4"
                    >
                      <p className="text-sm text-[#667085]">{item.label}</p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#1d2939]">
                        {String(item.value).padStart(2, "0")}
                      </p>
                    </div>
                  ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-[1.7rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
                  My Queue
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Today’s work and the next-up jobs in your pipeline.
                </p>
              </div>
              <p className="text-sm text-[#98a2b3]">{`${queue.length} jobs`}</p>
            </div>

            <div className="mt-6 space-y-4">
              {queue.map((job) => (
                <div
                  key={job.id}
                  className="rounded-[22px] border border-[#edf1f5] bg-[#fafbfc] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-semibold tracking-[-0.03em] text-[#1d2939]">
                        {job.service}
                      </p>
                      <p className="mt-2 text-sm text-[#667085]">
                        {`${job.customer} • ${job.id}`}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        job.status === "In progress"
                          ? "bg-[#fff4e8] text-[#b54708]"
                          : job.status === "Confirmed" ||
                              job.status === "Scheduled"
                            ? "bg-[#eefbe8] text-[#35a40b]"
                            : "bg-[#eef2f6] text-[#475467]"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-[#667085] md:grid-cols-3">
                    <p className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-[#35a40b]" />
                      {job.schedule}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#35a40b]" />
                      {job.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <BadgeDollarSign className="h-4 w-4 text-[#35a40b]" />
                      {job.budget}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <h3 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
              Performance
            </h3>

            <div className="mt-5 space-y-4">
              {[
                {
                  label: "Response rate",
                  value: technicianPerformance.responseRate,
                },
                {
                  label: "Completion rate",
                  value: technicianPerformance.completionRate,
                },
                {
                  label: "Monthly rating",
                  value: technicianPerformance.monthlyRating,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[18px] border border-[#edf1f5] bg-[#fafbfc] px-4 py-3"
                >
                  <p className="text-sm text-[#667085]">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#1d2939]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </article>
          {/* 
          <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <h3 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
              Payout Methods
            </h3>

            <div className="mt-5 space-y-3">
              {paymentOptions.map((option, index) => (
                <PaymentMethodBadge
                  key={option.name}
                  name={option.name}
                  tone={option.tone}
                  selected={index === 0}
                />
              ))}
            </div>
          </article> */}

          {/* <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <h3 className="flex items-center gap-2 text-[1.5rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
              <TrendingUp className="h-5 w-5 text-[#35a40b]" />
              Earnings Trend
            </h3>

            <div className="mt-5 space-y-4">
              {payoutHistory.map((entry) => (
                <div key={entry.day}>
                  <div className="mb-2 flex items-center justify-between text-sm text-[#667085]">
                    <span>{entry.day}</span>
                    <span>{entry.amount}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#edf1f5]">
                    <div
                      className="h-2.5 rounded-full bg-[#59d61c]"
                      style={{
                        width: `${Math.min(
                          (Number(entry.amount.replace(/\D/g, "")) / 4000) *
                            100,
                          100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article> */}

          {/* <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <h3 className="flex items-center gap-2 text-[1.5rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
              <Wallet className="h-5 w-5 text-[#35a40b]" />
              Coverage
            </h3>

            <div className="mt-5 space-y-3">
              {serviceCoverage.map((area) => (
                <div
                  key={area.city}
                  className="rounded-[18px] border border-[#edf1f5] bg-[#fafbfc] px-4 py-3"
                >
                  <p className="text-sm font-semibold text-[#1d2939]">
                    {area.city}
                  </p>
                  <p className="mt-1 text-sm text-[#667085]">{area.eta}</p>
                </div>
              ))}
            </div>
          </article> */}
        </div>
      </div>
    </section>
  );
}

export default TechDashboard;
