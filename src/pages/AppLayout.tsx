import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

type NavItem = {
  label: string;
  to: string;
};

const navItems: NavItem[] = [
  { label: "Resumen", to: "/app" },
  { label: "Clientes", to: "/app/clients" },
  { label: "Configuración", to: "/app/settings" },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const currentPath = location.pathname;

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
      {/* SIDEBAR - mobile: drawer, desktop: fija */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 
          bg-white dark:bg-slate-950 
          border-r border-slate-300 dark:border-slate-800
          transform transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0
        `}
      >
        {/* Branding */}
        <div className="h-16 flex items-center gap-2 px-4 border-b border-slate-300 dark:border-slate-800">
          <div className="h-9 w-9 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/40">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 tracking-tight">
              CM
            </span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Customer Map</p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">Panel de clientes</p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="mt-4 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/app"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-sky-100 dark:bg-sky-600/20 text-sky-700 dark:text-sky-200 border border-sky-300 dark:border-sky-500/60"
                    : "text-slate-700 dark:text-slate-300 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-50",
                ].join(" ")
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sky-600 dark:bg-sky-400" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-3 md:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/60 p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <span className="sr-only">Abrir menú</span>
              <div className="space-y-0.5">
                <span className="block h-0.5 w-4 bg-slate-700 dark:bg-slate-200" />
                <span className="block h-0.5 w-4 bg-slate-700 dark:bg-slate-200" />
                <span className="block h-0.5 w-4 bg-slate-700 dark:bg-slate-200" />
              </div>
            </button>

            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {getPageTitle(currentPath)}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-500 hidden sm:inline">
                {getPageSubtitle(currentPath)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/70 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            >
              {theme === "dark" ? (
                <span className="text-lg">☀️</span>
              ) : (
                <span className="text-lg">🌙</span>
              )}
            </button>

            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                {user?.email || "Usuario"}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-500">Sesión activa</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500/30 to-sky-600/20 border border-sky-500/60 flex items-center justify-center text-xs font-semibold text-sky-700 dark:text-sky-200 shadow-lg">
              {user?.email ? user.email[0].toUpperCase() : "U"}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="px-3 py-4 md:px-6 md:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function getPageTitle(pathname: string): string {
  if (pathname === "/app" || pathname === "/app/") return "Resumen";
  if (pathname.startsWith("/app/clients")) return "Clientes";
  if (pathname.startsWith("/app/settings")) return "Configuración";
  return "Customer Map";
}

function getPageSubtitle(pathname: string): string {
  if (pathname === "/app" || pathname === "/app/")
    return "Visión general de tus clientes y actividad.";
  if (pathname.startsWith("/app/clients"))
    return "Mapa y lista de clientes con búsqueda y filtros.";
  if (pathname.startsWith("/app/settings"))
    return "Ajustá opciones del panel y tu cuenta.";
  return "Panel de clientes.";
}
