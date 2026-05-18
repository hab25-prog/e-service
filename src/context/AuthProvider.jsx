import { useEffect, useMemo, useState, useCallback } from "react";
import {
  login,
  logout,
  signUpCustomer,
  signUpTechnician,
} from "../service/apiEndPoint";
import { hasSupabaseConfig, supabase } from "../service/supaBaseConf";
import AuthContext from "./authContext";

const normalizeRole = (roleValue) => {
  const role = roleValue?.toLowerCase();
  if (role === "technician") return "technician";
  if (role === "user" || role === "customer") return "customer";
  return "guest";
};

function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized to prevent re-triggering useEffect
  const applySession = useCallback(async (nextSession) => {
    if (!nextSession) {
      setSession(null);
      setUser(null);
      setRole("guest");
      setIsLoading(false);
      return;
    }

    const nextUser = nextSession.user;
    console.log("Applying session for user:", nextUser);
    // 1. Resolve the Avatar URL
    const storagePath = nextUser.user_metadata?.avatar_url;
    let finalAvatarUrl = null;

    if (storagePath) {
      // If the path is already a full URL (from Google/Facebook), use it.
      // Otherwise, generate the Supabase Public URL.
      if (storagePath.startsWith("http")) {
        finalAvatarUrl = storagePath;
      } else {
        const { data } = supabase.storage
          .from("profile_pic")
          .getPublicUrl(storagePath);
        finalAvatarUrl = data.publicUrl;
      }
    }

    // 2. Set the User State with the resolved URL
    setSession(nextSession);
    setUser({
      ...nextUser.user_metadata,
      id: nextUser.id, // Crucial for database queries
      avatar_url: finalAvatarUrl, // The UI now has the full URL
    });

    // 3. Fetch Role (Priority: Metadata > Database > Default)
    let currentRole = null;
    // console.log("Role from metadata:", nextUser.id);
    if (!currentRole) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", nextUser.id)
        .single();
      currentRole = data?.role;
    }

    // Debugging logs added to verify role assignment
    console.log("Profile role from database:", currentRole);

    const normalizedRole = currentRole || "user";
    console.log("Normalized role:", normalizedRole);

    setRole(normalizeRole(normalizedRole));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function initAuth() {
      if (!hasSupabaseConfig || !supabase) {
        if (isActive) {
          setError("Database configuration missing.");
          setIsLoading(false);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (isActive) await applySession(data?.session);
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (isActive) applySession(nextSession);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  // --- ACTIONS ---

  const signInWithPassword = async (email, password) => {
    setError(null);
    setIsLoading(true); // Show loader during login attempt
    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
    }
    // Note: applySession will be called automatically by onAuthStateChange
    return result;
  };

  const signOut = async () => {
    const result = await logout();
    if (!result.success) setError(result.error);
    return result;
  };

  const value = useMemo(
    () => ({
      session,
      user,
      role,
      isLoading,
      isAuthenticated: !!session,
      error,
      signIn: signInWithPassword,
      signUpCustomer: (p) => signUpCustomer(p),
      signUpTechnician: (p) => signUpTechnician(p),
      signOut,
      clearAuthError: () => setError(null),
    }),
    [session, user, role, isLoading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
