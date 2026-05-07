import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import heroImg from "../assets/hero.png";
import Footer from "../component/layout/Footer";
import Navbar from "../component/layout/Navbar";
import {
  paymentOptions,
  serviceCategories,
  serviceCoverage,
  supportChannels,
  trustHighlights,
} from "../data/mockData";

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleExploreClick = () => {
    navigate(isAuthenticated ? "/services" : "/login");
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="px-4 pb-10 pt-6 md:pb-14">
        <div className="mx-auto max-w-[1680px] space-y-6 xl:space-y-8">
          <section className="surface-panel-dark relative overflow-hidden rounded-[44px] px-6 py-7 text-white md:px-8 md:py-10 xl:px-10 xl:py-12">
            <div className="pointer-events-none absolute left-10 top-10 h-40 w-40 rounded-full bg-[#85e5d8]/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-[#f8c98f]/20 blur-3xl" />

            <div className="relative grid gap-8 xl:grid-cols-[1.06fr_0.94fr] xl:gap-10">
              <div className="max-w-3xl">
                <span className="kicker text-[#c8f2ec]">
                  Built for Ethiopian households
                </span>
                <h1 className="page-title mt-5 text-white">
                  Book trusted home services in a workspace that finally feels premium.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[#d5ebf3] md:text-lg">
                  EthioTech helps customers move from search to confirmed
                  booking with clearer pricing, verified technicians, Ethiopian
                  payment choices, and a support flow that feels modern from the
                  first screen.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleExploreClick}
                    className="btn-primary px-6 py-3 text-sm font-semibold md:text-base"
                  >
                    {isAuthenticated ? "Enter the app" : "Sign in to continue"}
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <Link
                    to={isAuthenticated ? "/dashboard" : "/signup"}
                    className="btn-secondary px-6 py-3 text-sm font-semibold md:text-base"
                  >
                    {isAuthenticated ? "Open dashboard" : "Create account"}
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {[
                    "Verified technicians",
                    "Transparent pricing",
                    "Support built in",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-medium text-[#d8edf4]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    { value: "120+", label: "Active technicians" },
                    { value: "4.8/5", label: "Average satisfaction" },
                    { value: "35-60 min", label: "Fastest response window" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur-sm"
                    >
                      <p className="text-3xl font-semibold tracking-[-0.05em] text-white">
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm text-[#cbe2eb]">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center xl:justify-end">
                <div className="relative w-full max-w-[42rem]">
                  <div className="surface-panel absolute -left-3 top-6 z-10 hidden w-52 rounded-[28px] p-4 text-[#163047] md:block float-slow">
                    <p className="kicker text-[#0d8b83]">Arrival speed</p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
                      45 min
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#647886]">
                      Strongest same-day matching currently in Addis Ababa.
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-[34px] border border-white/15 bg-white/10 p-3 shadow-[0_40px_110px_-56px_rgba(5,18,31,0.88)] backdrop-blur-md">
                    <img
                      src={heroImg}
                      alt="Technician smiling while carrying tools"
                      className="h-full w-full rounded-[28px] object-cover"
                    />
                  </div>

                  <div className="surface-card absolute -bottom-6 right-0 z-10 w-full max-w-[18rem] rounded-[30px] p-5 text-[#163047] float-slow float-delay">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="kicker text-[#0d8b83]">Payments</p>
                        <p className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                          Local checkout options
                        </p>
                      </div>
                      <Wallet className="h-5 w-5 text-[#0d8b83]" />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {paymentOptions.map((option) => (
                        <span
                          key={option.name}
                          className="rounded-full bg-[#eef7ff] px-3 py-1.5 text-[11px] font-semibold text-[#365c78]"
                        >
                          {option.name}
                        </span>
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#617584]">
                      Confirm how you want to pay before the technician even
                      arrives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Verified professionals",
                text: trustHighlights[0].text,
              },
              {
                icon: Wallet,
                title: "Transparent pricing",
                text: trustHighlights[1].text,
              },
              {
                icon: CheckCircle2,
                title: "Fast matching",
                text: trustHighlights[2].text,
              },
            ].map((item) => (
              <article key={item.title} className="surface-card rounded-[32px] p-6">
                <div className="grid h-14 w-14 place-items-center rounded-[1.2rem] bg-[#e9f7f3] text-[#0d8b83]">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-xl font-semibold tracking-[-0.04em] text-[#163047]">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-[#607483]">
                  {item.text}
                </p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
            <article className="surface-panel rounded-[38px] p-6 md:p-7">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="kicker text-[#0d8b83]">Popular services</p>
                  <h2 className="section-title mt-3 text-[#163047]">
                    The categories customers open first
                  </h2>
                </div>

                <Link
                  to={isAuthenticated ? "/services" : "/login"}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0d8b83]"
                >
                  {isAuthenticated ? "Open app services" : "Sign in to explore"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {serviceCategories.slice(0, 4).map((service) => (
                  <div
                    key={service.id}
                    className={`rounded-[30px] border border-white/70 bg-gradient-to-br ${service.accent} p-5`}
                  >
                    <service.icon className="h-5 w-5 text-[#0d8b83]" />
                    <p className="mt-4 text-lg font-semibold tracking-[-0.03em] text-[#163047]">
                      {service.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#617584]">
                      {service.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-[#4f6677]">
                      <span>{service.eta}</span>
                      <span className="rounded-full bg-white/80 px-3 py-1.5 text-[#163047]">
                        {service.startingPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-panel-dark rounded-[38px] p-6 text-white md:p-7">
              <div className="relative">
                <p className="kicker text-[#c8f2ec]">Coverage and support</p>
                <h2 className="section-title mt-3 text-white">
                  Built around real booking locations and real follow-up.
                </h2>

                <div className="mt-6 space-y-4">
                  {serviceCoverage.map((area) => (
                    <div
                      key={area.city}
                      className="rounded-[28px] border border-white/12 bg-white/8 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-white">
                            {area.city}
                          </p>
                          <p className="mt-1 text-sm text-[#c6dfea]">
                            {area.supportHours}
                          </p>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#d8eff4]">
                          {area.eta}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {area.zones.slice(0, 4).map((zone) => (
                          <span
                            key={zone}
                            className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-[#d8eff4]"
                          >
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
            <article className="surface-panel rounded-[38px] p-6 md:p-7">
              <p className="kicker text-[#0d8b83]">How it works</p>
              <h2 className="section-title mt-3 text-[#163047]">
                Cleaner for customers, clearer for technicians
              </h2>

              <div className="mt-6 space-y-4">
                {[
                  {
                    title: "Choose the right category",
                    text: "Browse service groups, compare starting rates, and understand the kind of support you are requesting.",
                  },
                  {
                    title: "Share local details once",
                    text: "Address, nearby landmark, urgency, and payment preference are all collected in one guided flow.",
                  },
                  {
                    title: "Track the request after booking",
                    text: "Use the customer dashboard and support area to follow status and keep communication clear.",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-[28px] border border-[#e6edf1] bg-[#fbfdff] p-5"
                  >
                    <div className="flex gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#102437] text-sm font-semibold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-lg font-semibold text-[#163047]">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[#617584]">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-panel rounded-[38px] p-6 md:p-7">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="kicker text-[#0d8b83]">Support access</p>
                  <h2 className="section-title mt-3 text-[#163047]">
                    Help channels that stay easy to find
                  </h2>
                </div>

                <Link
                  to={isAuthenticated ? "/support" : "/login"}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0d8b83]"
                >
                  {isAuthenticated ? "Open support" : "Sign in for support"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {supportChannels.map((channel, index) => (
                  <div
                    key={channel.title}
                    className="rounded-[28px] border border-[#e6edf1] bg-[#fbfdff] p-5"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-[1.2rem] bg-[#eef7ff] text-[#0d8b83]">
                      {index === 0 ? (
                        <Clock3 className="h-5 w-5" />
                      ) : index === 1 ? (
                        <MapPin className="h-5 w-5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                    </div>
                    <p className="mt-4 text-lg font-semibold text-[#163047]">
                      {channel.title}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0d8b83]">
                      {channel.value}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#617584]">
                      {channel.detail}
                    </p>
                  </div>
                ))}
              </div>

              <div className="surface-panel-dark mt-6 rounded-[32px] p-5 text-white">
                <div className="relative">
                  <p className="kicker text-[#c8f2ec]">Get started</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                    Move from discovery to booking without the UI getting in the way.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleExploreClick}
                      className="btn-primary px-5 py-3 text-sm font-semibold"
                    >
                      {isAuthenticated ? "Enter app" : "Sign in"}
                    </button>
                    <Link
                      to={isAuthenticated ? "/dashboard" : "/signup"}
                      className="btn-secondary px-5 py-3 text-sm font-semibold"
                    >
                      {isAuthenticated ? "Open dashboard" : "Create account"}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default LandingPage;
