import {
  Clock3,
  LifeBuoy,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  serviceCoverage,
  supportChannels,
  supportFaqs,
} from "../data/mockData";

function Support() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      {/* --- PREMIUM HEADER --- */}
      <section className="relative mt-4 mx-4 md:mx-0 overflow-hidden rounded-[2.5rem] bg-[#0F172A] text-white">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] bg-[#10B981]/10 blur-[100px] rounded-full" />

        <div className="relative z-10 px-8 py-12 md:px-12 md:py-16 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#10B981] text-[10px] font-black tracking-widest uppercase mb-6">
            <Sparkles size={14} /> Help & Reliability Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
            How can we <span className="text-[#10B981]">support you</span>{" "}
            today?
          </h1>
          <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-2xl font-medium">
            Find answers to your questions, explore our service coverage across
            Addis Ababa, and connect with our verified support team through
            multiple dedicated channels.
          </p>
        </div>
      </section>

      {/* --- SUPPORT CHANNELS --- */}
      <div className="grid gap-6 md:grid-cols-3 px-4 md:px-0">
        {supportChannels.map((channel, index) => (
          <article
            key={channel.title}
            className="group bg-white rounded-[2rem] p-8 border border-slate-100 hover:border-[#10B981] transition-all shadow-sm hover:shadow-xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center transition-transform group-hover:scale-110">
              {index === 0 ? (
                <Phone size={24} />
              ) : index === 1 ? (
                <MessageSquareText size={24} />
              ) : (
                <LifeBuoy size={24} />
              )}
            </div>
            <h3 className="mt-6 text-xl font-bold text-[#0F172A]">
              {channel.title}
            </h3>
            <p className="mt-2 text-sm font-black text-[#10B981] uppercase tracking-widest">
              {channel.value}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 font-medium">
              {channel.detail}
            </p>
          </article>
        ))}
      </div>

      {/* --- COVERAGE & PROMISE SECTION --- */}
      <div className="grid gap-8 lg:grid-cols-5 px-4 md:px-0">
        {/* COVERAGE MAP CARD */}
        <article className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em]">
                Live Zones
              </p>
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                Active Service Coverage
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {serviceCoverage.map((area) => (
              <div
                key={area.city}
                className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-[#0F172A]">
                    {area.city}
                  </h4>
                  <span className="px-3 py-1 bg-emerald-100 text-[#10B981] text-[10px] font-black rounded-full uppercase tracking-widest">
                    {area.eta} Arrival
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {area.zones.map((zone) => (
                    <span
                      key={zone}
                      className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-500"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
                <p className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Clock3 size={14} className="text-[#10B981]" />
                  {area.supportHours} Support Window
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* SERVICE PROMISE CARD (Replaced Payment Section) */}
        <article className="lg:col-span-2 bg-[#0F172A] rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute bottom-[-20px] right-[-20px] opacity-10">
            <ShieldCheck size={200} />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#10B981] text-white flex items-center justify-center mb-8 shadow-lg">
              <ShieldCheck size={22} />
            </div>
            <h2 className="text-3xl font-black tracking-tight leading-tight mb-6">
              Our Professional <br />
              Service Promise
            </h2>
            <ul className="space-y-6">
              {[
                {
                  t: "Verified Experts",
                  d: "Every technician undergoes rigorous skill certification.",
                },
                {
                  t: "Quality Guarantee",
                  d: "A 24-hour satisfaction window for every job completed.",
                },
                {
                  t: "Transparent Booking",
                  d: "No hidden fees. You always know who is coming.",
                },
                {
                  t: "Reliable Arrival",
                  d: "Prompt response times across all active Addis zones.",
                },
              ].map((promise, i) => (
                <li key={i} className="flex gap-4">
                  <CheckCircle2
                    size={20}
                    className="text-[#10B981] shrink-0 mt-1"
                  />
                  <div>
                    <h5 className="font-bold text-sm">{promise.t}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">
                      {promise.d}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      {/* --- FAQ SECTION --- */}
      <article className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm px-4 md:px-0">
        <div className="max-w-3xl mb-12">
          <p className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-4">
            Resources
          </p>
          <h2 className="text-3xl font-black text-[#0F172A] tracking-tight mb-4">
            Common Questions
          </h2>
          <p className="text-slate-500 font-medium">
            Quick answers to the most common concerns regarding bookings and
            technician verification.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {supportFaqs.map((faq) => (
            <div
              key={faq.question}
              className="p-6 rounded-3xl bg-slate-50/50 border border-slate-50 hover:border-emerald-100 transition-all"
            >
              <p className="text-lg font-bold text-[#0F172A] tracking-tight">
                {faq.question}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 font-medium">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export default Support;
