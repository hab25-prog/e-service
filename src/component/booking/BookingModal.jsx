import { useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import useCreateBooking from "../../hook/useCreateBooking";
import { bookingSupportTips, paymentOptions } from "../../data/mockData";
import PaymentMethodBadge from "../../ui/PaymentMethodBadge";

const steps = ["Issue details", "Visit details", "Payment"];

function BookingModal({ isOpen, onClose, service, technician }) {
  const createBooking = useCreateBooking();
  const [stepIndex, setStepIndex] = useState(0);
  const [issue, setIssue] = useState("");
  const [schedule, setSchedule] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [urgency, setUrgency] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState(
    paymentOptions[0]?.id ?? "telebirr",
  );
  const [confirmationId, setConfirmationId] = useState("");
  const [submissionError, setSubmissionError] = useState("");

  if (!isOpen) {
    return null;
  }

  const selectedServiceTitle =
    service?.title ?? technician?.specialty ?? "General home service request";
  const selectedTechnician =
    technician?.name ?? "Best nearby verified technician";

  const canContinue =
    stepIndex === 0
      ? issue.trim().length > 8
      : stepIndex === 1
        ? schedule.trim() &&
          address.trim() &&
          landmark.trim() &&
          contactPhone.trim().length >= 7
        : true;

  async function handleContinue() {
    setSubmissionError("");

    if (stepIndex < steps.length - 1) {
      setStepIndex((previous) => previous + 1);
      return;
    }

    try {
      const result = await createBooking.mutateAsync({
        issue,
        schedule,
        address,
        landmark,
        contactPhone,
        urgency,
        paymentMethod,
        serviceId: service?.id ?? technician?.serviceId ?? "general",
        technicianId: technician?.id ?? null,
      });

      setConfirmationId(result.bookingId ?? result.id ?? `BK-${Date.now()}`);
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "We could not save your booking right now.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101828]/45 p-2 backdrop-blur-sm sm:p-4">
      <div className="flex min-h-full items-start justify-center py-2 sm:items-center sm:py-4">
        <section className="flex w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-[#e7ecf1] bg-white shadow-[0_32px_70px_-40px_rgba(15,23,42,0.25)] sm:max-h-[calc(100svh-2rem)] sm:rounded-[28px]">
          <div className="border-b border-[#edf1f5] px-4 py-4 sm:px-6 sm:py-5 md:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="kicker text-[#35a40b]">{`Step ${stepIndex + 1} of ${steps.length}`}</p>
                <h3 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.05em] text-[#1d2939] sm:mt-3 sm:text-3xl">
                  {confirmationId ? "Booking confirmed" : steps[stepIndex]}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#667085]">
                  {confirmationId
                    ? "Your request has been saved successfully."
                    : "A cleaner booking flow that captures the details technicians need most."}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="grid h-10 w-10 shrink-0 place-items-center self-end rounded-full border border-[#e4e9ef] bg-white text-[#667085] transition hover:bg-[#f8fafc] hover:text-[#1d2939] sm:self-start"
                aria-label="Close booking modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid flex-1 gap-5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div>
              {confirmationId ? (
                <div className="space-y-5">
                  <div className="grid h-18 w-18 place-items-center rounded-[1.5rem] bg-[#f0fbe9] text-[#35a40b]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>

                  <div className="rounded-[22px] border border-[#edf1f5] bg-[#fafbfc] p-5">
                    <p className="text-sm text-[#667085]">Booking reference</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#1d2939]">
                      {confirmationId}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#667085]">
                      Keep your phone nearby so the technician can confirm the
                      visit using the schedule and landmark details you shared.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-primary w-full px-5 py-3 text-sm font-semibold sm:w-auto"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {steps.map((step, index) => (
                      <span
                        key={step}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                          index === stepIndex
                            ? "bg-[#f0fbe9] text-[#35a40b]"
                            : "bg-[#f8fafc] text-[#98a2b3]"
                        }`}
                      >
                        {step}
                      </span>
                    ))}
                  </div>

                  {stepIndex === 0 ? (
                    <div className="mt-6 space-y-6">
                      <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
                        Describe the issue
                        <textarea
                          value={issue}
                          onChange={(event) => setIssue(event.target.value)}
                          placeholder="Example: there is no power in two rooms and the main breaker trips when I turn on the kettle."
                          className="min-h-32 rounded-[20px] border border-[#e4e9ef] bg-white px-4 py-4 text-sm leading-7 text-[#1d2939] outline-none transition focus:border-[#59d61c] focus:ring-4 focus:ring-[#59d61c]/10 sm:min-h-40"
                        />
                      </label>

                      <div>
                        <p className="text-sm font-medium text-[#1d2939]">
                          Urgency
                        </p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {[
                            {
                              id: "standard",
                              title: "Standard visit",
                              text: "Best for routine maintenance and non-urgent household issues.",
                            },
                            {
                              id: "urgent",
                              title: "Urgent service",
                              text: "Use for electricity, water, or other safety-sensitive issues.",
                            },
                          ].map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setUrgency(option.id)}
                              className={`rounded-[20px] border p-4 text-left transition ${
                                urgency === option.id
                                  ? "border-[#59d61c] bg-[#f8fbf6]"
                                  : "border-[#e4e9ef] bg-white"
                              }`}
                            >
                              <p className="text-base font-semibold text-[#1d2939]">
                                {option.title}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-[#667085]">
                                {option.text}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {stepIndex === 1 ? (
                    <div className="mt-6 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
                          Preferred date and time
                          <span className="field-shell">
                            <CalendarDays className="h-4 w-4 text-[#35a40b]" />
                            <input
                              value={schedule}
                              onChange={(event) =>
                                setSchedule(event.target.value)
                              }
                              placeholder="Tomorrow, 5:30 PM"
                              className="w-full border-0 bg-transparent text-sm outline-none"
                            />
                          </span>
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
                          Contact phone
                          <span className="field-shell">
                            <Phone className="h-4 w-4 text-[#35a40b]" />
                            <input
                              type="tel"
                              value={contactPhone}
                              onChange={(event) =>
                                setContactPhone(event.target.value)
                              }
                              placeholder="+2519..."
                              className="w-full border-0 bg-transparent text-sm outline-none"
                            />
                          </span>
                        </label>
                      </div>

                      <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
                        Service address
                        <span className="field-shell">
                          <MapPin className="h-4 w-4 text-[#35a40b]" />
                          <input
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            placeholder="Bole Atlas, Addis Ababa"
                            className="w-full border-0 bg-transparent text-sm outline-none"
                          />
                        </span>
                      </label>

                      <label className="grid gap-2 text-sm font-medium text-[#1d2939]">
                        Nearby landmark
                        <span className="field-shell">
                          <MapPin className="h-4 w-4 text-[#35a40b]" />
                          <input
                            value={landmark}
                            onChange={(event) =>
                              setLandmark(event.target.value)
                            }
                            placeholder="Near Atlas Hotel, condo gate 2, church, school..."
                            className="w-full border-0 bg-transparent text-sm outline-none"
                          />
                        </span>
                      </label>

                      <div className="rounded-[20px] border border-[#edf1f5] bg-[#fafbfc] p-4">
                        <p className="flex items-center gap-2 text-sm font-semibold text-[#1d2939]">
                          <AlertTriangle className="h-4 w-4 text-[#35a40b]" />
                          Local detail tip
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#667085]">
                          Include a clear landmark so the technician can confirm
                          the trip faster.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {stepIndex === 2 ? (
                    <div className="mt-6 space-y-5">
                      {submissionError ? (
                        <div className="rounded-[20px] border border-[#ffd6d1] bg-[#fff5f3] px-4 py-3 text-sm text-[#8d3b2d]">
                          {submissionError}
                        </div>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      disabled={stepIndex === 0 || createBooking.isPending}
                      onClick={() =>
                        setStepIndex((previous) => Math.max(previous - 1, 0))
                      }
                      className="w-full rounded-xl border border-[#e4e9ef] px-5 py-3 text-sm font-semibold text-[#667085] transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      disabled={!canContinue || createBooking.isPending}
                      onClick={handleContinue}
                      className="btn-primary w-full px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {createBooking.isPending
                        ? "Saving..."
                        : stepIndex < steps.length - 1
                          ? `Continue to ${steps[stepIndex + 1]}`
                          : "Confirm booking"}
                    </button>
                  </div>
                </>
              )}
            </div>

            <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[22px] border border-[#edf1f5] bg-[#fafbfc] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
                  Service
                </p>
                <p className="mt-2 text-lg font-semibold text-[#1d2939]">
                  {selectedServiceTitle}
                </p>
              </div>

              <div className="rounded-[22px] border border-[#edf1f5] bg-[#fafbfc] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">
                  Technician
                </p>
                <p className="mt-2 text-lg font-semibold text-[#1d2939]">
                  {selectedTechnician}
                </p>
                <p className="mt-2 text-sm text-[#667085]">
                  {technician
                    ? technician.specialty
                    : "We will match you with the best available specialist."}
                </p>
              </div>

              <div className="rounded-[22px] border border-[#edf1f5] bg-[#f8fbf6] p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#1d2939]">
                  <AlertTriangle className="h-4 w-4 text-[#35a40b]" />
                  Booking tips
                </p>
                <div className="mt-3 space-y-2 text-sm leading-6 text-[#667085]">
                  {bookingSupportTips.map((tip) => (
                    <p key={tip}>{tip}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-[22px] border border-[#edf1f5] bg-white p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#1d2939]">
                  <Clock3 className="h-4 w-4 text-[#35a40b]" />
                  Included in this request
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Issue", "Schedule", "Address", "Payment"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-[#f8fafc] px-3 py-1.5 text-[11px] font-medium text-[#667085]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BookingModal;
