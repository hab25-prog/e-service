import { Bell, Menu, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";
import useAuth from "../../context/useAuth";

const pageMeta = {
  "/dashboard": {
    title: "Customer Dashboard",
    subtitle: "Manage bookings, payments, and support in one place.",
  },
  "/tech/dashboard": {
    title: "Technician Workboard",
    subtitle: "Track jobs, payouts, and field activity.",
  },
  "/services": {
    title: "Services",
    subtitle: "Browse categories and start a booking.",
  },
  "/technicians": {
    title: "Technicians",
    subtitle: "Compare specialists and find the right pro.",
  },
  "/support": {
    title: "Support",
    subtitle: "Coverage, payment help, and contact channels.",
  },
};

function AppHeader({ onMenuClick }) {
  const location = useLocation();
  const { role, user } = useAuth();

  const currentPage = pageMeta[location.pathname] ?? {
    title: "Workspace",
    subtitle: "Modern home service management.",
  };

  const initials =
    user?.user_metadata?.full_name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.slice(0, 2)?.toUpperCase() ||
    "ET";

  const displayName =
    user?.user_metadata?.full_name?.trim() || user?.email || "EthioTech user";

  return (
    <header className="sticky top-0 z-30 border-b border-[#e8edf2] bg-white/95 backdrop-blur">
      <div className="flex h-[70px] items-center justify-between px-3 sm:h-[76px] sm:px-4 md:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#e4e9ef] bg-[#f8fafc] text-[#223042] lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#59d61c] text-white shadow-[0_14px_28px_-18px_rgba(89,214,28,0.55)] sm:h-11 sm:w-11">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[1.1rem] font-semibold tracking-[-0.03em] text-[#3db40e] sm:text-[1.35rem]">
              Ethio-service
            </p>
            <p className="hidden truncate text-xs text-[#6c7886] sm:block md:text-sm">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden text-right md:block">
            <p className="text-sm font-semibold text-[#1e2b3b]">
              {displayName}
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-[#8b97a6]">
              {role === "technician" ? "Technician" : "Customer"}
            </p>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-[#e4e9ef] bg-white text-[#273345] transition hover:bg-[#f7fafb]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="relative grid h-10 w-10 place-items-center rounded-full bg-[#eefbe8] text-sm font-semibold text-[#3db40e] sm:h-11 sm:w-11">
            {initials}
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#59d61c]" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
