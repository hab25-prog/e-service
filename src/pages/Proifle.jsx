import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import useAuth from "../context/useAuth";
import { supabase } from "../service/supaBaseConf";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function Profile() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address_text: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address_text: profile.address_text || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  // Update Profile Mutation
  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      const { error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">
          Account Settings
        </h1>
        <p className="text-slate-500">
          Manage your personal information and service preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* --- LEFT: AVATAR CARD --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center">
            <div className="relative w-32 h-32 mx-auto mb-6 group">
              <img
                src={
                  formData.avatar_url ||
                  `https://ui-avatars.com/api/?name=${formData.full_name}&background=10B981&color=fff`
                }
                alt="Profile"
                className="w-full h-full rounded-[2.5rem] object-cover border-4 border-white shadow-xl"
              />
              <label className="absolute -bottom-2 -right-2 p-3 bg-[#0F172A] text-white rounded-2xl shadow-lg cursor-pointer hover:bg-[#10B981] transition-colors">
                <Camera size={18} />
                <input type="file" className="hidden" />
              </label>
            </div>

            <h3 className="text-xl font-bold text-[#0F172A]">
              {formData.full_name || "New User"}
            </h3>
            <p className="text-sm text-slate-400 mb-6 uppercase font-bold tracking-widest">
              {profile?.role}
            </p>

            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-[#10B981] rounded-xl text-xs font-bold">
              <ShieldCheck size={14} /> Identity Verified
            </div>
          </div>
        </div>

        {/* --- RIGHT: FORM CARD --- */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm space-y-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#10B981] transition-all outline-none font-medium"
                  />
                </div>
              </div>

              {/* Email (Disabled) */}
              <div className="space-y-2 opacity-60">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl cursor-not-allowed outline-none font-medium"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+251 9..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#10B981] transition-all outline-none font-medium"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Primary Address
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.address_text}
                    onChange={(e) =>
                      setFormData({ ...formData, address_text: e.target.value })
                    }
                    placeholder="e.g. Bole, Addis Ababa"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#10B981] transition-all outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">
                Last updated:{" "}
                {new Date(profile?.updated_at).toLocaleDateString()}
              </p>

              <div className="flex items-center gap-4">
                {isSuccess && (
                  <div className="flex items-center gap-2 text-[#10B981] font-bold text-sm animate-in fade-in slide-in-from-right-2">
                    <CheckCircle2 size={18} /> Changes Saved
                  </div>
                )}
                <button
                  disabled={mutation.isLoading}
                  className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                >
                  {mutation.isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Save Updates"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
