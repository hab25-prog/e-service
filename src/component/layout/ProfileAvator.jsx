import React from "react";
import { ShieldCheck } from "lucide-react";

function ProfileAvator({ user, size = "md" }) {
  // Debug log to check props
  // Map Supabase names to local variables for cleaner JSX
  const fullName = user?.full_name || user?.fullName || "User";
  const profilePic = user?.avatar_url;
  const isVerified = user?.isVerified ?? false; // Match your technician_details column
  console.log("ProfileAvator Props:", user.avatar_url);

  const sizes = {
    sm: "w-10 h-10 text-xs",
    md: "w-14 h-14 text-sm",
    lg: "w-20 h-20 text-xl",
    xl: "w-32 h-32 text-3xl",
  };

  const badgeSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="relative inline-block group">
      {/* Outer Glow/Gradient Border */}
      <div
        className={`
          ${sizes[size]} 
          rounded-full p-[3px] 
          bg-gradient-to-tr from-[#006666] to-[#B2DFDB] 
          shadow-lg transition-transform duration-300 
          group-hover:scale-105
        `}
      >
        {/* Inner Container */}
        <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center border-2 border-white">
          {profilePic ? (
            <img
              src={profilePic}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#111827] flex items-center justify-center font-bold text-white tracking-tighter">
              {initials}
            </div>
          )}
        </div>
      </div>

      {/* Verified Shield */}
      {isVerified && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
          <div
            className={`${badgeSizes[size]} bg-[#006666] rounded-full flex items-center justify-center text-white`}
          >
            <ShieldCheck className="w-[70%] h-[70%]" strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Online Status Indicator - Optional: Only show if user is online */}
      {user?.isOnline && (
        <div className="absolute top-0 right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
}

export default ProfileAvator;
