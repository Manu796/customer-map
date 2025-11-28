import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import * as XLSX from "xlsx";
import { obtenerClientes, crearCliente } from "../services/clientes";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "data" | "preferences">("account");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Configuración</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Gestiona tu cuenta y preferencias
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-300 dark:border-slate-800">
        <TabButton
          active={activeTab === "account"}
          onClick={() => setActiveTab("account")}
        >
          👤 Cuenta
        </TabButton>
        <TabButton
          active={activeTab === "data"}
          onClick={() => setActiveTab("data")}
        >
          📊 Datos
        </TabButton>
        <TabButton
          active={activeTab === "preferences"}
          onClick={() => setActiveTab("preferences")}
        >
          🎨 Preferencias
        </TabButton>
      </div>

      {/* Tab Content */}
      <div className="pb-8">
        {activeTab === "account" && <AccountTab />}
        {activeTab === "data" && <DataTab />}
        {activeTab === "preferences" && <PreferencesTab />}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
        active
          ? "border-sky-500 text-sky-600 dark:text-sky-400"
          : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}

function AccountTab() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "La nueva contraseña debe tener al menos 6 caracteres" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden" });
      return;
    }

    if (!user?.email) {
      setMessage({ type: "error", text: "No se pudo obtener el email del usuario" });
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setMessage({ type: "success", text: "Contraseña actualizada correctamente" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error changing password:", error);
      let errorMsg = "Error al cambiar la contraseña";
      if (error.code === "auth/wrong-password") {
        errorMsg = "La contraseña actual es incorrecta";
      } else if (error.code === "auth/too-many-requests") {
        errorMsg = "Demasiados intentos. Intenta más tarde";
      }
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Account Info */}
      <SettingsCard title="Información de Cuenta" icon="👤">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400">Email</label>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.email || "No disponible"}</p>
          </div>
          <div>
            <label className="text-xs text-slate-600 dark:text-slate-400">ID de Usuario</label>
            <p className="text-xs font-mono text-slate-600 dark:text-slate-500">{user?.uid || "No disponible"}</p>
          </div>
        </div>
      </SettingsCard>

      {/* Change Password */}
      <SettingsCard title="Cambiar Contraseña" icon="🔐">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Contraseña Actual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
              required
            />
          </div>

          {message && (
            <div
              className={`text-sm px-3 py-2 rounded-lg ${
                message.type === "success"
                  ? "bg-emerald-950/40 border border-emerald-900/60 text-emerald-400"
                  : "bg-red-950/40 border border-red-900/60 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Actualizando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </SettingsCard>
    </div>
  );
}

function DataTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleExportData = async () => {
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      const clientes = await obtenerClientes(user.uid);

      // Prepare data for Excel
      const data = clientes.map((c) => ({
        Nombre: c.firstName,
        Apellido: c.lastName,
        Teléfono: c.phone,
        Dirección: c.address,
        Latitud: c.lat || "",
        Longitud: c.lng || "",
        Notas: c.notes || "",
      }));

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Clientes");

      // Generate file name with date
      const date = new Date().toISOString().split("T")[0];
      const fileName = `clientes_${date}.xlsx`;

      // Download
      XLSX.writeFile(wb, fileName);

      setMessage({ type: "success", text: `Datos exportados: ${fileName}` });
    } catch (error) {
      console.error("Error exporting data:", error);
      setMessage({ type: "error", text: "Error al exportar los datos" });
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    setMessage(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      let imported = 0;
      for (const row of jsonData) {
        try {
          await crearCliente({
            firstName: row.Nombre || row.nombre || "",
            lastName: row.Apellido || row.apellido || "",
            phone: row.Teléfono || row.telefono || row.phone || "",
            address: row.Dirección || row.direccion || row.address || "",
            lat: parseFloat(row.Latitud || row.latitud || row.lat) || undefined,
            lng: parseFloat(row.Longitud || row.longitud || row.lng) || undefined,
            notes: row.Notas || row.notas || row.notes || "",
            userId: user.uid,
          });
          imported++;
        } catch (err) {
          console.error("Error importing row:", row, err);
        }
      }

      setMessage({ 
        type: "success", 
        text: `${imported} cliente${imported !== 1 ? "s" : ""} importado${imported !== 1 ? "s" : ""} correctamente` 
      });

      // Reset file input
      e.target.value = "";
    } catch (error) {
      console.error("Error importing data:", error);
      setMessage({ type: "error", text: "Error al importar los datos" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Export Data */}
      <SettingsCard title="Exportar Datos" icon="📤">
        <div className="space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Descarga todos tus clientes en formato Excel (.xlsx)
          </p>
          <button
            onClick={handleExportData}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Exportando..." : "📥 Descargar Excel"}
          </button>
        </div>
      </SettingsCard>

      {/* Import Data */}
      <SettingsCard title="Importar Datos" icon="📥">
        <div className="space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Importa clientes desde un archivo Excel. El archivo debe tener las columnas: 
            Nombre, Apellido, Teléfono, Dirección, Latitud, Longitud, Notas.
          </p>
          <div>
            <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-sky-600 hover:bg-sky-500 cursor-pointer transition-colors">
              📤 Seleccionar Archivo Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleImportData}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </SettingsCard>

      {message && (
        <div
          className={`text-sm px-4 py-3 rounded-lg ${
            message.type === "success"
              ? "bg-emerald-950/40 border border-emerald-900/60 text-emerald-400"
              : "bg-red-950/40 border border-red-900/60 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Data Management */}
      <SettingsCard title="Gestión de Datos" icon="🗑️">
        <div className="space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Herramientas para gestionar tus datos de clientes
          </p>
          <div className="space-y-2">
            <button
              className="w-full text-left px-4 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900/40 hover:bg-slate-800 transition-colors"
              disabled
            >
              🧹 Limpiar clientes sin ubicación (Próximamente)
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900/40 hover:bg-slate-800 transition-colors"
              disabled
            >
              🔄 Normalizar nombres (Próximamente)
            </button>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}

function PreferencesTab() {
  return (
    <div className="max-w-2xl space-y-6">
      <SettingsCard title="Preferencias del Mapa" icon="🗺️">
        <div className="space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Configura la ubicación predeterminada del mapa
          </p>
          <div className="space-y-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Latitud</label>
              <input
                type="number"
                step="0.0001"
                defaultValue="-36.6167"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
                disabled
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Longitud</label>
              <input
                type="number"
                step="0.0001"
                defaultValue="-64.2833"
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
                disabled
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Esta funcionalidad estará disponible próximamente
          </p>
        </div>
      </SettingsCard>

      <SettingsCard title="Preferencias de Visualización" icon="🎨">
        <div className="space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            Personaliza la apariencia de la aplicación
          </p>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-700 bg-slate-900/40">
              <span className="text-sm">Modo oscuro</span>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500"
              />
            </label>
          </div>
          <p className="text-xs text-slate-500">
            Esta funcionalidad estará disponible próximamente
          </p>
        </div>
      </SettingsCard>
    </div>
  );
}

function SettingsCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      </div>
      {children}
    </div>
  );
}
