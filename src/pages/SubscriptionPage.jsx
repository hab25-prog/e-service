import React, { useState, useEffect } from "react";
import {
  Check,
  ShieldCheck,
  Zap,
  Star,
  ArrowRight,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { toast } from "sonner";
import {
  startFreeTrial,
  saveSubscription,
  initializeSubscriptionPayment,
} from "../service/apiEndPoint";
import useSubscription from "../hook/useSubscription";

const plans = [
  {
    name: "Free Trial",
    price: "0",
    duration: "3 Months",
    features: [
      "Access to all jobs",
      "Basic profile visibility",
      "Standard support",
    ],
    buttonText: "Start 30-Day Trial",
    highlight: false,
    icon: Zap,
  },
  {
    name: "Professional",
    price: "200",
    duration: "Month",
    features: [
      "Priority job alerts",
      "Verified Pro badge",
      "Advanced analytics",
      "Featured in search",
    ],
    buttonText: "Go Professional",
    highlight: true,
    icon: Star,
  },
  {
    name: "Yearly Elite",
    price: "2000",
    duration: "Year",
    features: [
      "Everything in Pro",
      "2 months free",
      "Direct payouts",
      "Dedicated support",
    ],
    buttonText: "Choose Elite",
    highlight: false,
    icon: ShieldCheck,
  },
];

function SubscriptionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const { subscriptiondata, isLoading: subLoading } = useSubscription(user?.id);

  console.log("--- DEBUG START ---");
  console.log("Current User ID:", user?.id);
  console.log("URL Status:", status);
  console.log("Subscription from Hook:", subscriptiondata?.data);
  console.log("Pending Plan in Storage:", localStorage.getItem("pending_plan"));

  // 1. Remove the "if (subscription) navigate('/')" from the component body.
  // We will handle navigation inside useEffect instead.
  // if (!subscriptiondata.data.length == 0 && !loading) {
  //   navigate("/");
  // }
  const subscription =
    subscriptiondata?.data && subscriptiondata.data.length > 0;
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    async function handlePaymentFlow() {
      // 1. SUCCESS CHECK: If status is 'success', SAVE to DB and don't redirect yet
      if (status === "success" && user?.id) {
        const pending = JSON.parse(localStorage.getItem("pending_plan"));
        if (pending) {
          setLoading(true);
          try {
            const res = await saveSubscription({
              userId: user.id,
              planName: pending.name,
              price: pending.price,
            });
            if (res.success) {
              localStorage.removeItem("pending_plan");
              toast.success("Subscription activated!");
              navigate("/", { replace: true });
            }
          } catch (err) {
            console.error("Payment Save Error:", err);
          } finally {
            setLoading(false);
          }
        }
        return; // Stop here so we don't hit the auto-redirect below
      }

      // 2. AUTO-REDIRECT: Only move home if they are already Pro and NOT in a payment flow
      if (subscription?.data?.length > 0 && !status && !isLoading) {
        navigate("/");
      }
    }

    if (!subLoading) {
      handlePaymentFlow();
    }
  }, [user, subscription, subLoading, navigate]); // Added subscription to dependencies

  const handlePlanAction = async (plan) => {
    if (!user) return toast.error("Please login first");

    if (plan.price === "0") {
      setLoading(true);
      const res = await startFreeTrial(user.id);
      if (res.success) {
        toast.success("Trial started!");
        navigate("/");
      } else {
        toast.error("Failed: " + res.error);
      }
      setLoading(false);
    } else {
      setSelectedPlan(plan);
    }
  };

  const startChapaPayment = async () => {
    if (!selectedPlan || !user) return;
    setLoading(true);
    localStorage.setItem("pending_plan", JSON.stringify(selectedPlan));
    console.log("Starting payment for plan:", selectedPlan, "and user:", user);
    const result = await initializeSubscriptionPayment({
      userId: user.id,
      email: user.email,
      amount: selectedPlan.price,
      planName: selectedPlan.name,
    });
    console.log("Payment initialization result:", result);
    if (result.success && result.checkoutUrl) {
      console.log("Redirecting to checkout URL:", result.checkoutUrl);
      window.location.href = result.checkoutUrl;
    } else {
      toast.error("Payment failed: " + result.error);
      setLoading(false);
    }
  };

  if (loading || subLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-[#006666] animate-spin" />
      </div>
    );
  }
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#006666] animate-spin mx-auto mb-4" />
          <p className="text-[#111827] font-bold text-lg">
            Securing your connection...
          </p>
          <p className="text-gray-400 text-sm">
            Please do not refresh the page.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-20 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-[#E0F2F1] text-[#006666] text-[10px] font-black rounded-lg uppercase tracking-widest">
            Partner with Moya Home
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#111827] tracking-tight">
            Grow your business <br />
            <span className="text-[#006666]">as a Verified Pro.</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Join the most trusted network of home service professionals in
            Ethiopia.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[40px] p-8 transition-all duration-500 ${
                plan.highlight
                  ? "bg-[#111827] text-white shadow-2xl scale-105 z-10 py-12"
                  : "bg-white border border-gray-100 text-[#111827] hover:shadow-xl"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#006666] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                  plan.highlight ? "bg-[#006666]" : "bg-[#F3F4F6]"
                }`}
              >
                <plan.icon
                  className={`w-6 h-6 ${plan.highlight ? "text-white" : "text-[#006666]"}`}
                />
              </div>

              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black">{plan.price}</span>
                <span
                  className={`text-sm font-bold ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}
                >
                  ETB / {plan.duration}
                </span>
              </div>

              <ul className="space-y-4 flex-1 mb-10">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-sm font-medium"
                  >
                    <Check
                      className={`w-5 h-5 shrink-0 ${plan.highlight ? "text-[#006666]" : "text-[#006666]"}`}
                    />
                    <span
                      className={
                        plan.highlight ? "text-gray-300" : "text-gray-600"
                      }
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanAction(plan)}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-white text-[#111827] hover:bg-[#E0F2F1]"
                    : "bg-[#111827] text-white hover:bg-black"
                }`}
              >
                {plan.buttonText} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Local Payment Drawer */}
        {selectedPlan && selectedPlan.price !== "0" && (
          <div className="mt-16 bg-[#111827] rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#006666] opacity-10 skew-x-12 transform origin-top-right"></div>

            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="max-w-md text-center md:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
                  <CreditCard className="text-[#006666]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#B2DFDB]">
                    Secure Checkout
                  </span>
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Complete your {selectedPlan.name} payment
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We process payments through Chapa. You can use Telebirr, CBE
                  Birr, M-Pesa, or local bank transfers.
                </p>
              </div>

              <div className="w-full max-w-sm">
                <button
                  onClick={startChapaPayment}
                  className="w-full bg-white text-[#111827] p-6 rounded-[28px] hover:bg-gray-50 transition-all group flex flex-col items-center gap-4"
                >
                  <div className="flex justify-center gap-3">
                    <div className="h-8 w-12 bg-[#00adef] rounded-lg flex items-center justify-center text-[9px] text-white font-black">
                      TELE
                    </div>
                    <div className="h-8 w-12 bg-[#532e8d] rounded-lg flex items-center justify-center text-[9px] text-white font-black">
                      CBE
                    </div>
                    <div className="h-8 w-12 bg-[#e61c27] rounded-lg flex items-center justify-center text-[9px] text-white font-black">
                      MPESA
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-black text-lg">
                      Pay {selectedPlan.price} ETB Now
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                      Instant Activation
                    </p>
                  </div>
                </button>
                <p className="text-center mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                  Transaction secured by Chapa Financial Technologies
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionPage;
