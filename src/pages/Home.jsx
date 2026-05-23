import { useCategories } from "../hook/useCatagorie";
import Loader from "./Loader";
import { ArrowRight, Sparkles, MapPin } from "lucide-react";

function Home() {
  const { data, isLoading, isError } = useCategories();

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Failed to load categories.
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-16">
      {/* --- REFINED HEADER --- */}
      <div className="mb-14 text-center">
        <div className="inline-flex items-center gap-2 text-[#10B981] bg-emerald-50 px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest mb-4">
          <Sparkles size={14} /> Service Marketplace
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[#0F172A] tracking-tighter mb-4">
          Expert solutions <br className="hidden md:block" />
          for <span className="text-[#10B981]">every home need.</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">
          The premier network for verified Ethiopian technicians. Select a
          specialty to get started.
        </p>
      </div>

      {/* --- ELEGANT CARD GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((category) => (
          <div
            key={category.id}
            className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-100 shadow-sm transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-100"
          >
            {/* Background Image Layer */}
            <img
              src={
                category.icon_url ||
                "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop"
              }
              alt={category.name_en}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />

            {/* Professional Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent opacity-90" />

            {/* Top Badge */}
            <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                Available
              </span>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
                {category.name_en}
              </h2>

              <div className="flex items-center gap-2 text-slate-300 text-xs mb-6 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                <MapPin size={12} className="text-[#10B981]" />
                Top-rated pros in Addis
              </div>

              {/* Fit-to-Content Button */}
              <button className="cursor-pointer inline-flex items-center gap-3 bg-[#10B981] hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all active:scale-95 group/btn">
                Find Professionals
                <ArrowRight
                  size={16}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
