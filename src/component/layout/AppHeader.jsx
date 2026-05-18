import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import useAuth from "../../context/useAuth";
import ProfileAvator from "./ProfileAvator";

function AppHeader() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* --- BRAND LOGO --- */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform hover:scale-[1.02]"
        >
          <span className="text-2xl font-black tracking-tighter text-[#111827] uppercase">
            ETHIO <span className="text-[#006666]">SERVICE</span>
          </span>
        </Link>

        {/* --- ACTIONS SECTION --- */}
        <div className="flex items-center gap-5">
          {/* --- DECORATED NOTIFICATION BELL --- */}
          <button className="relative group p-2.5 rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#006666] hover:bg-white hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300">
            <Bell
              size={20}
              className="group-hover:rotate-12 transition-transform"
            />

            {/* Animated Ping Notification Dot */}
            <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#006666] border-2 border-white"></span>
            </span>
          </button>

          {/* --- PROFILE DROPDOWN --- */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-3 p-1.5 pl-3 rounded-[22px] transition-all duration-300 border ${
                isOpen
                  ? "bg-white border-gray-200 shadow-lg"
                  : "bg-white border-transparent hover:border-gray-200"
              }`}
            >
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-[#006666] uppercase tracking-widest leading-none mb-1">
                  {user?.role === "technician"
                    ? "Verified Pro"
                    : "Premium Member"}
                </p>
                <p className="text-sm font-bold text-[#111827] leading-none">
                  {user?.full_name?.split(" ")[0] || "Account"}
                </p>
              </div>

              <ProfileAvator user={user} size="sm" />

              <ChevronDown
                size={14}
                className={`text-gray-400 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* --- DROPDOWN CONTENT --- */}
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute right-0 mt-4 w-64 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 py-3 px-2 z-20 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-300">
                  <div className="px-4 py-4 mb-2 bg-gray-50/50 rounded-[24px] mx-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                      Connected as
                    </p>
                    <p className="text-sm font-bold text-[#111827] truncate">
                      {user?.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-[#F0FDF4] hover:text-[#006666] transition-all group"
                    >
                      <LayoutDashboard
                        size={18}
                        className="opacity-40 group-hover:opacity-100 transition-opacity"
                      />
                      Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-[#F0FDF4] hover:text-[#006666] transition-all group"
                    >
                      <User
                        size={18}
                        className="opacity-40 group-hover:opacity-100 transition-opacity"
                      />
                      My Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-600 hover:bg-[#F0FDF4] hover:text-[#006666] transition-all group"
                    >
                      <Settings
                        size={18}
                        className="opacity-40 group-hover:opacity-100 transition-opacity"
                      />
                      Settings
                    </Link>

                    <div className="h-px bg-gray-100 my-2 mx-4" />

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
                    >
                      <LogOut
                        size={18}
                        className="opacity-40 group-hover:opacity-100 transition-opacity"
                      />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
