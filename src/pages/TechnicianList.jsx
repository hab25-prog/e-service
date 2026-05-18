import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import Loader from "./Loader";
import { Navigate } from "react-router-dom";

import BookingModal from "../component/booking/BookingModal";
import TechnicianCard from "../component/cards/TechnicianCard";

import { useTechnician } from "../hook/useTechnician";
import useAuth from "../context/useAuth";

function TechnicianList() {
  const [selectedCity, setSelectedCity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingTechnician, setBookingTechnician] = useState(null);

  const { technician, error, isLoading } = useTechnician();
  const { role } = useAuth();
  console.log("technician data:", technician);

  // Always call hooks at the top level
  // Loading and role checks after hooks

  const cities = useMemo(() => {
    return [
      "all",
      ...new Set(
        technician
          ?.map((tech) => tech?.technician_details.city)
          ?.filter(Boolean),
      ),
    ];
  }, [technician]);

  const filteredTechnicians = useMemo(() => {
    return (
      technician?.filter((tech) => {
        const matchesCity =
          selectedCity === "all" ||
          tech?.technician_details.city === selectedCity;

        const matchesQuery = [
          tech?.full_name || "",
          tech?.technician_details.bio || "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return matchesCity && matchesQuery;
      }) || []
    );
  }, [searchQuery, selectedCity, technician]);

  console.log("Technicians:", filteredTechnicians);

  if (isLoading) {
    return <Loader />;
  }
  if (role !== "customer") {
    return <Navigate to="/dashboard" replace />;
  }
  if (error) {
    return (
      <section className="surface-panel rounded-[30px] p-8 text-center">
        <p className="text-lg font-semibold text-red-500">
          Failed to load technicians
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="surface-panel rounded-[38px] p-6 md:p-7">
        <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-end">
          <div>
            <p className="kicker text-[#0d8b83]">Technician directory</p>

            <h1 className="section-title mt-3 text-[#163047]">
              Find the right technician for your service needs
            </h1>
          </div>

          {/* Search */}
          <label className="field-shell">
            <Search className="h-4 w-4 text-[#0d8b83]" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name or bio"
              className="w-full border-0 bg-transparent text-sm text-[#163047] outline-none placeholder:text-[#90a0aa]"
            />
          </label>
        </div>

        {/* City Filter */}
        <div className="mt-6">
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
      </div>

      {/* Technician Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTechnicians.length > 0 ? (
          filteredTechnicians.map((tech) => (
            <TechnicianCard
              key={tech.id}
              technician={tech}
              onBook={() => setBookingTechnician(tech)}
            />
          ))
        ) : (
          <div className="surface-panel rounded-[30px] p-8 text-center md:col-span-2 xl:col-span-3">
            <p className="text-lg font-semibold text-[#163047]">
              No technicians matched the current filters
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {bookingTechnician && (
        <BookingModal
          isOpen
          onClose={() => setBookingTechnician(null)}
          technician={bookingTechnician}
        />
      )}
    </section>
  );
}

export default TechnicianList;
