import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth";

function Footer() {
  const { isAuthenticated, role } = useAuth();
  const dashboardPath = role === "technician" ? "/tech/dashboard" : "/dashboard";
  const primaryPath = isAuthenticated ? dashboardPath : "/signup";
  const secondaryPath = isAuthenticated ? "/services" : "/login";
  const techniciansPath = isAuthenticated ? "/technicians" : "/login";
  const supportPath = isAuthenticated ? "/support" : "/login";
  const dashboardEntryPath = isAuthenticated ? dashboardPath : "/login";

  return (
    <footer className="border-t border-[#e7ecf1] bg-white px-4 py-10">
      <div className="mx-auto max-w-[1680px] space-y-8">
        <div className="rounded-[28px] border border-[#e7ecf1] bg-[#f8fbf6] p-6 md:flex md:items-center md:justify-between md:gap-6">
          <div className="max-w-2xl">
            <p className="kicker text-[#35a40b]">Stay in control</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1d2939]">
              A cleaner service experience for customers and technicians.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#667085]">
              Keep browsing services, manage bookings, or open your workspace
              with the same light, simple dashboard personality across the app.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 md:mt-0">
            <Link to={secondaryPath} className="btn-secondary px-5 py-3 text-sm font-semibold">
              Explore services
            </Link>
            <Link to={primaryPath} className="btn-primary px-5 py-3 text-sm font-semibold">
              {isAuthenticated ? "Open workspace" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 rounded-[28px] border border-[#e7ecf1] bg-white p-6 md:grid-cols-[1.35fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#59d61c] text-white shadow-[0_16px_30px_-22px_rgba(89,214,28,0.55)]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="text-2xl font-semibold tracking-[-0.04em] text-[#35a40b]">
                  EthioTech
                </p>
                <p className="text-xs uppercase tracking-[0.22em] text-[#98a2b3]">
                  Home service platform
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-[#667085]">
              Designed for Ethiopian households and local technicians who want
              a simpler, more dependable booking and work-management experience.
            </p>
          </div>

          <div className="space-y-3 text-sm text-[#667085]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#98a2b3]">
              Explore
            </p>
            <Link to={secondaryPath} className="block transition hover:text-[#35a40b]">
              Browse services
            </Link>
            <Link to={techniciansPath} className="block transition hover:text-[#35a40b]">
              Meet technicians
            </Link>
            <Link to={supportPath} className="block transition hover:text-[#35a40b]">
              Support and coverage
            </Link>
            <Link to={dashboardEntryPath} className="block transition hover:text-[#35a40b]">
              Workspace dashboard
            </Link>
          </div>

          <div className="space-y-3 text-sm text-[#667085]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#98a2b3]">
              Access
            </p>
            <Link to="/register-technician" className="block transition hover:text-[#35a40b]">
              Register as technician
            </Link>
            <Link to="/login" className="block transition hover:text-[#35a40b]">
              Sign in
            </Link>
            <Link to="/signup" className="block transition hover:text-[#35a40b]">
              Create customer account
            </Link>
            <p className="pt-2">Support line: +251 900 000 000</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-xs text-[#98a2b3] md:flex-row md:items-center md:justify-between">
          <p>{`Copyright ${new Date().getFullYear()} EthioTech. All rights reserved.`}</p>
          <p>Verified experts, transparent pricing, and cleaner follow-up.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
