import { useEffect, useState } from "react";
import { ArrowRight, KeyRound, UserRound } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import AuthSplitLayout from "../ui/AuthSplitLayout";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearAuthError, error, isAuthenticated, role, signIn } = useAuth();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notice = location.state?.notice;

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fallbackPath =
      role === "technician" ? "/tech/dashboard" : "/dashboard";
    const redirectPath = location.state?.from?.pathname || fallbackPath;
    navigate(redirectPath, { replace: true });
  }, [isAuthenticated, location.state, navigate, role]);

  function updateField(field, value) {
    clearAuthError();
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    await signIn(formState.email, formState.password);
    setIsSubmitting(false);
  }

  return (
    <AuthSplitLayout
      eyebrow="Sign in"
      title="Access your customer or technician workspace."
      description="Jump back into bookings, support, or field operations with a cleaner sign-in experience built around the same premium visual system as the rest of the app."
      highlights={[
        "Customers can track active bookings, payment choices, and service history in one place.",
        "Technicians can move directly into their workboard after approval with the correct role-based view.",
        "Your existing Supabase account still powers authentication behind the refreshed UI.",
      ]}
      stats={[
        { label: "Secure flow", value: "24/7" },
        { label: "Cities live", value: "04" },
        { label: "Verified pros", value: "120+" },
      ]}
      sideAction={
        <div className="rounded-[22px] border border-[#edf1f5] bg-[#fafbfc] p-5">
          <p className="text-sm font-semibold text-[#1d2939]">Need a new account?</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/signup" className="btn-secondary px-4 py-2 text-sm font-semibold">
              Customer signup
            </Link>
            <Link
              to="/register-technician"
              className="btn-secondary px-4 py-2 text-sm font-semibold"
            >
              Technician signup
            </Link>
          </div>
        </div>
      }
    >
      <div>
        <p className="kicker text-[#35a40b]">Welcome back</p>
        <h2 className="section-title mt-3 text-[#1d2939]">Sign in to continue</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#667085]">
          Use the email and password attached to your EthioTech account. If you
          were redirected here from a protected page, we will send you back
          after a successful sign-in.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
          Email address
          <span className="field-shell">
            <UserRound className="h-4 w-4 text-[#35a40b]" />
            <input
              type="email"
              autoComplete="email"
              value={formState.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@example.com"
              className="w-full border-0 bg-transparent text-sm outline-none"
              required
            />
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
          Password
          <span className="field-shell">
            <KeyRound className="h-4 w-4 text-[#35a40b]" />
            <input
              type="password"
              autoComplete="current-password"
              value={formState.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Enter your password"
              className="w-full border-0 bg-transparent text-sm outline-none"
              required
            />
          </span>
        </label>

        {error ? (
          <div className="rounded-[22px] border border-[#ffd6d1] bg-[#fff5f3] px-4 py-3 text-sm text-[#8d3b2d]">
            {error}
          </div>
        ) : null}

        {!error && notice ? (
          <div className="rounded-[22px] border border-[#ccefe0] bg-[#f2fbf6] px-4 py-3 text-sm text-[#206346]">
            {notice}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary inline-flex w-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-sm text-[#667085]">
        Looking around first?{" "}
        <Link to="/services" className="font-semibold text-[#35a40b]">
          Browse services
        </Link>
      </p>
    </AuthSplitLayout>
  );
}

export default Login;
