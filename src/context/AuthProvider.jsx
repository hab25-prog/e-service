// src/context/AuthProvider.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  login,
  logout,
  signUpCustomer,
  signUpTechnician,
} from "../service/apiEndPoint";
import { hasSupabaseConfig, supabase } from "../service/supaBaseConf";
import AuthContext from "./authContext";
// import Profile from "../pages/Proifle";

const normalizeRole = (roleValue) => {
  const role = roleValue?.toLowerCase();
  if (role === "technician") return "technician";
  if (role === "admin") return "admin";
  return "customer";
};

const normalizeProfileData = (profileData) => {
  console.log("Raw Profile Data:", profileData);
  const updateProfileData = {
    ...profileData,
    avatar_url:
      supabase.storage.from("profile_pic").getPublicUrl(profileData.avatar_url)
        ?.data?.publicUrl || null,
  };
  console.log("Normalized Profile Data:", updateProfileData.avatar_url);
  return updateProfileData;
};

function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("guest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const applySession = useCallback(async (nextSession) => {
    if (!nextSession) {
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole("guest");
      setIsLoading(false);
      return;
    }

    const nextUser = nextSession.user;

    // Fetch Full Profile Data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(`*, technician_details(*)`)
      .eq("id", nextUser.id)
      .single();

    if (profileData) {
      const normalizedProfile = normalizeProfileData(profileData);
      setProfile(normalizedProfile);
      setRole(normalizeRole(profileData.role));
    }
    console.log("Profile Data:", profile?.avatar_url);
    setSession(nextSession);
    setUser({
      ...nextUser.user_metadata,
      id: nextUser.id,
      email: nextUser.email,
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isActive = true;
    async function initAuth() {
      if (!hasSupabaseConfig || !supabase) {
        setIsLoading(false);
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

  const clearAuthError = () => setError(null);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      role,
      isLoading,
      isAuthenticated: !!session,
      error,
      signIn: login,
      signOut: logout,
      signUpCustomer,
      signUpTechnician,
      refreshProfile: () => applySession(session),
      clearAuthError,
    }),
    [session, user, profile, role, isLoading, error, applySession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuthContext() {
  const context = useMemo(() => useMemo(() => useContext(AuthContext)), []);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
export default AuthProvider;
