import { serviceCategories, technicians } from "../data/mockData";
import { hasSupabaseConfig, supabase } from "./supaBaseConf";

const backendProvider = import.meta.env.VITE_BACKEND_PROVIDER ?? "local";
const LOCAL_BOOKINGS_KEY = "e-service.bookings";
const LOCAL_BOOKING_WORKFLOW_KEY = "e-service.booking-workflow";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function generateBookingId(prefix = "BK") {
  return `${prefix}-${Date.now().toString().slice(-8)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

function getServiceTitle(serviceId) {
  return (
    serviceCategories.find((service) => service.id === serviceId)?.title ??
    "General home service request"
  );
}

function getTechnicianName(technicianId) {
  return (
    technicians.find((technician) => technician.id === technicianId)?.name ??
    "Best available technician"
  );
}

function readLocalBookings() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawBookings = window.localStorage.getItem(LOCAL_BOOKINGS_KEY);
    const parsedBookings = rawBookings ? JSON.parse(rawBookings) : [];
    return Array.isArray(parsedBookings) ? parsedBookings : [];
  } catch {
    return [];
  }
}

function writeLocalBookings(bookings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
}

function readWorkflowState() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawState = window.localStorage.getItem(LOCAL_BOOKING_WORKFLOW_KEY);
    const parsedState = rawState ? JSON.parse(rawState) : {};
    return parsedState && typeof parsedState === "object" ? parsedState : {};
  } catch {
    return {};
  }
}

function writeWorkflowState(state) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_BOOKING_WORKFLOW_KEY, JSON.stringify(state));
}

function createSystemMessage(text) {
  return {
    id: generateBookingId("SYS"),
    senderRole: "system",
    senderName: "EthioTech",
    text,
    createdAt: new Date().toISOString(),
  };
}

function createWorkflowEntry(overrides = {}) {
  return {
    statusOverride: overrides.statusOverride ?? null,
    customerCompletionConfirmed:
      overrides.customerCompletionConfirmed ?? false,
    technicianCompletionConfirmed:
      overrides.technicianCompletionConfirmed ?? false,
    messages: overrides.messages ?? [],
    servicePaymentHandledOutsideApp: true,
  };
}

function ensureWorkflowEntry(workflowState, bookingId, overrides = {}) {
  if (!workflowState[bookingId]) {
    workflowState[bookingId] = createWorkflowEntry(overrides);
  }

  return workflowState[bookingId];
}

function getBookingStatus(baseStatus, workflowEntry) {
  if (
    workflowEntry.customerCompletionConfirmed &&
    workflowEntry.technicianCompletionConfirmed
  ) {
    return "Completed";
  }

  if (
    workflowEntry.customerCompletionConfirmed ||
    workflowEntry.technicianCompletionConfirmed
  ) {
    return "Awaiting verification";
  }

  return workflowEntry.statusOverride ?? baseStatus ?? "Scheduled";
}

function mergeWorkflowIntoBooking(booking, workflowState) {
  const bookingKey = booking.bookingId ?? booking.id;
  const workflowEntry =
    workflowState[bookingKey] ?? createWorkflowEntry();

  return {
    ...booking,
    status: getBookingStatus(booking.status, workflowEntry),
    customerCompletionConfirmed:
      workflowEntry.customerCompletionConfirmed ?? false,
    technicianCompletionConfirmed:
      workflowEntry.technicianCompletionConfirmed ?? false,
    messages: workflowEntry.messages ?? [],
    servicePaymentHandledOutsideApp: true,
    paymentStatusLabel: "Handled outside the app",
  };
}

function updateWorkflowEntry(bookingId, updater) {
  const workflowState = readWorkflowState();
  const currentEntry = ensureWorkflowEntry(workflowState, bookingId);
  const nextEntry = updater(currentEntry);
  workflowState[bookingId] = nextEntry;
  writeWorkflowState(workflowState);
  return nextEntry;
}

async function getCurrentAuthDetails() {
  if (!hasSupabaseConfig || !supabase) {
    return { ownerEmail: "", ownerId: "" };
  }

  const { data } = await supabase.auth.getUser();

  return {
    ownerEmail: normalizeEmail(data.user?.email),
    ownerId: data.user?.id ?? "",
  };
}

function applyFilters(bookings, filters = {}) {
  return bookings.filter((booking) => {
    if (filters.ownerId && booking.ownerId !== filters.ownerId) {
      return false;
    }

    if (
      filters.ownerEmail &&
      normalizeEmail(booking.ownerEmail) !== normalizeEmail(filters.ownerEmail)
    ) {
      return false;
    }

    if (filters.technicianId && booking.technicianId !== filters.technicianId) {
      return false;
    }

    if (
      filters.technicianName &&
      normalizeText(booking.technician).toLowerCase() !==
        normalizeText(filters.technicianName).toLowerCase()
    ) {
      return false;
    }

    return true;
  });
}

function sortByNewest(bookings) {
  return [...bookings].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function validateBookingPayload(payload) {
  if (normalizeText(payload.issue).length < 10) {
    throw new Error("Please describe the issue in a bit more detail.");
  }

  if (!normalizeText(payload.schedule)) {
    throw new Error("Please choose a preferred date and time.");
  }

  if (!normalizeText(payload.address)) {
    throw new Error("Please enter the service address.");
  }

  if (!normalizeText(payload.landmark)) {
    throw new Error("Please add a nearby landmark.");
  }

  if (normalizeText(payload.contactPhone).length < 7) {
    throw new Error("Please enter a valid contact phone number.");
  }
}

const localClient = {
  async listJobs(filters = {}) {
    const workflowState = readWorkflowState();
    const bookings = sortByNewest(
      applyFilters(readLocalBookings(), filters).map((booking) =>
        mergeWorkflowIntoBooking(booking, workflowState),
      ),
    );

    return {
      provider: "local",
      filters,
      jobs: bookings,
    };
  },

  async createBooking(payload) {
    validateBookingPayload(payload);

    const { ownerEmail, ownerId } = await getCurrentAuthDetails();
    const createdAt = new Date().toISOString();
    const bookingId = generateBookingId();
    const booking = {
      id: bookingId,
      bookingId,
      issue: normalizeText(payload.issue),
      schedule: normalizeText(payload.schedule),
      dateLabel: normalizeText(payload.schedule),
      address: normalizeText(payload.address),
      landmark: normalizeText(payload.landmark),
      contactPhone: normalizeText(payload.contactPhone),
      urgency: payload.urgency === "urgent" ? "urgent" : "standard",
      serviceId: normalizeText(payload.serviceId) || "general",
      service: getServiceTitle(payload.serviceId),
      technicianId: payload.technicianId ?? null,
      technician: payload.technicianId
        ? getTechnicianName(payload.technicianId)
        : "Best available technician",
      status: "Scheduled",
      ownerEmail,
      ownerId,
      createdAt,
      provider: "local",
    };

    const bookings = readLocalBookings();
    bookings.unshift(booking);
    writeLocalBookings(bookings);

    updateWorkflowEntry(bookingId, () =>
      createWorkflowEntry({
        messages: [
          createSystemMessage(
            "Booking created. Use this chat to coordinate the visit. Service payment happens outside the app.",
          ),
        ],
      }),
    );

    return mergeWorkflowIntoBooking(booking, readWorkflowState());
  },
};

const supabaseClient = {
  async listJobs(filters = {}) {
    if (!hasSupabaseConfig || !supabase) {
      throw new Error("Supabase bookings are not configured.");
    }

    let query = supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.ownerId) {
      query = query.eq("owner_id", filters.ownerId);
    }

    if (filters.technicianId) {
      query = query.eq("technician_id", filters.technicianId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    const workflowState = readWorkflowState();
    const jobs = applyFilters(
      (data ?? []).map((booking) =>
        mergeWorkflowIntoBooking(
          {
            id: booking.id ?? booking.booking_id ?? generateBookingId(),
            bookingId: booking.booking_id ?? booking.id ?? generateBookingId(),
            issue: booking.issue ?? "",
            schedule: booking.schedule ?? booking.schedule_label ?? "",
            dateLabel: booking.schedule ?? booking.schedule_label ?? "",
            address: booking.address ?? "",
            landmark: booking.landmark ?? "",
            contactPhone: booking.contact_phone ?? "",
            urgency: booking.urgency ?? "standard",
            serviceId: booking.service_id ?? "general",
            service:
              booking.service ?? getServiceTitle(booking.service_id ?? "general"),
            technicianId: booking.technician_id ?? null,
            technician:
              booking.technician_name ??
              getTechnicianName(booking.technician_id ?? null),
            status: booking.status ?? "Scheduled",
            ownerEmail: booking.owner_email ?? "",
            ownerId: booking.owner_id ?? "",
            createdAt: booking.created_at ?? new Date().toISOString(),
            provider: "supabase",
          },
          workflowState,
        ),
      ),
      filters,
    );

    return {
      provider: "supabase",
      filters,
      jobs,
    };
  },

  async createBooking(payload) {
    if (!hasSupabaseConfig || !supabase) {
      throw new Error("Supabase bookings are not configured.");
    }

    validateBookingPayload(payload);

    const { ownerEmail, ownerId } = await getCurrentAuthDetails();
    const bookingToInsert = {
      issue: normalizeText(payload.issue),
      schedule: normalizeText(payload.schedule),
      address: normalizeText(payload.address),
      landmark: normalizeText(payload.landmark),
      contact_phone: normalizeText(payload.contactPhone),
      urgency: payload.urgency === "urgent" ? "urgent" : "standard",
      service_id: normalizeText(payload.serviceId) || "general",
      service: getServiceTitle(payload.serviceId),
      technician_id: payload.technicianId ?? null,
      technician_name: payload.technicianId
        ? getTechnicianName(payload.technicianId)
        : "Best available technician",
      status: "Scheduled",
      owner_email: ownerEmail,
      owner_id: ownerId,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("bookings")
      .insert(bookingToInsert)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    const booking = {
      id: data.id ?? generateBookingId(),
      bookingId: data.booking_id ?? data.id ?? generateBookingId(),
      issue: data.issue ?? bookingToInsert.issue,
      schedule: data.schedule ?? bookingToInsert.schedule,
      dateLabel: data.schedule ?? bookingToInsert.schedule,
      address: data.address ?? bookingToInsert.address,
      landmark: data.landmark ?? bookingToInsert.landmark,
      contactPhone: data.contact_phone ?? bookingToInsert.contact_phone,
      urgency: data.urgency ?? bookingToInsert.urgency,
      serviceId: data.service_id ?? bookingToInsert.service_id,
      service: data.service ?? bookingToInsert.service,
      technicianId: data.technician_id ?? bookingToInsert.technician_id,
      technician: data.technician_name ?? bookingToInsert.technician_name,
      status: data.status ?? "Scheduled",
      ownerEmail: data.owner_email ?? ownerEmail,
      ownerId: data.owner_id ?? ownerId,
      createdAt: data.created_at ?? bookingToInsert.created_at,
      provider: "supabase",
    };

    updateWorkflowEntry(booking.bookingId, () =>
      createWorkflowEntry({
        messages: [
          createSystemMessage(
            "Booking created. Use this chat to coordinate the visit. Service payment happens outside the app.",
          ),
        ],
      }),
    );

    return mergeWorkflowIntoBooking(booking, readWorkflowState());
  },
};

const providerMap = {
  local: localClient,
  supabase: supabaseClient,
};

const activeProvider = providerMap[backendProvider] ?? localClient;

export const api = {
  listJobs: (filters) => activeProvider.listJobs(filters),
  createBooking: (payload) => activeProvider.createBooking(payload),
  addBookingMessage: async ({ bookingId, senderRole, senderName, text }) => {
    const messageText = normalizeText(text);

    if (!messageText) {
      throw new Error("Please enter a message before sending.");
    }

    const message = {
      id: generateBookingId("MSG"),
      senderRole: senderRole === "technician" ? "technician" : "customer",
      senderName: normalizeText(senderName) || "EthioTech user",
      text: messageText,
      createdAt: new Date().toISOString(),
    };

    updateWorkflowEntry(bookingId, (currentEntry) => ({
      ...currentEntry,
      messages: [...(currentEntry.messages ?? []), message],
    }));

    return message;
  },
  confirmBookingCompletion: async ({ bookingId, actorRole }) => {
    const actorField =
      actorRole === "technician"
        ? "technicianCompletionConfirmed"
        : "customerCompletionConfirmed";
    const actorLabel =
      actorRole === "technician" ? "Technician" : "Customer";

    return updateWorkflowEntry(bookingId, (currentEntry) => {
      const nextEntry = {
        ...currentEntry,
        [actorField]: true,
      };

      return {
        ...nextEntry,
        messages: [
          ...(nextEntry.messages ?? []),
          createSystemMessage(
            `${actorLabel} confirmed that the job is finished.`,
          ),
        ],
      };
    });
  },
  updateBookingStatus: async ({ bookingId, status }) => {
    const allowedStatuses = new Set([
      "Scheduled",
      "In progress",
      "Awaiting verification",
      "Completed",
    ]);

    if (!allowedStatuses.has(status)) {
      throw new Error("Unsupported booking status.");
    }

    return updateWorkflowEntry(bookingId, (currentEntry) => ({
      ...currentEntry,
      statusOverride: status,
      messages: [
        ...(currentEntry.messages ?? []),
        createSystemMessage(`Booking status changed to ${status}.`),
      ],
    }));
  },
};
