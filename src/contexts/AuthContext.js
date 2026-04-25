import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
  try {
    const savedUser = localStorage.getItem("wanderlust_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  } catch {
    setUser(null);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });

  localStorage.setItem("wanderlust_user", JSON.stringify(data));

  setUser(data);

  return data;
};

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    setUser(data);
    return data;
  };

  const logout = async () => {
  await api.post("/auth/logout");

  localStorage.removeItem("wanderlust_user");

  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
