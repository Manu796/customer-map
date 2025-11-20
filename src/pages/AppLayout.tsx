import { useEffect, useState, FormEvent } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  borrarCliente,
  type ClienteConId,
} from "../services/clientes";

function AppLayout() {
  //Estados dentro del componente
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clientes, setClientes] = useState<ClienteConId[]>([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("activo");

  const [editingId, setEditingId] = useState<string | null>(null);

  //Cargar clientes cuando haya usuario
  useEffect(() => {
    if (!user) return;
    cargarClientes();
  }, [user]);

  const cargarClientes = async () => {
    if (!user) return;
    const lista = await obtenerClientes(user.uid);
    setClientes(lista);
  };

  //Submit del form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editingId) {
      await actualizarCliente(editingId, {
        firstName,
        lastName,
        phone,
        address,
        status,
      });
    } else {
      await crearCliente({
        firstName,
        lastName,
        phone,
        address,
        status,
        userId: user.uid,
      });
    }
    //Limpiar form
    setFirstName("");
    setLastName("");
    setPhone("");
    setAddress("");
    setStatus("activo");
    setEditingId(null);

    await cargarClientes();
  };

  //Editar / borrar
  const startEditing = (c: ClienteConId) => {
    setEditingId(c.id);
    setFirstName(c.firstName);
    setLastName(c.lastName);
    setPhone(c.phone);
    setAddress(c.address);
    setStatus(c.status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés borrar este cliente?")) return;

    await borrarCliente(id);
    await cargarClientes(); // refresca la lista
  };

  //Render simple
  return (
    <div style={{ padding: "1rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h2>Clientes</h2>
        <div>
          {user?.email}
          <button
            onClick={async () => {
              await signOut(auth);
            }}
            style={{ marginLeft: "1rem" }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <input
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <input
          placeholder="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        >
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
        </select>

        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          {editingId ? "Actualizar" : "Agregar"}
        </button>
        {editingId && (
          <button
            type="button"
            style={{ marginLeft: "0.5rem" }}
            onClick={() => setEditingId(null)}
          >
            Cancelar
          </button>
        )}
      </form>

      {/* LISTA */}
      <ul>
        {clientes.map((c) => (
          <li key={c.id} style={{ marginBottom: "0.5rem" }}>
            <strong>
              {c.firstName} {c.lastName}
            </strong>
            {" — "} {c.phone}
            {c.address && ` — ${c.address}`}
            {" — "} {c.status}
            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => startEditing(c)}
            >
              Editar
            </button>
            <button
              style={{ marginLeft: "0.5rem", color: "red" }}
              onClick={() => handleDelete(c.id)}
            >
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppLayout;
