import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiAuthMe, apiSignIn, apiSignOut, apiSignUp } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      const data = await apiAuthMe();
      setUser(data.user || null);
      return data.user || null;
    } catch {
      setUser(null);
      return null;
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  async function signIn(input) {
    const data = await apiSignIn(input);
    await refreshUser();
    return data;
  }

  async function signUp(input) {
    return apiSignUp(input);
  }

  async function signOut() {
    await apiSignOut();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      refreshUser,
      signIn,
      signUp,
      signOut
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
