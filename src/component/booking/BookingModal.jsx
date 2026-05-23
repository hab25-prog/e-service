import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  Phone,
  AlertTriangle,
  X,
} from "lucide-react";
import { createBooking } from "../../service/apiEndPoint";
import useAuth from "../../context/useAuth";

const steps = ["Issue details", "Visit details"];

function BookingModal({ isOpen, onClose, technician }) {
  const [stepIndex, setStepIndex] = useState(0);

  // Core database mapped form states
  const [issue, setIssue] = useState("");
  const [schedule, setSchedule] = useState("");
  const [address, setAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [confirmationId, setConfirmationId] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const { user } = useAuth();
  if (!isOpen) return null;

  // Strict field check validation mapping logic
  const canContinue =
    stepIndex === 0
      ? issue.trim().length >= 4
      : stepIndex === 1
        ? schedule.trim() !== "" &&
          address.trim() !== "" &&
          contactPhone.trim().length >= 9
        : true;

  async function handleContinue() {
    setSubmissionError("");

    if (stepIndex < steps.length - 1) {
      setStepIndex((previous) => previous + 1);
      return;
    }

    const bookingPayload = {
      description: issue,
      scheduled_at: new Date(schedule).toISOString(),
      address_text: address,
      category_id: technician?.technician_details?.category_id || null,
      technician_id: technician?.id || null,
      customer_id: user?.id,
    };

    try {
      const result = await createBooking(bookingPayload);
      setConfirmationId(result?.id || `BK-${Date.now()}`);
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "We could not send your request right now.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#101828]/45 p-2 backdrop-blur-sm sm:p-4 flex items-center justify-center">
      <section className="flex w-full max-w-2xl flex-col overflow-hidden rounded-[24px] border border-[#e7ecf1] bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="border-b border-[#edf1f5] px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#35a40b]">
              {confirmationId
                ? "Success"
                : `Step ${stepIndex + 1} of ${steps.length}: ${steps[stepIndex]}`}
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#163047]">
              {confirmationId
                ? "Request Sent!"
                : `Connect with ${technician?.full_name || "Technician"}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#e4e9ef] bg-white text-[#667085] hover:bg-[#f8fafc] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 flex-1 bg-slate-50/50">
          {submissionError && (
            <div className="mb-4 p-4 bg-red-50 rounded-xl text-red-700 text-sm font-medium flex items-center gap-2 border border-red-100">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {submissionError}
            </div>
          )}

          {confirmationId ? (
            /* SUCCESS VIEW */
            <div className="text-center py-8 space-y-4">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div>
                <p className="text-lg font-bold text-[#163047]">
                  Request Sent to {technician?.full_name || "Technician"}!
                </p>
                <p className="text-sm text-[#667085] mt-1 px-4">
                  An SMS notification alert has been sent to their device SIM
                  card. Once they check their dashboard adjustments and click
                  Accept, your live chat will initiate.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold mt-4 bg-[#163047] text-white hover:bg-[#102233] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            /* INPUT STEP SCREEN SPLITTERS */
            <div className="space-y-4">
              {stepIndex === 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-[#163047]">
                    What do you need help with?
                  </label>
                  <textarea
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                    placeholder="Describe your maintenance or service job details clearly..."
                    className="w-full min-h-[140px] rounded-2xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-[#0d8b83] outline-none bg-white text-[#163047]"
                  />
                </div>
              )}

              {stepIndex === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#163047]">
                      <CalendarDays className="h-4 w-4 text-[#0d8b83]" />{" "}
                      Preferred Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0d8b83] outline-none bg-white text-[#163047]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#163047]">
                      <MapPin className="h-4 w-4 text-[#0d8b83]" /> Service
                      Location / Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g., Kebele 14, near Grand Resort, Bahir Dar"
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0d8b83] outline-none bg-white text-[#163047]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#163047]">
                      <Phone className="h-4 w-4 text-[#0d8b83]" /> Your Contact
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g., 09********"
                      className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-[#0d8b83] outline-none bg-white text-[#163047]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!confirmationId && (
          <div className="border-t border-[#edf1f5] px-6 py-4 bg-white flex justify-between items-center">
            <button
              type="button"
              disabled={stepIndex === 0 || createBooking.isPending}
              onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-[#667085] hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              disabled={!canContinue || createBooking.isPending}
              onClick={handleContinue}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#163047] text-white disabled:opacity-50 transition-opacity cursor-pointer"
            >
              {createBooking.isPending
                ? "Sending Request..."
                : stepIndex < steps.length - 1
                  ? "Continue"
                  : "Send Booking Request"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default BookingModal;
