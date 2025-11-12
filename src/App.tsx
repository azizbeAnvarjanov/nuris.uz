import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { AdminPage } from "./components/AdminPage";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check URL for admin access on mount and when URL changes
  useEffect(() => {
    const checkAdminAccess = () => {
      const params = new URLSearchParams(window.location.search);
      setIsAdmin(params.get("admin") === "true");
    };

    checkAdminAccess();

    // Listen for URL changes
    window.addEventListener("popstate", checkAdminAccess);
    return () => window.removeEventListener("popstate", checkAdminAccess);
  }, []);

  const handleAdminToggle = (show: boolean) => {
    setIsAdmin(show);
    if (show) {
      window.history.pushState({}, "", "?admin=true");
    } else {
      window.history.pushState({}, "", window.location.pathname);
    }
  };

  if (isAdmin) {
    return <AdminPage onBack={() => handleAdminToggle(false)} />;
  }

  return <LandingPage onAdminClick={() => handleAdminToggle(true)} />;
}
