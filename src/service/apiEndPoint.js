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

export async function signUpCustomer({
  email,
  password,
  fullName,
  profilePicture,
}) {
  const configError = ensureSupabase();
  if (configError) return configError;

  try {
    const { data: profileData } = await uploadFile(profilePicture, fullName);
    console.log("Profile picture upload result:", profileData);
    const { data, error } = await supabase.auth.signUp({
      email: normalizeText(email, { lowercase: true }),
      password,
      options: {
        data: {
          full_name: normalizeText(fullName),
          requested_role: "customer",
          avatar_url: profileData?.path || null,
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
  phone,
  specialty,
  city,
  catagorie_id,
  profilePicture,
}) {
  const configError = ensureSupabase();
  if (configError) return configError;

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

  const avatarUrl = uploadData?.path;
  console.log("upload url:", avatarUrl);
  console.log("Category ID:", catagorie_id);
  try {
    const { data, error } = await supabase.auth.signUp({
      email: normalizeText(email, { lowercase: true }),
      password,
      options: {
        data: {
          full_name: normalizeText(fullName),
          phone_number: normalizeText(phone),
          specialty: normalizeText(specialty),
          city: normalizeText(city),
          category_id: catagorie_id,
          requested_role: "technician",
          avatar_url: avatarUrl || null,
        },
      },
    });
    console.error("Technician sign-up error:", error);
    if (error)
      return {
        success: false,
        error: error.message,
      };
    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function login(email, password) {
  const configError = ensureSupabase();
  if (configError) return configError;

  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: normalizeText(email, { lowercase: true }),
      password,
    });

    if (error) return { success: false, error: error.message };

    // Get the path from metadata
    const storagePath = authData.user.user_metadata?.avatar_url;
    let finalImageUrl = null;

    // Only fetch the public URL if a path exists
    if (storagePath) {
      const { data } = supabase.storage
        .from("profile_pic")
        .getPublicUrl(storagePath);
      finalImageUrl = data.publicUrl;
    }
    console.log("final url:", finalImageUrl);
    // Attach the full URL to the user object for the UI
    const userWithImage = {
      ...authData.user,
      avatar_url: finalImageUrl,
    };
    console.log("User object with image URL:", userWithImage);
    return {
      success: true,
      user: userWithImage,
      session: authData.session,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  return error ? { success: false, error: error.message } : { success: true };
}

// --- DATA FUNCTIONS ---

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name_en, name_am")
    .order("name_en", { ascending: true });

  if (error) return { success: false, data: [] };
  return { success: true, data };
}

export async function fetchTechnicians() {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      `
      *,
      technician_details (
        *
      )
    `,
    )
    .eq("role", "technician");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

// --- SUBSCRIPTION & PAYMENTS ---

export async function startFreeTrial(userId) {
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 3);

  const { data, error } = await supabase
    .from("subscriptions")
    .insert([
      {
        user_id: userId,
        plan_type: "free_trial",
        status: "active",
        price: 0,
        end_date: endDate.toISOString(),
      },
    ])
    .select()
    .single();

  return error
    ? { success: false, error: error.message }
    : { success: true, data };
}

/**
 * Manually save a subscription after frontend payment success
 */
export async function saveSubscription({ userId, planName, price, txRef }) {
  try {
    const endDate = new Date();
    const monthsToAdd =
      planName === "Yearly" || planName === "Yearly Elite" ? 12 : 1;
    endDate.setMonth(endDate.getMonth() + monthsToAdd);

    console.log("saveSubscription - Input params:", {
      userId,
      planName,
      price,
      txRef,
      endDate: endDate.toISOString(),
    });

    const { data, error } = await supabase
      .from("subscriptions")
      .insert([
        {
          user_id: userId,
          plan_type: planName.toLowerCase().replace(/\s+/g, "_"),
          price: price,
          status: "active",
          end_date: endDate.toISOString(),
          tx_ref: txRef,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("saveSubscription - Database Error:", error);
      return { success: false, error: error.message };
    }

    // console.log("saveSubscription - Success:", data);
    const { data: technicianData, error: technicianError } = await supabase
      .from("technician_details")
      .update([{ is_verified: true }])
      .eq("id", userId);
    console.log("Technician verification result:", {
      technicianData,
      technicianError,
    });
    return { success: true, data };
  } catch (err) {
    console.error("saveSubscription - Catch Error:", err);
    return { success: false, error: err.message };
  }
}
export async function fetchJobStatuses(id) {
  const { data, error } = await supabase
    .from("jobs")
    .select("id, status")
    .eq("user_id", id)
    .order("created_at", { ascending: false });
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
export async function initializeSubscriptionPayment({
  userId,
  email,
  amount,
  planName,
}) {
  try {
    console.log("Initializing payment for:", {
      userId,
      email,
      amount,
      planName,
    });
    const { data, error } = await supabase.functions.invoke("pay-chapa", {
      body: { user_id: userId, email, amount, plan_name: planName },
    });
    console.log("Payment initialization response:", data, error);
    if (error) throw error;
    return {
      success: true,
      checkoutUrl: data.data.checkout_url,
      txRef: data.tx_ref,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function getAllcustomers() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "customer");
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { success: false, error: error.message };
  }
}
export async function getAllTechnicians() {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "technician");
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching technicians:", error);
    return { success: false, error: error.message };
  }
}
export async function getTechnicianDetails(techId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
        *,
        technician_details (
          *
        )
      `,
      )
      .eq("id", techId)
      .single();
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching technician details:", error);
    return { success: false, error: error.message };
  }
}
// --- STORAGE HELPER ---

async function uploadFile(file, name) {
  if (!file) return { data: null, error: null };
  const safeName = name.replace(/\s+/g, "_").toLowerCase();
  const fileName = `${Date.now()}_${safeName}.jpg`;

  const { data, error } = await supabase.storage
    .from("profile_pic")
    .upload(fileName, file, { upsert: true });

  return { data, error };
}
