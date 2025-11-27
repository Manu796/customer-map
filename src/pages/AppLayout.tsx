// src/layouts/AppLayout.tsx
import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { ClientMap } from "../components/ClientMap";
import { ClientForm } from "../components/ClientForm";
import { ClientList } from "../components/ClientList";

import * as XLSX from "xlsx";

import {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  borrarCliente,
  type ClienteConId,
  normalizarNombresClientes,
  splitFullName,
} from "../services/clientes";

/**
 * Convierte string (con coma o punto) a number.
 */
function parseCoord(value: string): number | undefined {
  if (!value) return undefined;
  const normalized = value.replace(",", ".");
  const num = Number(normalized);
  return Number.isNaN(num) ? undefined : num;
}

function AppLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Datos de clientes
  const [clientes, setClientes] = useState<ClienteConId[]>([]);

  // Formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Selección / mapa
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Paginación (front)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Orden
  const [sortMode, setSortMode] = useState<
    "nameAsc" | "nameDesc" | "coordsFirst" | "addressAsc"
  >("nameAsc");

  // Buscador
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar clientes cuando haya user
  useEffect(() => {
    if (!user) return;
    cargarClientes();
  }, [user]);

  // Si cambia la cantidad de clientes, volvemos a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [clientes.length]);

  const cargarClientes = async () => {
    if (!user) return;
    const lista = await obtenerClientes(user.uid);
    setClientes(lista);
  };

  /**
   * Importar desde Excel
   */
  const handleImportExcel = async (file: File) => {
    if (!user) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      for (const row of rows) {
        let fullName = String(row.Nombre || "").trim();
        let first = fullName;
        let last = String(row.Apellido || "").trim();

        // Si no viene Apellido separado, lo generamos desde Nombre completo
        if (!last && fullName.includes(" ")) {
          const split = splitFullName(fullName);
          first = split.firstName;
          last = split.lastName;
        }

        if (!first) continue; // sin nombre, salteamos

        const phone = String(row.Telefono || "").trim();
        const address = String(row.Direccion || "").trim();
        const notes = String(row.Notas || "").trim();

        const latStr = row.Latitud !== undefined ? String(row.Latitud) : "";
        const lngStr = row.Longitud !== undefined ? String(row.Longitud) : "";

        const latNum = parseCoord(latStr);
        const lngNum = parseCoord(lngStr);

        const baseData: any = {
          firstName: first,
          lastName: last,
          phone,
          address,
          notes,
          userId: user.uid,
        };

        if (latNum !== undefined) baseData.lat = latNum;
        if (lngNum !== undefined) baseData.lng = lngNum;

        await crearCliente(baseData);
      }

      await cargarClientes();
      alert("Importación completada ✅");
    } catch (error) {
      console.error("Error importando Excel:", error);
      alert("Hubo un problema al leer el archivo. Revisá el formato.");
    }
  };

  const handleExcelFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleImportExcel(file);
    e.target.value = "";
  };

  /**
   * Normalizar nombres existentes en Firestore
   */
  const handleFixNames = async () => {
    if (!user) return;

    const ok = confirm(
      "Esto separará automáticamente los nombres completos en Nombre + Apellido donde falte. ¿Querés continuar?"
    );
    if (!ok) return;

    try {
      await normalizarNombresClientes(user.uid);
      await cargarClientes();
      alert("Nombres normalizados correctamente ✅");
    } catch (error) {
      console.error("Error normalizando nombres:", error);
      alert("Ocurrió un error al normalizar los nombres. Revisá la consola.");
    }
  };

  /**
   * Crear / actualizar cliente
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const latNum = parseCoord(lat);
    const lngNum = parseCoord(lng);

    const baseData: any = {
      firstName,
      lastName,
      phone,
      address,
      notes,
      userId: user.uid,
    };

    if (latNum !== undefined) baseData.lat = latNum;
    if (lngNum !== undefined) baseData.lng = lngNum;

    if (editingId) {
      await actualizarCliente(editingId, baseData);
    } else {
      await crearCliente(baseData);
    }

    setFirstName("");
    setLastName("");
    setPhone("");
    setAddress("");
    setLat("");
    setLng("");
    setNotes("");
    setEditingId(null);
    setSelectedClientId(null);

    await cargarClientes();
  };

  /**
   * Editar cliente
   */
  const startEditing = (id: string) => {
    const c = clientes.find((cl) => cl.id === id);
    if (!c) return;

    setEditingId(c.id);
    setFirstName(c.firstName);
    setLastName(c.lastName);
    setPhone(c.phone);
    setAddress(c.address);
    setNotes(c.notes ?? "");
    setLat(c.lat?.toString() ?? "");
    setLng(c.lng?.toString() ?? "");

    setSelectedClientId(id);
  };

  /**
   * Borrar cliente
   */
  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés borrar este cliente?")) return;
    await borrarCliente(id);
    setSelectedClientId((prev) => (prev === id ? null : prev));
    await cargarClientes();
  };

  // Posición editable para el marcador del mapa
  const latNum = parseCoord(lat);
  const lngNum = parseCoord(lng);
  const editablePosition =
    latNum !== undefined && lngNum !== undefined
      ? { lat: latNum, lng: lngNum }
      : null;

  // 🔠 ORDENAMIENTO
  const sortedClientes = [...clientes].sort((a, b) => {
    const lastA = (a.lastName || "").trim().toLowerCase();
    const lastB = (b.lastName || "").trim().toLowerCase();
    const firstA = (a.firstName || "").trim().toLowerCase();
    const firstB = (b.firstName || "").trim().toLowerCase();

    if (sortMode === "nameAsc") {
      if (lastA !== lastB) return lastA.localeCompare(lastB);
      return firstA.localeCompare(firstB);
    }

    if (sortMode === "nameDesc") {
      if (lastA !== lastB) return lastB.localeCompare(lastA);
      return firstB.localeCompare(firstA);
    }

    if (sortMode === "coordsFirst") {
      const hasCoordsA = typeof a.lat === "number" && typeof a.lng === "number";
      const hasCoordsB = typeof b.lat === "number" && typeof b.lng === "number";

      if (hasCoordsA !== hasCoordsB) return hasCoordsA ? -1 : 1;

      if (lastA !== lastB) return lastA.localeCompare(lastB);
      return firstA.localeCompare(firstB);
    }

    if (sortMode === "addressAsc") {
      const dirA = (a.address || "").trim().toLowerCase();
      const dirB = (b.address || "").trim().toLowerCase();
      return dirA.localeCompare(dirB);
    }

    return 0;
  });

  // 🔍 FILTRO POR BUSCADOR (nombre, apellido, teléfono)
  const term = searchTerm.trim().toLowerCase();

  const filteredClientes = term
    ? sortedClientes.filter((c) => {
        const fullName = `${c.firstName || ""} ${c.lastName || ""}`
          .trim()
          .toLowerCase();
        const phone = (c.phone || "").toLowerCase();

        return fullName.includes(term) || phone.includes(term);
      })
    : sortedClientes;

  // 📄 PAGINACIÓN sobre la lista ORDENADA + FILTRADA
  const totalPages =
    filteredClientes.length === 0
      ? 1
      : Math.ceil(filteredClientes.length / pageSize);

  const safePage =
    currentPage > totalPages ? totalPages : currentPage < 1 ? 1 : currentPage;

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const visibleClients = filteredClientes.slice(startIndex, endIndex);

  const showingFrom = filteredClientes.length === 0 ? 0 : startIndex + 1;
  const showingTo =
    filteredClientes.length === 0
      ? 0
      : Math.min(endIndex, filteredClientes.length);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* HEADER */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-800 bg-slate-900">
        <h2 className="text-lg sm:text-xl font-semibold">Clientes</h2>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-300">{user?.email}</span>
          <button
            onClick={async () => {
              await signOut(auth);
              // navigate("/login");
            }}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 lg:gap-6">
          {/* MAPA */}
          <section className="h-[600px] rounded-xl border border-slate-800 overflow-hidden bg-slate-900">
            <ClientMap
              clientes={clientes}
              editablePosition={editablePosition}
              onEditableMove={(newLat, newLng) => {
                setLat(String(newLat));
                setLng(String(newLng));
              }}
              selectedClientId={selectedClientId}
            />
          </section>

          {/* PANEL DERECHO */}
          <section className="h-full flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Botones arriba del form */}
            <div className="flex flex-wrap gap-2 justify-end mb-1">
              <label className="inline-flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition">
                  Importar desde Excel
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleExcelFileChange}
                />
              </label>

              <button
                type="button"
                onClick={handleFixNames}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition"
              >
                Normalizar nombres
              </button>
            </div>

            <ClientForm
              firstName={firstName}
              lastName={lastName}
              phone={phone}
              address={address}
              lat={lat}
              lng={lng}
              notes={notes}
              editingId={editingId}
              onSubmit={handleSubmit}
              setFirstName={setFirstName}
              setLastName={setLastName}
              setPhone={setPhone}
              setAddress={setAddress}
              setLat={setLat}
              setLng={setLng}
              setNotes={setNotes}
              onExcelFileChange={handleExcelFileChange}
            />

            {/* Lista + orden + paginación */}
            <div className="space-y-3">
              {/* Buscador + selector de orden */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm">
                {/* Buscador */}
                <div className="flex-1">
                  <label className="block text-slate-300 mb-1">
                    Buscar (nombre, apellido o teléfono)
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // cuando busco, vuelvo a la primera página
                    }}
                    placeholder="Ej: Pérez, Alfonsina, 2954..."
                    className="
          w-full
          bg-slate-900 
          border border-slate-700 
          rounded-lg 
          px-3 
          py-1.5 
          text-sm 
          text-slate-100
          placeholder:text-slate-500
        "
                  />
                </div>

                {/* Selector de orden */}
                <div className="flex flex-col mt-2 sm:mt-0 sm:w-60">
                  <span className="font-medium text-slate-200 mb-1">
                    Ordenar por:
                  </span>
                  <select
                    value={sortMode}
                    onChange={(e) =>
                      setSortMode(
                        e.target.value as
                          | "nameAsc"
                          | "nameDesc"
                          | "coordsFirst"
                          | "addressAsc"
                      )
                    }
                    className="
          bg-slate-900 
          border border-slate-700 
          rounded-lg 
          px-3 
          py-1.5 
          text-sm 
          text-slate-100
        "
                  >
                    <option value="nameAsc">Apellido (A–Z)</option>
                    <option value="nameDesc">Apellido (Z–A)</option>
                    <option value="coordsFirst">Con coordenadas primero</option>
                    <option value="addressAsc">Dirección (A–Z)</option>
                  </select>
                </div>
              </div>

              <ClientList
                clients={visibleClients}
                onEdit={startEditing}
                onDelete={handleDelete}
                onSelect={(id) => setSelectedClientId(id)}
              />

              {/* Paginación abajo (la dejás igual pero usando filteredClientes.length) */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-slate-300">
                <span>
                  Mostrando {showingFrom}–{showingTo} de{" "}
                  {filteredClientes.length} clientes
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="px-2.5 py-1 rounded border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ◀ Anterior
                  </button>
                  <span>
                    Página {safePage} de {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={safePage >= totalPages}
                    className="px-2.5 py-1 rounded border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Siguiente ▶
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
