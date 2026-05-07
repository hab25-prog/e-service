import { useMemo, useState } from "react";
import { Filter, MapPin, Search, SlidersHorizontal } from "lucide-react";
import BookingModal from "../component/booking/BookingModal";
import TechnicianCard from "../component/cards/TechnicianCard";
import { serviceCategories, technicians } from "../data/mockData";

function TechnicianList() {
  const [selectedService, setSelectedService] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingTechnician, setBookingTechnician] = useState(null);

  const cities = useMemo(
    () => ["all", ...new Set(technicians.map((technician) => technician.city))],
    [],
  );

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((technician) => {
      const matchesService =
        selectedService === "all" || technician.serviceId === selectedService;
      const matchesCity =
        selectedCity === "all" || technician.city === selectedCity;
      const matchesQuery = [
        technician.name,
        technician.specialty,
        ...technician.skills,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesService && matchesCity && matchesQuery;
    });
  }, [searchQuery, selectedCity, selectedService]);

  return (
    <section className="space-y-6">
      <div className="surface-panel rounded-[38px] p-6 md:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-end">
          <div>
            <p className="kicker text-[#0d8b83]">Technician directory</p>
            <h1 className="section-title mt-3 text-[#163047]">
              Find the right pro with cleaner filters and stronger profile cards
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#607483]">
              Search by name, skill, city, or service category, then jump
              directly into the upgraded booking modal from the profile card.
            </p>
          </div>

          <label className="field-shell">
            <Search className="h-4 w-4 text-[#0d8b83]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, service, or skill"
              className="w-full border-0 bg-transparent text-sm text-[#163047] outline-none placeholder:text-[#90a0aa]"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          {/*  <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#163047]">
              <Filter className="h-4 w-4 text-[#0d8b83]" />
              Filter by service
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedService("all")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedService === "all"
                    ? "bg-[#102437] text-white"
                    : "bg-[#f7fafc] text-[#607483]"
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
                      : "bg-[#f7fafc] text-[#607483]"
                  }`}
                >
                  {service.title}
                </button>
              ))} */}
        </div>
      </div>

      <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#163047]">
          <MapPin className="h-4 w-4 text-[#0d8b83]" />
          Filter by city
        </p>
        <div className="flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCity === city
                  ? "bg-[#102437] text-white"
                  : "bg-[#f7fafc] text-[#607483]"
              }`}
            >
              {city === "all" ? "All cities" : city}
            </button>
          ))}
        </div>
      </div>
      {/* </div>
      </div> */}

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: SlidersHorizontal,
            label: "Results",
            value: filteredTechnicians.length.toString().padStart(2, "0"),
          },
          {
            icon: MapPin,
            label: "Cities covered",
            value: `${cities.length - 1}`,
          },
          {
            icon: Filter,
            label: "Active filter",
            value:
              selectedService === "all"
                ? "All"
                : (serviceCategories.find(
                    (service) => service.id === selectedService,
                  )?.title ?? "All"),
          },
        ].map((item) => (
          <article key={item.label} className="metric-tile rounded-[30px] p-5">
            <div className="grid h-12 w-12 place-items-center rounded-[1.2rem] bg-[#edf7ff] text-[#0d8b83]">
              <item.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-[#163047]">
              {item.value}
            </p>
            <p className="mt-2 text-sm text-[#607483]">{item.label}</p>
          </article>
        ))}
      </div>

      {filteredTechnicians.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTechnicians.map((technician) => (
            <TechnicianCard
              key={technician.id}
              technician={technician}
              onBook={() => setBookingTechnician(technician)}
            />
          ))}
        </div>
      ) : (
        <div className="surface-panel rounded-[30px] p-8 text-center">
          <p className="text-lg font-semibold text-[#163047]">
            No technicians matched the current filter set
          </p>
          <p className="mt-3 text-sm leading-7 text-[#607483]">
            Try clearing the city filter, broadening the service category, or
            using a more general search term.
          </p>
        </div>
      )}

      {bookingTechnician ? (
        <BookingModal
          isOpen
          onClose={() => setBookingTechnician(null)}
          technician={bookingTechnician}
          service={
            serviceCategories.find(
              (service) => service.id === bookingTechnician.serviceId,
            ) ?? null
          }
        />
      ) : null}
    </section>
  );
}

export default TechnicianList;
