import {
  BriefcaseBusiness,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings2,
  UserRound,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";
import { useEffect, useState } from "react";
import useSubscription from "../../hook/useSubscription";

function AppSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { role, signOut, user } = useAuth();
  const { data: subResult, isLoading: subLoading } = useSubscription(user?.id);
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const isPro = subResult?.data && subResult.data.length > 0;
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const dashboardPath =
    role === "technician" ? "/tech/dashboard" : "/dashboard";
  const primaryLinks = [
    {
      to: dashboardPath,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { to: "/services", label: "Services", icon: BriefcaseBusiness },
    { to: "/technicians", label: "Technicians", icon: UserRound },
    { to: "/support", label: "Support", icon: LifeBuoy },
    ...(role === "technician" && !isPro
      ? [{ to: "/subscription", label: "Subscription", icon: LifeBuoy }]
      : []),
  ];

  const initials =
    user?.user_metadata?.full_name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.slice(0, 2)?.toUpperCase() ||
    "ET";

  async function handleSignOut() {
    await signOut();
    onClose?.();
    navigate("/");
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#101828]/35 transition lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-[#e8edf2] bg-white px-4 py-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.25)] transition-transform duration-200 lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#98a3b1]">
            Navigation
          </p>

          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[#e6ebf0] text-[#566273] bg-white dark:bg-[#23272f] dark:text-[#cbd5e1]"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[#e6ebf0] text-[#566273] lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="space-y-1.5">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#f0fbe9] text-[#35a40b]"
                    : "text-[#364254] hover:bg-[#f7fafb] hover:text-[#1f2b3b]"
                }`
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="mt-4 space-y-1.5">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#4d5a69] transition hover:bg-[#f7fafb] hover:text-[#1f2b3b]"
            >
              <Settings2 className="h-4 w-4" />
              Settings
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#df3e35] transition hover:bg-[#fff4f2]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
