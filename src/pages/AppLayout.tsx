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

function parseCoord(value: string): number | undefined {
  if (!value) return undefined;
  const normalized = value.replace(",", ".");
  const num = Number(normalized);
  return Number.isNaN(num) ? undefined : num;
}

function AppLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clientes, setClientes] = useState<ClienteConId[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<string>("activo");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    cargarClientes();
  }, [user]);

  const cargarClientes = async () => {
    if (!user) return;
    const lista = await obtenerClientes(user.uid);
    setClientes(lista);
  };

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
      status,
      userId: user.uid,
    };

    if (latNum !== undefined) baseData.lat = latNum;
    if (lngNum !== undefined) baseData.lng = lngNum;

    if (editingId) {
      await actualizarCliente(editingId, baseData);
    } else {
      await crearCliente(baseData);
    }

    // limpiar inputs
    setFirstName("");
    setLastName("");
    setPhone("");
    setAddress("");
    setStatus("activo");
    setLat("");
    setLng("");
    setEditingId(null);

    await cargarClientes();
  };

  const startEditing = (id: string) => {
    const c = clientes.find((cl) => cl.id === id);
    if (!c) return;
    setEditingId(c.id);
    setFirstName(c.firstName);
    setLastName(c.lastName);
    setPhone(c.phone);
    setAddress(c.address);
    setStatus(c.status ?? "activo");
    setLat(c.lat?.toString() ?? "");
    setLng(c.lng?.toString() ?? "");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés borrar este cliente?")) return;
    await borrarCliente(id);
    await cargarClientes();
  };

  // 👉 posición editable para el marcador del mapa
  const latNum = parseCoord(lat);
  const lngNum = parseCoord(lng);
  const editablePosition =
    latNum !== undefined && lngNum !== undefined
      ? { lat: latNum, lng: lngNum }
      : null;

  
    return (
  <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
    {/* HEADER */}
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        height: "70px", // altura fija del header
        flexShrink: 0,
      }}
    >
      <h2>Clientes</h2>
      <div>
        {user?.email}
        <button
          onClick={async () => await signOut(auth)}
          style={{ marginLeft: "1rem" }}
        >
          Cerrar sesión
        </button>
      </div>
    </header>

    {/* CONTENEDOR PRINCIPAL SIN SCROLL GENERAL */}
    <main
      style={{
        flex: 1,                       // ← ocupa todo lo que queda de la pantalla
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: "1rem",
        padding: "1rem",
        overflow: "hidden",            // ← evita scroll en la página completa
      }}
    >
      {/* MAPA - ocupa todo el alto disponible */}
      <section
        style={{
          height: "100%",
          overflow: "hidden",
          borderRadius: "0.7rem",
        }}
      >
        <ClientMap
          clientes={clientes}
          editablePosition={editablePosition}
          onEditableMove={(newLat, newLng) => {
            setLat(String(newLat));
            setLng(String(newLng));
          }}
        />
      </section>

      {/* COLUMNA DERECHA: SCROLL INTERNO */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          height: "100%",
          overflowY: "auto",          // ← SOLO el panel derecho scrollea
          paddingRight: "0.5rem",
        }}
      >
        <ClientForm
          firstName={firstName}
          lastName={lastName}
          phone={phone}
          address={address}
          lat={lat}
          lng={lng}
          status={status}
          editingId={editingId}
          onSubmit={handleSubmit}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setPhone={setPhone}
          setAddress={setAddress}
          setLat={setLat}
          setLng={setLng}
          setStatus={setStatus}
        />

        <ClientList
          clients={clientes}
          onEdit={startEditing}
          onDelete={handleDelete}
        />
      </section>
    </main>
  </div>
);

}

export default AppLayout;
