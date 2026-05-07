import { hasSupabaseConfig, supabase } from "./supaBaseConf";

// --- HELPERS ---

function normalizeText(value, { lowercase = false } = {}) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return lowercase ? trimmed.toLowerCase() : trimmed;
}

function ensureSupabase() {
  if (!hasSupabaseConfig || !supabase) {
    return {
      success: false,
      error:
        "Supabase configuration is missing. Check your environment variables.",
    };
  }
  return null;
}

// --- AUTH FUNCTIONS ---

export async function signUpCustomer({ email, password, fullName }) {
  const configError = ensureSupabase();
  if (configError) return configError;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: normalizeText(email, { lowercase: true }),
      password,
      options: {
        data: {
          full_name: normalizeText(fullName),
          requested_role: "customer", // Explicitly set for trigger
        },
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function signUpTechnician({
  email,
  password,
  fullName,
  phone_number,
  specialty,
  city,
  catagorie_id, // Keeping your variable name but mapping it to DB
  profilePicture,
}) {
  const configError = ensureSupabase();
  if (configError) return configError;

  // 1. Upload File First
  const { data: uploadData, error: uploadError } = await uploadFile(
    profilePicture,
    fullName,
  );

  if (uploadError) {
    return {
      success: false,
      error: "Profile picture upload failed: " + uploadError.message,
    };
  }

  const avatarUrl = uploadData?.fullPath;

  // 2. Sign Up with Metadata (Trigger handles profiles & technician_details)
  try {
    const { data, error } = await supabase.auth.signUp({
      email: normalizeText(email, { lowercase: true }),
      password,
      options: {
        data: {
          full_name: normalizeText(fullName),
          phone: normalizeText(phone_number), // DB Trigger uses 'phone'
          specialty: normalizeText(specialty),
          city: normalizeText(city),
          catagorie_id: catagorie_id, // Match trigger naming
          requested_role: "technician",
          avatar_url: avatarUrl || null,
        },
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function login(email, password) {
  const configError = ensureSupabase();
  if (configError) return configError;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeText(email, { lowercase: true }),
      password,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  return error ? { success: false, error: error.message } : { success: true };
}

// --- E-COMMERCE / DATA FUNCTIONS ---

/**
 * Fetch technicians by category for the customer to browse
 */
export async function fetchTechniciansByCategory(categoryId) {
  const { data, error } = await supabase
    .from("technician_details")
    .select(
      `
      id,
      bio,
      rating_avg,
      base_fee,
      profiles (
        full_name,
        avatar_url,
        phone_number
      )
    `,
    )
    .eq("category_id", categoryId)
    .eq("is_verified", true); // Only show verified pros

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

/**
 * Customer books a job
 */
export async function createJob(jobData) {
  // jobData should include: customer_id, technician_id, category_id, description, address_text, scheduled_at, total_price
  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data[0] };
}

/**
 * Update Job Status (Technician accepting/completing)
 */
export async function updateJobStatus(jobId, newStatus) {
  const { data, error } = await supabase
    .from("jobs")
    .update({ status: newStatus })
    .eq("id", jobId)
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data[0] };
}
export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name_en, name_am")
    .order("name_en", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error.message);
    return { success: false, data: [] };
  }
  console.log("Fetched categories:", data);
  return { success: true, data };
}
// --- STORAGE HELPER ---

async function uploadFile(file, name) {
  // Replace spaces in name to avoid URL issues
  const safeName = name.replace(/\s+/g, "_").toLowerCase();
  const fileName = `${Date.now()}_${safeName}`;

  const { data, error } = await supabase.storage
    .from("profile_pic")
    .upload(`${fileName}.jpg`, file, {
      upsert: true,
    });

  if (error) {
    console.error("Storage Error:", error.message);
    return { data: null, error };
  }
  return { data, error: null };
}
