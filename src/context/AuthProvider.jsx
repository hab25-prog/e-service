import { useEffect, useMemo, useState } from "react";
import {
  login,
  logout,
  signUpCustomer,
  signUpTechnician,
} from "../service/apiEndPoint";
import { hasSupabaseConfig, supabase } from "../service/supaBaseConf";
import AuthContext from "./authContext";

function normalizeRole(roleValue) {
  if (roleValue === "technician") {
    return "technician";
  }

  if (roleValue === "user" || roleValue === "customer") {
    return "user";
  }

  return "guest";
}

function resolveRole(currentUser) {
  if (!currentUser) {
    return "guest";
  }

  const trustedRole = normalizeRole(currentUser?.app_metadata?.role);

  // Avoid trusting client-managed user metadata for privileged routes.
  return trustedRole === "guest" ? "user" : trustedRole;
}

function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  function applySession(nextSession) {
    const nextUser = nextSession?.user ?? null;

    setSession(nextSession ?? null);
    setUser(nextUser);
    setRole(resolveRole(nextUser));
    setIsLoading(false);
  }

  useEffect(() => {
    let isActive = true;

    async function bootstrapSession() {
      if (!hasSupabaseConfig || !supabase) {
        if (!isActive) {
          return;
        }

        setError(
          "Supabase configuration is missing. Add your VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
        );
        setSession(null);
        setUser(null);
        setRole("guest");
        setIsLoading(false);
        return;
      }

      const { data, error: sessionError } = await supabase.auth.getSession();

      if (!isActive) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
        setSession(null);
        setUser(null);
        setRole("guest");
        setIsLoading(false);
        return;
      }

      const nextSession = data?.session ?? null;
      applySession(nextSession);
    }

    bootstrapSession();

    if (!hasSupabaseConfig || !supabase) {
      return () => {
        isActive = false;
      };
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithPassword(email, password) {
    setError(null);
    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
    }
    setRole(result.role);
    return result;
  }

  async function registerCustomer(payload) {
    setError(null);
    const result = await signUpCustomer(payload);

    if (!result.success) {
      setError(result.error);
    }

    return result;
  }

  async function registerTechnician(payload) {
    setError(null);
    const result = await signUpTechnician(payload);

    if (!result || typeof result.success === "undefined") {
      setError("Registration failed: No response from server.");
      return { success: false, error: "No response from server." };
    }

    if (!result.success) {
      setError(result.error);
    }

    return result;
  }

  async function signOut() {
    setError(null);
    const result = await logout();

    if (!result.success) {
      setError(result.error);
      return result;
    }

    setSession(null);
    setUser(null);
    setRole("guest");

    return result;
  }

  function clearAuthError() {
    setError(null);
  }

  const value = useMemo(
    () => ({
      session,
      user,
      role,
      isLoading,
      isAuthenticated: Boolean(session),
      error,
      signIn: signInWithPassword,
      signUpCustomer: registerCustomer,
      signUpTechnician: registerTechnician,
      signOut,
      clearAuthError,
    }),
    [session, user, role, isLoading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
