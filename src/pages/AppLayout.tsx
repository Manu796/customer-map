// src/layouts/AppLayout.tsx (o donde lo tengas)
import { useEffect, useState, FormEvent } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { ClientMap } from "../components/ClientMap";
import { ClientForm } from "../components/ClientForm";
import { ClientList } from "../components/ClientList";
import {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  borrarCliente,
  type ClienteConId,
} from "../services/clientes";

/**
 * 🔢 parseCoord
 * --------------
 * Convierte un string (con punto o coma) a número.
 * Si no se puede convertir, devuelve undefined.
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

  // 📦 Estado: lista de clientes
  const [clientes, setClientes] = useState<ClienteConId[]>([]);

  // 📦 Estado: formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lat, setLat] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [lng, setLng] = useState<string>("");

  // 📌 Nuevo: cliente seleccionado para centrar/destacar en el mapa
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // 🔁 Cargar clientes cuando haya usuario logueado
  useEffect(() => {
    if (!user) return;
    cargarClientes();
  }, [user]);

  const cargarClientes = async () => {
    if (!user) return;
    const lista = await obtenerClientes(user.uid);
    setClientes(lista);
  };

  /**
   * 📝 handleSubmit
   * ----------------
   * Maneja crear o actualizar un cliente según haya editingId o no.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const latNum = parseCoord(lat);
    const lngNum = parseCoord(lng);

    // Data base para Firestore
    const baseData: any = {
      firstName,
      lastName,
      phone,
      address,
      notes, // 👈 acá
      userId: user.uid,
    };

    // Solo agregamos lat/lng si son válidos
    if (latNum !== undefined) baseData.lat = latNum;
    if (lngNum !== undefined) baseData.lng = lngNum;

    if (editingId) {
      await actualizarCliente(editingId, baseData);
    } else {
      await crearCliente(baseData);
    }

    // 🧹 Limpiar form
    setFirstName("");
    setLastName("");
    setPhone("");
    setAddress("");
    setLat("");
    setLng("");
    setEditingId(null);
    setNotes("");

    // También podríamos limpiar la selección
    setSelectedClientId(null);

    await cargarClientes();
  };

  /**
   * ✏️ startEditing
   * ----------------
   * Carga los datos del cliente en el formulario para poder editarlos.
   * Además, marcamos ese cliente como "seleccionado" para centrarlo en el mapa.
   */
  const startEditing = (id: string) => {
    const c = clientes.find((cl) => cl.id === id);
    if (!c) return;

    setEditingId(c.id);
    setFirstName(c.firstName);
    setLastName(c.lastName);
    setPhone(c.phone);
    setAddress(c.address);
    setNotes(c.notes ?? ""); // suponiendo que agregues notes?: string al tipo
    setLat(c.lat?.toString() ?? "");
    setLng(c.lng?.toString() ?? "");

    // 👉 al editar, también lo marcamos como seleccionado en el mapa
    setSelectedClientId(id);
  };

  /**
   * 🗑 handleDelete
   * ----------------
   * Borra un cliente con confirmación.
   */
  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés borrar este cliente?")) return;
    await borrarCliente(id);
    // Si borramos el cliente seleccionado, limpiamos la selección
    setSelectedClientId((prev) => (prev === id ? null : prev));
    await cargarClientes();
  };

  // 👉 posición editable para el marcador del mapa (modo "nuevo" o edición manual)
  const latNum = parseCoord(lat);
  const lngNum = parseCoord(lng);
  const editablePosition =
    latNum !== undefined && lngNum !== undefined
      ? { lat: latNum, lng: lngNum }
      : null;

  return (
    // 🧱 Layout raíz: pantalla completa, fondo gris oscuro
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* HEADER */}
      <header
        className="
          h-16 
          flex 
          items-center 
          justify-between 
          px-4 
          sm:px-6 
          border-b 
          border-slate-800 
          bg-slate-900
        "
      >
        <h2 className="text-lg sm:text-xl font-semibold">Clientes</h2>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-300">{user?.email}</span>
          <button
            onClick={async () => {
              await signOut(auth);
              // Si querés, podés navegar a login después:
              // navigate("/login");
            }}
            className="
              px-3 
              py-1.5 
              rounded-lg 
              bg-red-600 
              hover:bg-red-500 
              text-white 
              text-xs 
              font-medium 
              transition
            "
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main
        className="
          flex-1 
          p-3 
          sm:p-4 
          lg:p-6 
          overflow-hidden
        "
      >
        {/* GRID principal: mapa + panel derecho */}
        <div
          className="
            h-full 
            grid 
            grid-cols-1 
            lg:grid-cols-[1.4fr_1fr] 
            gap-4 
            lg:gap-6
          "
        >
          {/* 🗺️ MAPA */}
          <section
            className="
              h-64 
              lg:h-full 
              rounded-xl 
              border 
              border-slate-800 
              overflow-hidden 
              bg-slate-900
            "
          >
            <ClientMap
              clientes={clientes}
              editablePosition={editablePosition}
              onEditableMove={(newLat, newLng) => {
                // cuando movés el marcador editable, actualizamos el form
                setLat(String(newLat));
                setLng(String(newLng));
              }}
              // 💡 Nuevo prop: quién está seleccionado
              selectedClientId={selectedClientId}
            />
          </section>

          {/* 📋 PANEL DERECHO: formulario + listado, con scroll propio */}
          <section
            className="
              h-full 
              flex 
              flex-col 
              gap-4 
              overflow-y-auto 
              pr-1
            "
          >
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
            />

            <ClientList
              clients={clientes}
              onEdit={startEditing}
              onDelete={handleDelete}
              // 👉 Al hacer clic en una card, seleccionamos el cliente para el mapa
              onSelect={(id) => setSelectedClientId(id)}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
