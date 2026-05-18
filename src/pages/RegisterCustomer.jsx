import { useState } from "react";
import { ArrowRight, KeyRound, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import AuthSplitLayout from "../ui/AuthSplitLayout";

function RegisterCustomer() {
  const navigate = useNavigate();
  const { error, signUpCustomer } = useAuth();

  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect(() => {
  //   clearAuthError();
  // }, [clearAuthError]);

  function updateField(field, value) {
    setFormError("");
    // clearAuthError();
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const fullName = formState.fullName.trim();
    const email = formState.email.trim().toLowerCase();

    if (!fullName) {
      setFormError("Please enter your full name.");
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    if (formState.password.length < 6) {
      setFormError("Password should be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    const result = await signUpCustomer({
      email,
      password: formState.password,
      fullName,
      profilePicture: formState.profilePicture,
    });

    setIsSubmitting(false);

    if (result.success) {
      navigate("/login", {
        replace: true,
        state: {
          notice:
            "Account created successfully. Sign in with your new customer account.",
        },
      });
    }
  }

  return (
    <AuthSplitLayout
      eyebrow="Customer signup"
      title="Create a customer account that feels ready for repeat bookings."
      description="The refreshed customer onboarding keeps registration simple while still preparing you for service discovery, payment preferences, and booking follow-up."
      highlights={[
        "Save your account once and return later to manage new requests and previous bookings.",
        "Use the same workspace for technician search, support, and upcoming appointments.",
        "The new interface is designed to feel premium from signup through booking confirmation.",
      ]}
      stats={[
        { label: "Setup time", value: "2 min" },
        { label: "Cities live", value: "04" },
        { label: "Payment paths", value: "03" },
      ]}
      sideAction={
        <div className="rounded-[22px] border border-[#edf1f5] bg-[#fafbfc] p-5">
          <p className="text-sm font-semibold text-[#1d2939]">
            Registering as a technician instead?
          </p>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Technicians use a separate registration path with specialty and city
            details.
          </p>
          <Link
            to="/register-technician"
            className="btn-secondary mt-4 px-4 py-2 text-sm font-semibold"
          >
            Register as technician
          </Link>
        </div>
      }
    >
      <div>
        <p className="kicker text-[#35a40b]">Create account</p>
        <h2 className="section-title mt-3 text-[#1d2939]">
          Sign up as a customer
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#667085]">
          Once your account is created, you can browse services, request
          technicians, and keep a cleaner history of your bookings.
        </p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
          Full name
          <span className="field-shell">
            <UserRound className="h-4 w-4 text-[#35a40b]" />
            <input
              type="text"
              autoComplete="name"
              value={formState.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Abebe Kebede"
              className="w-full border-0 bg-transparent text-sm outline-none"
              required
            />
          </span>
        </label>

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
          profile picture
          <span className="field-shell">
            <UserRound className="h-4 w-4 text-[#35a40b]" />
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                updateField("profilePicture", event.target.files[0])
              }
              className="w-full border-0 bg-transparent text-sm outline-none"
            />
          </span>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
            Password
            <span className="field-shell">
              <KeyRound className="h-4 w-4 text-[#35a40b]" />
              <input
                type="password"
                autoComplete="new-password"
                value={formState.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                placeholder="Create password"
                className="w-full border-0 bg-transparent text-sm outline-none"
                required
              />
            </span>
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
            Re-enter password
            <span className="field-shell">
              <KeyRound className="h-4 w-4 text-[#35a40b]" />
              <input
                type="password"
                autoComplete="new-password"
                value={formState.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
                placeholder="Repeat password"
                className="w-full border-0 bg-transparent text-sm outline-none"
                required
              />
            </span>
          </label>
        </div>

        {formError ? (
          <div className="rounded-[22px] border border-[#ffd6d1] bg-[#fff5f3] px-4 py-3 text-sm text-[#8d3b2d]">
            {formError}
          </div>
        ) : null}

        {!formError && error ? (
          <div className="rounded-[22px] border border-[#ffd6d1] bg-[#fff5f3] px-4 py-3 text-sm text-[#8d3b2d]">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary inline-flex w-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create customer account"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-sm text-[#667085]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#35a40b]">
          Sign in here
        </Link>
      </p>
    </AuthSplitLayout>
  );
}

export default RegisterCustomer;
