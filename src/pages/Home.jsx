import { useMemo, useState } from "react";
import {
  ArrowRight,
  Clock3,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";
import BookingModal from "../component/booking/BookingModal";
import CategoryCard from "../component/cards/CategoryCard";
import TechnicianCard from "../component/cards/TechnicianCard";
import {
  serviceCategories,
  serviceCoverage,
  technicians,
} from "../data/mockData";

function Home() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [bookingTechnician, setBookingTechnician] = useState(null);

  const visibleServices = useMemo(() => {
    if (!query.trim()) {
      return serviceCategories;
    }

    return serviceCategories.filter((service) =>
      [service.title, service.localTitle, service.description]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [query]);

  const visibleTechnicians = useMemo(() => {
    return technicians.filter((technician) => {
      const matchesService =
        selectedService === "all" || technician.serviceId === selectedService;
      const matchesQuery = [
        technician.name,
        technician.specialty,
        ...technician.skills,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesArea = area.trim()
        ? technician.city.toLowerCase().includes(area.toLowerCase())
        : true;

      return matchesService && matchesQuery && matchesArea;
    });
  }, [area, query, selectedService]);

  const selectedServiceDetails =
    selectedService === "all"
      ? null
      : (serviceCategories.find((service) => service.id === selectedService) ??
        null);

  return (
    <div className="space-y-8">
      <section className="surface-panel-dark relative overflow-hidden rounded-[40px] px-6 py-7 text-white md:px-8 md:py-8">
        <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-[#8ee5d9]/18 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-52 w-52 rounded-full bg-[#f8cb8f]/18 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[1.04fr_0.96fr] xl:items-center">
          <div className="max-w-3xl">
            <span className="kicker text-[#c8f2ec]">
              Explore verified home services
            </span>
            <h1 className="page-title mt-5 text-white">
              Discover the right technician, then book in a flow that feels
              effortless.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#d4ebf3] md:text-lg">
              Search by service or city, compare categories, and move straight
              into a more premium booking experience with fewer dead ends.
            </p>

            <div className="mt-8 grid gap-3 rounded-[30px] border border-white/12 bg-white/10 p-3 backdrop-blur md:grid-cols-[1.1fr_0.9fr_auto]">
              <label className="field-shell">
                <Search className="h-4 w-4 text-[#0d8b83]" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search service or technician"
                  className="w-full border-0 bg-transparent text-sm text-[#163047] outline-none placeholder:text-[#90a0aa]"
                />
              </label>

              <label className="field-shell">
                <MapPin className="h-4 w-4 text-[#0d8b83]" />
                <input
                  type="text"
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  placeholder="Area or city"
                  className="w-full border-0 bg-transparent text-sm text-[#163047] outline-none placeholder:text-[#90a0aa]"
                />
              </label>

              <Link
                to="/technicians"
                className="btn-primary px-5 py-3 text-sm font-semibold"
              >
                Full directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                {
                  label: "Matching pros",
                  value: String(visibleTechnicians.length).padStart(2, "0"),
                },
                {
                  label: "Visible services",
                  value: String(visibleServices.length).padStart(2, "0"),
                },
                {
                  label: "Coverage cities",
                  value: `${serviceCoverage.length}`,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[26px] border border-white/12 bg-white/8 p-4"
                >
                  <p className="text-3xl font-semibold tracking-[-0.05em] text-white">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-[#cde4ec]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[34px] border border-white/15 bg-white/10 p-3 shadow-[0_36px_110px_-58px_rgba(5,18,31,0.88)] backdrop-blur-md">
              <img
                src={heroImg}
                alt="Home service preview"
                className="h-full w-full rounded-[28px] object-cover"
              />
            </div>

            <div className="surface-panel absolute -left-3 bottom-6 hidden max-w-[15rem] rounded-[28px] p-4 text-[#163047] md:block float-slow">
              <p className="kicker text-[#0d8b83]">Selected service</p>
              <p className="mt-3 text-xl font-semibold tracking-[-0.04em]">
                {selectedServiceDetails?.title ?? "All services"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#617584]">
                {selectedServiceDetails?.description ??
                  "Browse the full catalog, then narrow by category when you are ready."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Verified and insured",
            text: "Profiles surface trust signals before you spend time opening a booking flow.",
          },
          {
            icon: TrendingUp,
            title: "Cleaner repeat experience",
            text: "The updated workspace is easier to return to for new jobs and follow-up.",
          },
          {
            icon: Star,
            title: "Stronger booking confidence",
            text: "Clearer cards, guided forms, and premium styling reduce hesitation.",
          },
        ].map((item) => (
          <article key={item.title} className="surface-card rounded-[32px] p-6">
            <div className="grid h-14 w-14 place-items-center rounded-[1.2rem] bg-[#e9f7f3] text-[#0d8b83]">
              <item.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-xl font-semibold tracking-[-0.04em] text-[#163047]">
              {item.title}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#607483]">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker text-[#0d8b83]">Services</p>
            <h2 className="section-title mt-3 text-[#163047]">
              Browse category-first, then refine with filters
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#607483]">
              Service cards now feel more editorial and easier to compare at a
              glance.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedService("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedService === "all"
                  ? "bg-[#102437] text-white"
                  : "bg-white/80 text-[#607483] shadow-[0_18px_32px_-28px_rgba(15,40,61,0.28)]"
              }`}
            >
              All services
            </button>
            {serviceCategories.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedService === service.id
                    ? "bg-[#102437] text-white"
                    : "bg-white/80 text-[#607483] shadow-[0_18px_32px_-28px_rgba(15,40,61,0.28)]"
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>
        </div>

        {/* {visibleServices.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleServices.map((service) => (
              <CategoryCard
                key={service.id}
                {...service}
                onClick={() => setSelectedService(service.id)}
              />
            ))}
          </div>
        ) : (
          <div className="surface-panel rounded-[30px] p-8 text-center text-sm text-[#607483]">
            No services matched the current search. Try a broader service term
            or clear the filters.
          </div>
        )} */}
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker text-[#0d8b83]">Technicians</p>
            <h2 className="section-title mt-3 text-[#163047]">
              Recommended pros for your shortlist
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#607483]">
              {selectedServiceDetails
                ? `Showing ${selectedServiceDetails.title.toLowerCase()} specialists who match your current search.`
                : "Use the chips above to narrow by category before booking."}
            </p>
          </div>

          <Link
            to="/technicians"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0d8b83]"
          >
            Open full technician directory
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {visibleTechnicians.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleTechnicians.slice(0, 6).map((technician) => (
              <TechnicianCard
                key={technician.id}
                technician={technician}
                onBook={() => setBookingTechnician(technician)}
              />
            ))}
          </div>
        ) : (
          <div className="surface-panel rounded-[30px] p-8 text-center text-sm text-[#607483]">
            No technicians matched the current filter set. Try widening the
            service or city search.
          </div>
        )}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
        <article className="surface-panel-dark rounded-[38px] p-6 text-white md:p-7">
          <div className="relative">
            <p className="kicker text-[#c8f2ec]">Coverage in Ethiopia</p>
            <h2 className="section-title mt-3 text-white">
              The service layer is shaped around where people really book.
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {serviceCoverage.slice(0, 3).map((area) => (
                <div
                  key={area.city}
                  className="rounded-[28px] border border-white/12 bg-white/8 p-4"
                >
                  <p className="text-lg font-semibold text-white">
                    {area.city}
                  </p>
                  <p className="mt-2 text-sm text-[#d2e7ef]">{area.eta}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#c8f2ec]">
                    {area.supportHours}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="surface-panel rounded-[38px] p-6 md:p-7">
          <p className="kicker text-[#0d8b83]">Booking flow</p>
          <h2 className="section-title mt-3 text-[#163047]">
            The new flow collects all the details technicians actually need.
          </h2>

          <div className="mt-6 space-y-4">
            {[
              "Describe the issue and mark whether it is urgent.",
              "Add your preferred time, address, landmark, and contact number.",
              "Choose a payment method and receive a saved booking reference instantly.",
            ].map((step, index) => (
              <div
                key={step}
                className="flex gap-4 rounded-[28px] border border-[#e6edf1] bg-[#fbfdff] p-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#102437] text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-7 text-[#607483]">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] border border-[#e6edf1] bg-[#f7fbfd] p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-[#163047]">
              <Sparkles className="h-4 w-4 text-[#0d8b83]" />
              Better suited for local directions and landmark-based addresses
            </p>
            <p className="mt-3 text-sm leading-7 text-[#607483]">
              The modal now supports landmark context, urgency, and payment
              preference in a cleaner guided layout.
            </p>
          </div>
        </article>
      </section>

      {bookingTechnician ? (
        <BookingModal
          isOpen
          onClose={() => setBookingTechnician(null)}
          technician={bookingTechnician}
          service={
            serviceCategories.find(
              (service) => service.id === bookingTechnician.serviceId,
            ) ?? selectedServiceDetails
          }
        />
      ) : null}
    </div>
  );
}

export default Home;
