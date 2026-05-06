import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { useAuthStore } from "./store/auth";

export default function App() {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

  useEffect(() => {
    if (window.location.pathname === "/auth/login") {
      return;
    }

    fetchProfile().catch(() => {
      // 401 sets isLoading=false in store, ProtectedRoute handles redirect
    });
  }, [fetchProfile]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
