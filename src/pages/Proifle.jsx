import { useState } from "react";
import {
  User,
  Settings,
  History,
  ShieldCheck,
  LogOut,
  Mail,
  MapPin,
  Star,
  CreditCard,
  ExternalLink,
  Camera,
} from "lucide-react";
import useAuth from "../context/useAuth"; // Assuming the AuthProvider I shared earlier
import { supabase } from "../service/supaBaseConf";

function Profile() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10B981]"></div>
      </div>
    );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* --- HEADER BANNER --- */}
      <div className="h-48 bg-[#0F172A] relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-24 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* --- LEFT SIDEBAR: USER CARD --- */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <img
                  src={
                    profile?.avatar_url ||
                    `https://ui-avatars.com/api/?name=${profile?.full_name || "User"}&background=10B981&color=fff`
                  }
                  className="w-full h-full rounded-[2rem] object-cover border-4 border-white shadow-lg"
                  alt="Profile"
                />
                <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md border border-slate-100 text-[#10B981] hover:scale-110 transition-transform">
                  <Camera size={18} />
                </button>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-[#0F172A]">
                  {profile?.full_name}
                </h2>
                <p className="text-slate-400 font-medium flex items-center justify-center gap-1">
                  <Mail size={14} /> {user?.email}
                </p>
                <div className="pt-4 flex justify-center gap-2">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${profile?.role === "technician" ? "bg-emerald-100 text-[#10B981]" : "bg-blue-100 text-blue-600"}`}
                  >
                    {profile?.role}
                  </span>
                  {profile?.technician_details?.verification_status && (
                    <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-[#0F172A]">
                    {profile?.role === "technician"
                      ? profile?.technician_details?.rating_avg || "0.0"
                      : "12"}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                    {profile?.role === "technician" ? "Rating" : "Jobs Booked"}
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-[#0F172A]">
                    {profile?.role === "technician" ? "Basic" : "Active"}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                    Status
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-bold text-sm"
              >
                <LogOut size={18} /> Logout Session
              </button>
            </div>
          </div>

          {/* --- RIGHT CONTENT: DASHBOARD --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* TABS NAVIGATION */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "history", label: "Job History", icon: History },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? "bg-[#0F172A] text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* PRO-ONLY SECTION */}
                {profile?.role === "technician" && (
                  <div className="bg-[#10B981] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2">
                        Subscription Plan
                      </h3>
                      <p className="text-emerald-50 mb-6 opacity-80">
                        Your Pro membership expires in 14 days.
                      </p>
                      <button className="bg-white text-[#10B981] px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-shadow">
                        Renew Now
                      </button>
                    </div>
                    <CreditCard
                      className="absolute right-[-20px] bottom-[-20px] text-white/10"
                      size={160}
                    />
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                      <User size={18} className="text-[#10B981]" /> About Me
                    </h4>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {profile?.technician_details?.bio ||
                        "No biography provided yet. Update your profile to help customers know you better."}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                      <MapPin size={18} className="text-[#10B981]" /> Primary
                      Service Area
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="text-sm font-bold">
                          Addis Ababa, Bole
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-[#10B981] px-2 py-0.5 rounded-md font-bold">
                          HOME
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RECENT ACTIVITY MOCK */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h4 className="font-bold text-[#0F172A]">
                      Recent Job Activity
                    </h4>
                    <button className="text-[#10B981] text-xs font-bold hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-[#10B981]">
                            <History size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#0F172A]">
                              Plumbing Repair
                            </div>
                            <div className="text-xs text-slate-400">
                              24 Oct 2023 • Paid via Telebirr
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-[#0F172A]">
                            450 ETB
                          </div>
                          <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                            Completed
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SETTINGS (MOCK) */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-[#0F172A]">
                  Account Settings
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={profile?.full_name}
                      className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Base Fee (ETB)
                    </label>
                    <input
                      type="number"
                      defaultValue={profile?.technician_details?.base_fee}
                      className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none font-medium"
                    />
                  </div>
                </div>
                <button className="bg-[#0F172A] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
