import { LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, role, signOut, user } = useAuth();

  const dashboardPath = role === "technician" ? "/tech/dashboard" : "/dashboard";
  const servicesPath = isAuthenticated ? "/services" : "/login";
  const techniciansPath = isAuthenticated ? "/technicians" : "/login";
  const supportPath = isAuthenticated ? "/support" : "/login";
  const initials =
    user?.user_metadata?.full_name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.slice(0, 2)?.toUpperCase() ||
    "ET";

  const navItemClass = ({ isActive }) =>
    `rounded-xl px-4 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-[#f0fbe9] text-[#35a40b]"
        : "text-[#667085] hover:bg-[#f8fafc] hover:text-[#1d2939]"
    }`;

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#e7ecf1] bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1680px] flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#59d61c] text-white shadow-[0_16px_30px_-22px_rgba(89,214,28,0.55)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-[-0.03em] text-[#35a40b]">
                EthioTech
              </span>
              <span className="block text-xs uppercase tracking-[0.2em] text-[#98a2b3]">
                Home service platform
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 xl:flex">
            <NavLink to={servicesPath} className={navItemClass}>
              Services
            </NavLink>
            <NavLink to={techniciansPath} className={navItemClass}>
              Technicians
            </NavLink>
            <NavLink to={supportPath} className={navItemClass}>
              Support
            </NavLink>
            <NavLink to={dashboardPath} className={navItemClass}>
              {role === "technician" ? "Workboard" : "Dashboard"}
            </NavLink>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPath}
                className="hidden items-center gap-2 rounded-xl border border-[#e4e9ef] bg-white px-4 py-2 text-sm font-medium text-[#344054] transition hover:bg-[#f8fafc] md:inline-flex"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f0fbe9] text-sm font-semibold text-[#35a40b]">
                {initials}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-xl border border-[#e4e9ef] bg-white px-4 py-2 text-sm font-medium text-[#344054] transition hover:bg-[#f8fafc]"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register-technician"
                className="rounded-xl px-4 py-2 text-sm font-medium text-[#667085] transition hover:bg-[#f8fafc] hover:text-[#1d2939]"
              >
                Register technician
              </Link>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-[#667085] transition hover:bg-[#f8fafc] hover:text-[#1d2939]"
              >
                Sign in
              </Link>
              <Link
                to={servicesPath}
                className="btn-primary px-4 py-2 text-sm font-semibold"
              >
                Explore services
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
