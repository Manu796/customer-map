// src/App.tsx
import { useEffect, useState, FormEvent } from "react";
import {
  crearCliente,
  obtenerClientes,
  actualizarCliente,
  borrarCliente,
  ClienteConId,
} from "./services/Clientes";
import "./App.css";

function App() {
  // Campos del formulario
  const [nombre, setNombre] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");

  // Lista de clientes
  const [clientes, setClientes] = useState<ClienteConId[]>([]);

  // Si hay un id acá, estamos editando ese cliente
  const [editingId, setEditingId] = useState<string | null>(null);

  // -----------------------------------------
  // Cargar clientes al montar el componente
  // -----------------------------------------
  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const lista = await obtenerClientes();
      setClientes(lista);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  };

  // -----------------------------------------
  // Manejar submit del formulario
  // (create o update según el caso)
  // -----------------------------------------
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre.trim()) return;

    try {
      if (editingId) {
        // UPDATE
        await actualizarCliente(editingId, {
          nombre,
          direccion,
        });
      } else {
        // CREATE
        await crearCliente({
          nombre,
          direccion,
          createdAt: new Date(),
        });
      }

      // Limpiar formulario
      setNombre("");
      setDireccion("");
      setEditingId(null);

      // Recargar lista
      await cargarClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  };

  // -----------------------------------------
  // Borrar cliente
  // -----------------------------------------
  const handleBorrar = async (id: string) => {
    try {
      await borrarCliente(id);
      await cargarClientes();
    } catch (error) {
      console.error("Error al borrar cliente:", error);
    }
  };

  // -----------------------------------------
  // Pasar un cliente al modo edición
  // -----------------------------------------
  const startEditing = (cliente: ClienteConId) => {
    setEditingId(cliente.id);
    setNombre(cliente.nombre);
    setDireccion(cliente.direccion ?? "");
  };

  return (
    <div className="App" style={{ padding: "1rem" }}>
      <h1>Clientes (CRUD con Firestore)</h1>

      {/* Formulario de alta / edición */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />

        <button type="submit" style={{ marginLeft: "0.5rem" }}>
          {editingId ? "Guardar cambios" : "Agregar"}
        </button>

        {editingId && (
          <button
            type="button"
            style={{ marginLeft: "0.5rem" }}
            onClick={() => {
              setEditingId(null);
              setNombre("");
              setDireccion("");
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <hr />

      {/* Lista de clientes */}
      <ul>
        {clientes.map((c) => (
          <li key={c.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{c.nombre}</strong>
            {c.direccion && <> — {c.direccion}</>}

            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => startEditing(c)}
            >
              Editar
            </button>

            <button
              style={{ marginLeft: "0.5rem", color: "red" }}
              onClick={() => handleBorrar(c.id)}
            >
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
