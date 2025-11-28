import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerClientes, type ClienteConId } from "../services/clientes";
import { SkeletonCard, SkeletonQuickAction } from "../components/Skeletons";

export default function DashboardPage() {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<ClienteConId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    obtenerClientes(user.uid)
      .then(setClientes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // Calculate statistics
  const totalClientes = clientes.length;
  const clientesConUbicacion = clientes.filter(
    (c) => typeof c.lat === "number" && typeof c.lng === "number"
  ).length;
  const clientesSinUbicacion = totalClientes - clientesConUbicacion;

  // Calculate clients added in the last 7 days
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const clientesSemana = clientes.filter(
    (c) => c.createdAt && c.createdAt >= weekAgo
  ).length;

  const percentajeConUbicacion = totalClientes > 0 
    ? Math.round((clientesConUbicacion / totalClientes) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded w-32 animate-pulse"></div>
          <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-64 animate-pulse"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="space-y-3">
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-40 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <SkeletonQuickAction />
            <SkeletonQuickAction />
            <SkeletonQuickAction />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Resumen
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Visión general de tus clientes y actividad
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clientes */}
        <StatCard
          icon="👥"
          label="Total Clientes"
          value={totalClientes}
          color="sky"
        />

        {/* Con Ubicación */}
        <StatCard
          icon="📍"
          label="Con Ubicación"
          value={clientesConUbicacion}
          subtitle={`${percentajeConUbicacion}% del total`}
          color="emerald"
        />

        {/* Sin Ubicación */}
        <StatCard
          icon="📌"
          label="Sin Ubicación"
          value={clientesSinUbicacion}
          color="amber"
        />

        {/* Esta Semana */}
        <StatCard
          icon="📅"
          label="Esta Semana"
          value={clientesSemana}
          subtitle="Últimos 7 días"
          color="violet"
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickActionCard
            icon="➕"
            title="Agregar Cliente"
            description="Registrar un nuevo cliente"
            href="/app/clients"
          />
          <QuickActionCard
            icon="🗺️"
            title="Ver Mapa"
            description="Visualizar todos los clientes"
            href="/app/clients"
          />
          <QuickActionCard
            icon="📤"
            title="Exportar Datos"
            description="Descargar lista de clientes"
            href="/app/settings"
          />
        </div>
      </div>

      {/* Recent Activity / Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Info Card 1 */}
        <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900/50 dark:to-slate-950/50 p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/40 flex items-center justify-center text-xl">
              💡
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Tip del día</h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Asegurate de que todos tus clientes tengan ubicación para aprovechar al máximo 
            el mapa. Podés editarlos desde la vista de Clientes.
          </p>
        </div>

        {/* Info Card 2 */}
        <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900/50 dark:to-slate-950/50 p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-xl">
              📊
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Estado de datos</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Completitud de datos</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">{percentajeConUbicacion}%</span>
            </div>
            <div className="h-2 bg-slate-300 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-500"
                style={{ width: `${percentajeConUbicacion}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  color = "sky",
}: {
  icon: string;
  label: string;
  value: number;
  subtitle?: string;
  color?: "sky" | "emerald" | "amber" | "violet";
}) {
  const colorClasses = {
    sky: "from-sky-500/10 to-sky-600/5 border-sky-500/40",
    emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/40",
    amber: "from-amber-500/10 to-amber-600/5 border-amber-500/40",
    violet: "from-violet-500/10 to-violet-600/5 border-violet-500/40",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-6 space-y-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg bg-white dark:bg-slate-950 ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 p-4 transition-all duration-300 hover:bg-slate-200 dark:hover:bg-slate-900/70 hover:border-slate-400 dark:hover:border-slate-700 hover:scale-[1.02]"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">{description}</p>
        </div>
        <div className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
          →
        </div>
      </div>
    </Link>
  );
}
