import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import TripPlannerPage from "@/pages/TripPlannerPage";
import DestinationsPage from "@/pages/DestinationsPage";
import DashboardPage from "@/pages/DashboardPage";
import BudgetPlannerPage from "@/pages/BudgetPlannerPage";

export const ThemeContext = createContext();

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/planner" element={<ProtectedRoute><TripPlannerPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/budget" element={<BudgetPlannerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      {user && <ChatWidget />}
      <Toaster position="top-right" richColors />
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("wanderlust-theme") || "light";
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("wanderlust-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <HashRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </HashRouter>
    </ThemeContext.Provider>
  );
}
