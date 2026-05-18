import { ArrowRight, BadgeCheck, Clock3, MapPin, Star } from "lucide-react";
import { supabase } from "../../service/supaBaseConf";

function TechnicianCard({ technician, onBook }) {
  // Support both supabase and mockData technician objects
  let finalImageUrl = "";
  if (technician.avatar_url) {
    // If avatar_url exists, try to get public URL from supabase
    try {
      const { data } = supabase.storage
        .from("profile_pic")
        .getPublicUrl(technician.avatar_url);
      finalImageUrl = data?.publicUrl || "";
    } catch (e) {
      finalImageUrl = "";
    }
  } else if (technician.photo) {
    // Fallback to photo field from mockData
    finalImageUrl = technician.photo;
  }

  console.log("Rendering TechnicianCard for:", technician);
  return (
    <article className="overflow-hidden rounded-3xl border border-[#e7ecf1] bg-white shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)] transition hover:-translate-y-1">
      <div className="relative">
        <img
          src={finalImageUrl}
          alt={`${technician.name || technician.full_name || "Technician"} profile`}
          className="h-56 w-full object-cover"
          loading="lazy"
        />

        <div className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#35a40b] shadow-sm">
          {technician.availability}
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#344054] shadow-sm">
          <Star className="h-3.5 w-3.5 fill-[#fdb022] text-[#fdb022]" />
          {technician?.rating ? technician.rating.toFixed(1) : "N/A"}
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#f0fbe9] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#35a40b]">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified
          </span>

          <span className="rounded-full bg-[#f8fafc] px-3 py-1.5 text-xs font-medium text-[#667085]">
            {/* {technician.priceHint} */}
          </span>
        </div>

        <div>
          <p className="text-xl font-semibold tracking-[-0.03em] text-[#1d2939]">
            {technician?.name}
          </p>
          <p className="mt-1 text-sm leading-6 text-[#667085]">
            {technician?.specialty}
          </p>
        </div>

        <div className="grid gap-2 text-sm text-[#667085]">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#35a40b]" />
            {technician?.city}
          </p>
          <p className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-[#35a40b]" />
            {technician?.responseTime}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {technician?.skills?.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[#f8fafc] px-3 py-1.5 text-[11px] font-medium text-[#667085]"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="grid gap-3 rounded-[18px] border border-[#edf1f5] bg-[#fafbfc] px-4 py-4 text-sm text-[#667085] sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
              Experience
            </p>
            <p className="mt-1 font-semibold text-[#1d2939]">
              {`${technician?.experience} years`}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
              Completed jobs
            </p>
            <p className="mt-1 font-semibold text-[#1d2939]">
              {`${technician?.completedJobs}+`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBook}
          className="btn-primary inline-flex w-full px-4 py-3 text-sm font-semibold"
        >
          Book technician
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export default TechnicianCard;
