import { useEffect, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  KeyRound,
  Phone,
  UserRound,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import AuthSplitLayout from "../ui/AuthSplitLayout";
import { useCategories } from "../hook/useCatagorie";

function RegisterTechnician() {
  const navigate = useNavigate();
  const { clearAuthError, error, signUpTechnician } = useAuth();

  // React Query hook to get categories from DB
  const { data: categories, isLoading: isCatsLoading } = useCategories();

  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialty: "", // Holds the string name (e.g., "Plumbing")
    catagorie_id: "", // Holds the integer ID (e.g., 1)
    city: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    clearAuthError();
  }, [clearAuthError]);

  function updateField(field, value) {
    setFormError("");
    clearAuthError();
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // Handle category selection
  function handleCategoryChange(event) {
    const selectedId = event.target.value;
    // Find the category object to extract the English name for the specialty field
    const selectedCat = categories?.find((c) => String(c.id) === selectedId);

    setFormState((current) => ({
      ...current,
      catagorie_id: selectedId,
      specialty: selectedCat ? selectedCat.name_en : "",
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const fullName = formState.fullName.trim();
    const email = formState.email.trim().toLowerCase();
    const phone = formState.phone.trim();
    const specialty = formState.specialty;
    const catagorie_id = formState.catagorie_id;
    const city = formState.city.trim();

    if (!fullName || !phone || !catagorie_id || !city) {
      setFormError("Please complete all technician profile fields.");
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

    const result = await signUpTechnician({
      email,
      password: formState.password,
      fullName,
      phone,
      specialty, // Passed for metadata/display
      catagorie_id: parseInt(catagorie_id), // Passed as integer for DB link
      city,
      profilePicture: formState.profilePicture,
    });

    setIsSubmitting(false);

    if (result.success) {
      navigate("/subscription", {
        replace: true,
        state: {
          notice:
            "Technician request submitted. Complete onboarding to access your dashboard.",
        },
      });
    }
  }

  return (
    <AuthSplitLayout
      eyebrow="Technician registration"
      title="Send a technician request with a more polished onboarding flow."
      description="The new technician signup keeps the process clear while still collecting the specialty, city, and contact details required for approval and dashboard access."
      highlights={[
        "Use the same email you plan to sign in with after approval.",
        "Your specialty and city information help shape where you appear in the platform.",
        "Once approved, you will land in the technician workboard automatically.",
      ]}
      stats={[
        { label: "Approval ready", value: "Profile" },
        { label: "Cities live", value: "04" },
        { label: "Field focus", value: "Jobs" },
      ]}
      sideAction={
        <div className="rounded-[22px] border border-[#edf1f5] bg-[#fafbfc] p-5">
          <p className="text-sm font-semibold text-[#1d2939]">
            Just booking services for your home?
          </p>
          <p className="mt-2 text-sm leading-6 text-[#667085]">
            Customers have a dedicated signup path with a simpler account setup.
          </p>
          <Link
            to="/signup"
            className="btn-secondary mt-4 px-4 py-2 text-sm font-semibold"
          >
            Customer signup
          </Link>
        </div>
      }
    >
      <div>
        <p className="kicker text-[#35a40b]">Register technician</p>
        <h2 className="section-title mt-3 text-[#1d2939]">
          Fill in your technician profile
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#667085]">
          Share your details once. After approval, the upgraded workspace will
          give you quick access to queue status, payouts, and field activity.
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
              placeholder="technician@example.com"
              className="w-full border-0 bg-transparent text-sm outline-none"
              required
            />
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
            Phone
            <span className="field-shell">
              <Phone className="h-4 w-4 text-[#35a40b]" />
              <input
                type="text"
                autoComplete="tel"
                value={formState.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+2519..."
                className="w-full border-0 bg-transparent text-sm outline-none"
                required
              />
            </span>
          </label>

          <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
            City
            <span className="field-shell">
              <BriefcaseBusiness className="h-4 w-4 text-[#35a40b]" />
              <input
                type="text"
                value={formState.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder="Addis Ababa"
                className="w-full border-0 bg-transparent text-sm outline-none"
                required
              />
            </span>
          </label>
        </div>

        <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
          Specialty
          <span className="field-shell">
            <BriefcaseBusiness className="h-4 w-4 text-[#35a40b]" />
            <select
              value={formState.catagorie_id}
              onChange={handleCategoryChange}
              className="w-full border-0 bg-transparent text-sm outline-none"
              required
              disabled={isCatsLoading}
            >
              <option value="">
                {isCatsLoading
                  ? "Loading specialties..."
                  : "Select your specialty"}
              </option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_en} {cat.name_am ? `/ ${cat.name_am}` : ""}
                </option>
              ))}
            </select>
            {isCatsLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-[#35a40b]" />
            )}
          </span>
        </label>

        <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
          Profile picture
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
          disabled={isSubmitting || isCatsLoading}
          className="btn-primary inline-flex w-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting request..." : "Submit technician request"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-sm text-[#667085]">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-[#35a40b]">
          Sign in here
        </Link>
      </p>
    </AuthSplitLayout>
  );
}

export default RegisterTechnician;
