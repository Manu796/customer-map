// Archivo principal de rutas.
// Estructura:
// - AuthProvider envuelve TODA la app para proveer user + loading
// - Rutas públicas: login, register, reset-password
// - Rutas protegidas: /app (dashboard principal)
// - ProtectedRoute se encarga de seguridad + loader global

import { Routes, Route, Navigate } from "react-router-dom";

// Páginas de autenticación
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

// Dashboard principal
import AppLayout from "./pages/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ClientsPage from "./pages/ClientsPage";
import SettingsPage from "./pages/SettingsPage";

// Rutas protegidas
import { ProtectedRoute } from "./components/ProtectedRoute";

// Contexto de autenticación (Firebase)
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Registro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Recuperación de contraseña */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* RUTAS PROTEGIDAS - Nested Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard (index route) */}
          <Route index element={<DashboardPage />} />
          
          {/* Clients page with unified map + list */}
          <Route path="clients" element={<ClientsPage />} />
          
          {/* Settings page */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Redirecciones por default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
