import { useMemo } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  MapPin,
  CheckCircle2,
  Sparkles,
  Users,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import Navbar from "../component/layout/Navbar";
import Footer from "../component/layout/Footer";
import { serviceCategories, serviceCoverage } from "../data/mockData";

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const heroBg =
    "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=2069&auto=format&fit=crop";

  const handleExploreClick = () => {
    navigate(isAuthenticated ? "/services" : "/login");
  };

  return (
    <main className="min-h-screen bg-white font-sans text-[#0F172A] selection:bg-[#10B981]/30">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative px-4 pt-6">
        <div
          className="mx-auto max-w-[1400px] overflow-hidden rounded-[3rem] bg-[#0F172A] text-white relative min-h-[650px] flex items-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 35%, rgba(15, 23, 42, 0.3) 100%), url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#10B981] backdrop-blur-md">
              <Sparkles size={14} /> Ethiopia's Premier Technician Network
            </div>

            <h1 className="mt-8 text-6xl font-black leading-[1.05] tracking-tight md:text-8xl">
              Quality repairs. <br />
              <span className="text-[#10B981]">Expertly handled.</span>
            </h1>

            <p className="mt-8 max-w-xl text-xl leading-relaxed text-slate-300 font-medium">
              We connect you with Addis Ababa's most skilled and verified
              professionals. Reliable, prompt, and ready to serve your home
              today.
            </p>

            <div className="mt-10 flex flex-wrap gap-5">
              <button
                onClick={handleExploreClick}
                className="flex items-center gap-3 rounded-2xl bg-[#10B981] px-10 py-5 font-bold text-white transition-all hover:bg-emerald-600 hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.6)] group"
              >
                Book a Technician
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>

              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <img
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-[#0F172A] object-cover"
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="user"
                    />
                  ))}
                </div>
                <p className="text-sm font-bold text-slate-300">
                  <span className="text-white">4.9/5</span> Rating
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 flex gap-12 border-t border-white/10 pt-10">
              <div>
                <p className="text-3xl font-black text-white">45min</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
                  Avg. Response
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">500+</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
                  Verified Pros
                </p>
              </div>
              <div>
                <p className="text-3xl font-black text-white">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
                  Satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST FEATURES --- */}
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Background Checked",
              desc: "Every professional undergoes a rigorous identity and criminal record verification.",
            },
            {
              icon: Zap,
              title: "Priority Booking",
              desc: "Book instantly and receive live updates as your technician travels to your location.",
            },
            {
              icon: Users,
              title: "Expert Support",
              desc: "Our dedicated support team is available to ensure your job is completed perfectly.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group rounded-[2rem] border border-slate-100 bg-white p-8 transition-all hover:border-[#10B981] hover:shadow-xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#10B981] transition-transform group-hover:scale-110">
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black tracking-tight text-[#0F172A]">
                Popular Services
              </h2>
              <p className="mt-4 text-slate-500">
                The most booked maintenance categories across the city this
                month.
              </p>
            </div>
            <button
              onClick={() => navigate("/services")}
              className="flex items-center gap-2 font-bold text-[#10B981] hover:gap-4 transition-all"
            >
              Explore All <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {serviceCategories.slice(0, 4).map((cat) => (
              <div
                key={cat.id}
                className="group bg-white rounded-[2.5rem] p-8 border border-white hover:border-[#10B981] shadow-sm hover:shadow-xl transition-all"
              >
                <div className="mb-6 inline-flex rounded-2xl bg-emerald-50 p-4 text-[#10B981]">
                  <cat.icon size={28} />
                </div>
                <h4 className="text-xl font-bold">{cat.title}</h4>
                <div className="mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Clock size={12} className="text-[#10B981]" /> {cat.eta}{" "}
                    Response
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-[#10B981] transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COVERAGE MAP --- */}
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-[#0F172A]">
              Now Serving Your Area
            </h2>
            <p className="text-slate-500 text-lg">
              We've expanded our network to cover all major zones in Addis
              Ababa, ensuring professional help is always close by.
            </p>
            <div className="space-y-4">
              {serviceCoverage.map((area) => (
                <div
                  key={area.city}
                  className="flex items-center justify-between rounded-3xl border border-slate-100 bg-white p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-slate-900 p-3 text-white">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">{area.city}</h4>
                      <p className="text-xs text-slate-400">
                        Active Service Zone
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#10B981]">
                    {area.eta} Arrival
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[3rem] bg-[#0F172A] p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20px] right-[-20px] h-64 w-64 bg-[#10B981]/10 rounded-full blur-3xl group-hover:bg-[#10B981]/20 transition-all"></div>
            <h3 className="text-3xl font-bold mb-6">Our Promise</h3>
            <ul className="space-y-6">
              {[
                "Verified Professionalism: Every tech is certified.",
                "Transparent Communication: Direct chat and tracking.",
                "After-Service Support: 24-hour job satisfaction window.",
                "Reliable Scheduling: On-time arrival, every time.",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <CheckCircle2
                    className="text-[#10B981] shrink-0 mt-1"
                    size={20}
                  />
                  <span className="text-slate-300 font-medium leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/signup")}
              className="mt-10 w-full py-4 bg-white text-[#0F172A] rounded-2xl font-bold hover:bg-slate-100 transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default LandingPage;
