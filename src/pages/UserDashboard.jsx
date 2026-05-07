import { useMemo, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  Search,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import { supportChannels } from "../data/mockData";
import useBookings from "../hook/useBookings";
import PaymentMethodBadge from "../ui/PaymentMethodBadge";

function formatPaymentMethodLabel(method) {
  if (method === "telebirr") {
    return "Telebirr";
  }

  if (method === "cbebirr") {
    return "CBEBirr";
  }

  if (method === "cash") {
    return "Cash";
  }

  return method;
}

function UserDashboard() {
  const { user } = useAuth();
  const { data: bookings = [], error } = useBookings(
    { ownerId: user?.id ?? "", ownerEmail: user?.email ?? "" },
    { enabled: Boolean(user?.id || user?.email) },
  );
  const [searchQuery, setSearchQuery] = useState("");

  const displayName =
    user?.user_metadata?.full_name?.trim()?.split(" ")[0] || "there";

  const upcomingBooking =
    bookings.find((booking) => booking.status === "Scheduled") ??
    bookings[0] ??
    null;

  const filteredBookings = useMemo(() => {
    if (!searchQuery.trim()) {
      return bookings;
    }

    const normalizedQuery = searchQuery.toLowerCase();

    return bookings.filter((booking) =>
      [
        booking.service,
        booking.technician,
        booking.address,
        booking.status,
        booking.paymentMethod,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [bookings, searchQuery]);

  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed",
  ).length;
  const paymentMethods = [
    ...new Set(
      bookings.map((booking) => booking.paymentMethod).filter(Boolean),
    ),
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[2rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
              {`Good morning, ${displayName}!`}
            </p>
            <p className="mt-2 text-base text-[#667085]">
              Welcome back to EthioTech. Manage your bookings with a cleaner,
              simpler dashboard.
            </p>
          </div>

          <div className="rounded-[22px] border border-[#edf2f7] bg-[#f8fbf6] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7c8a99]">
              Verified support
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm font-medium text-[#35a40b]">
              <ShieldCheck className="h-4 w-4" />
              Faster booking follow-up
            </p>
          </div>
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-[18px] border border-[#e4e9ef] bg-white px-4 py-3 text-sm text-[#667085] shadow-[0_12px_30px_-28px_rgba(15,23,42,0.16)]">
        <Search className="h-4 w-4 text-[#667085]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search bookings, technicians, status, or payment method..."
          className="w-full border-0 bg-transparent text-sm text-[#1d2939] outline-none placeholder:text-[#98a2b3]"
        />
      </label>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-[1.7rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
                  Upcoming Booking
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Your next scheduled service appears here for quick follow-up.
                </p>
              </div>

              <Link
                to="/services"
                className="rounded-xl bg-[#59d61c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4fc017]"
              >
                Book Service
              </Link>
            </div>

            {upcomingBooking ? (
              <div className="mt-6 rounded-[24px] border border-[#edf1f5] bg-[#fafbfc] p-5">
                <p className="text-xl font-semibold tracking-[-0.03em] text-[#1d2939]">
                  {upcomingBooking.service}
                </p>
                <p className="mt-2 text-sm text-[#667085]">
                  {`${upcomingBooking.technician} • ${upcomingBooking.status}`}
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-[18px] border border-[#edf1f5] bg-white px-4 py-3">
                    <p className="flex items-center gap-2 text-sm font-medium text-[#344054]">
                      <CalendarDays className="h-4 w-4 text-[#35a40b]" />
                      Schedule
                    </p>
                    <p className="mt-2 text-sm text-[#667085]">
                      {upcomingBooking.dateLabel}
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-[#edf1f5] bg-white px-4 py-3">
                    <p className="flex items-center gap-2 text-sm font-medium text-[#344054]">
                      <MapPin className="h-4 w-4 text-[#35a40b]" />
                      Location
                    </p>
                    <p className="mt-2 text-sm text-[#667085]">
                      {upcomingBooking.address}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-[#d6dde5] bg-[#fafbfc] p-6 text-sm text-[#667085]">
                No scheduled booking yet. Start from the services page and your
                next confirmed request will show up here.
              </div>
            )}
          </article>

          <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-[1.7rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
                  Recent Bookings
                </h2>
                <p className="mt-2 text-sm text-[#667085]">
                  Review your saved requests, status updates, and payment
                  choices.
                </p>
              </div>
              <p className="text-sm text-[#98a2b3]">
                {`${filteredBookings.length} result${filteredBookings.length === 1 ? "" : "s"}`}
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {filteredBookings.length ? (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-[22px] border border-[#edf1f5] bg-[#fafbfc] p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold tracking-[-0.03em] text-[#1d2939]">
                          {booking.service}
                        </p>
                        <p className="mt-2 text-sm text-[#667085]">
                          {booking.technician}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          booking.status === "Scheduled"
                            ? "bg-[#eefbe8] text-[#35a40b]"
                            : "bg-[#eef2f6] text-[#475467]"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-[#667085]">
                      <p>{booking.dateLabel}</p>
                      <p>{booking.address}</p>
                      <p>{booking.price}</p>
                      <p>{formatPaymentMethodLabel(booking.paymentMethod)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-[#d6dde5] bg-[#fafbfc] p-6 text-sm text-[#667085] md:col-span-2">
                  No bookings matched your search. Try a broader term.
                </div>
              )}
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <h3 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
              Quick Summary
            </h3>

            <div className="mt-5 space-y-4">
              {[
                { label: "Upcoming", value: upcomingBooking ? "01" : "00" },
                {
                  label: "Completed",
                  value: completedBookings.toString().padStart(2, "0"),
                },
                {
                  label: "Payments",
                  value: paymentMethods.length.toString().padStart(2, "0"),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[18px] border border-[#edf1f5] bg-[#fafbfc] px-4 py-3"
                >
                  <p className="text-sm text-[#667085]">{item.label}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-[#1d2939]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <h3 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
              Payment Methods
            </h3>

            <div className="mt-5 space-y-3">
              {(paymentMethods.length
                ? paymentMethods
                : ["telebirr", "cbebirr", "cash"]
              ).map((method, index) => (
                <PaymentMethodBadge
                  key={method}
                  name={formatPaymentMethodLabel(method)}
                  tone={index === 0 ? "green" : index === 1 ? "indigo" : "blue"}
                  selected={index === 0}
                />
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-[#e7ecf1] bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,42,0.15)]">
            <h3 className="text-[1.5rem] font-semibold tracking-[-0.04em] text-[#1d2939]">
              Support Contacts
            </h3>

            <div className="mt-5 space-y-4">
              {supportChannels.map((channel) => (
                <div key={channel.title} className="flex gap-3">
                  <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#eefbe8] text-[#35a40b]">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1d2939]">
                      {channel.title}
                    </p>
                    <p className="mt-1 text-sm text-[#667085]">
                      {channel.value}
                    </p>
                    <p className="mt-1 text-sm text-[#667085]">
                      {channel.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>

      {error ? (
        <div className="rounded-[22px] border border-[#ffd6d1] bg-[#fff5f3] px-4 py-3 text-sm text-[#8d3b2d]">
          {error.message}
        </div>
      ) : null}
    </section>
  );
}

export default UserDashboard;
