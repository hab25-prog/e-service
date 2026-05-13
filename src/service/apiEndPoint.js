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
    const { data: profileData } = uploadFile(profilePicture, fullName);
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
  phone_number,
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
          phone_number: normalizeText(phone_number),
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

export async function fetchTechniciansByCategory(categoryId) {
  const { data, error } = await supabase
    .from("technician_details")
    .select(
      `id, bio, rating_avg, base_fee, profiles (full_name, avatar_url, phone_number)`,
    )
    .eq("category_id", categoryId)
    .eq("is_verified", true);

  if (error) return { success: false, error: error.message };
  return { success: true, data };
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
export async function saveSubscription({ userId, planName, price }) {
  const endDate = new Date();
  const monthsToAdd = planName === "Yearly" ? 12 : 1;
  endDate.setMonth(endDate.getMonth() + monthsToAdd);

  const { data, error } = await supabase
    .from("subscriptions")
    .insert([
      {
        user_id: userId,
        plan_type: planName.toLowerCase(),
        price: price,
        status: "active",
        end_date: endDate.toISOString(),
      },
    ])
    .select()
    .single();

  return error
    ? { success: false, error: error.message }
    : { success: true, data };
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
      body: { user_id: userId, email, amount, plan_type: planName },
    });
    console.log("Payment initialization response:", data, error);
    if (error) throw error;
    return { success: true, checkoutUrl: data.data.checkout_url };
  } catch (error) {
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
