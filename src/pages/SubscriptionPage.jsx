import React, { useState } from "react";
import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Free Trial",
    price: "0",
    duration: "3 Months",
    features: ["Access to all jobs", "Basic profile", "Standard support"],
    buttonText: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Monthly",
    price: "200", // Example ETB
    duration: "Month",
    features: ["Priority job alerts", "Verified badge", "Advanced analytics"],
    buttonText: "Choose Monthly",
    highlight: true,
  },
  {
    name: "Yearly",
    price: "2000",
    duration: "Year",
    features: ["2 months free", "Featured technician status", "Direct payouts"],
    buttonText: "Choose Yearly",
    highlight: false,
  },
];

function SubscriptionPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSkip = () => {
    navigate("/tech/onboarding"); // Continue to profile setup
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#1d2939]">
            Choose your plan
          </h1>
          <p className="mt-4 text-[#667085]">
            Select a plan to start receiving job requests. You can skip this and
            decide later.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.highlight
                  ? "border-[#35a40b] bg-white shadow-xl scale-105 z-10"
                  : "border-[#edf1f5] bg-white"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#35a40b] px-4 py-1 text-xs font-bold text-white">
                  POPULAR
                </span>
              )}
              <h3 className="text-xl font-bold text-[#1d2939]">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold tracking-tight text-[#1d2939]">
                  {plan.price} ETB
                </span>
                <span className="ml-1 text-sm text-[#667085]">
                  /{plan.duration}
                </span>
              </div>

              <ul className="mt-8 space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center text-sm text-[#475467]"
                  >
                    <Check className="mr-3 h-5 w-5 text-[#35a40b]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlan(plan)}
                className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "bg-[#35a40b] text-white hover:bg-[#2d8a09]"
                    : "bg-[#f2f4f7] text-[#1d2939] hover:bg-[#eaecf0]"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Selection (Only shows if a paid plan is selected) */}
        {selectedPlan && selectedPlan.price !== "0" && (
          <div className="mt-12 rounded-2xl border border-[#edf1f5] bg-white p-8 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-lg font-bold text-[#1d2939]">
              Pay with Local Options
            </h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button className="flex items-center justify-between rounded-xl border border-[#edf1f5] p-4 hover:border-[#35a40b]">
                <span className="font-semibold text-[#1d2939]">Telebirr</span>
                <div className="h-8 w-12 bg-[#00adef] rounded flex items-center justify-center text-[10px] text-white font-bold">
                  tele
                </div>
              </button>
              <button className="flex items-center justify-between rounded-xl border border-[#edf1f5] p-4 hover:border-[#35a40b]">
                <span className="font-semibold text-[#1d2939]">CBE Birr</span>
                <div className="h-8 w-12 bg-[#532e8d] rounded flex items-center justify-center text-[10px] text-white font-bold">
                  CBE
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <button
            onClick={handleSkip}
            className="text-sm font-medium text-[#667085] hover:text-[#1d2939] underline underline-offset-4"
          >
            I'll do this later, skip to onboarding
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
