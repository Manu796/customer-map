// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FullScreenLoader } from "./FullScreenLoader";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  // Si todavía está verificando sesión → mostramos loader
  if (loading) {
    return <FullScreenLoader />;
  }

  // Si NO hay usuario → forzamos login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario → render normal
  return children;
}
