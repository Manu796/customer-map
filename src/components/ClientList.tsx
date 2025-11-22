import React from "react";
import {type ClienteConId } from "../services/clientes";

interface Props {
  clients: ClienteConId[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/*
  Componente Listado de Clientes
  ------------------------------

  Este componente recibe:
    - clients: listado de clientes desde Firestore
    - onEdit: función llamada cuando se hace clic en "Editar"
    - onDelete: función llamada cuando se hace clic en "Eliminar"

  El objetivo es renderizar cada cliente como una "tarjeta" limpia y moderna,
  similar al estilo WhatsApp Business / panel administrativo.
*/

export function ClientList({ clients, onEdit, onDelete }: Props) {
  return (
    <div
      style={{
        background: "#111",            // Fondo oscuro principal
        padding: "1.2rem",
        borderRadius: "0.7rem",
        border: "1px solid #333",
      }}
    >
      <h3
        style={{
          marginBottom: "1.2rem",
          fontSize: "1.2rem",
          fontWeight: 600,
        }}
      >
        Clientes cargados
      </h3>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {clients.map((c) => (
          <li
            key={c.id}
            style={{
              background: "#1b1b1b",        // Tarjeta oscura
              borderRadius: "0.6rem",
              padding: "1rem",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 0 10px rgba(0,0,0,0.25)", // Sombra suave
            }}
          >
            {/* CONTENIDO IZQUIERDA: Info del cliente */}
            <div>
              {/* Nombre completo */}
              <strong style={{ fontSize: "1.1rem" }}>
                {c.firstName} {c.lastName}
              </strong>

              {/* Detalles */}
              <div
                style={{
                  marginTop: "0.35rem",
                  fontSize: "0.95rem",
                  lineHeight: "1.35rem",
                  color: "#ccc",
                }}
              >
                {/* Dirección */}
                <div>📍 Dirección: {c.address || "—"}</div>

                {/* Estado */}
                <div>
                  🔵 Estado:{" "}
                  <span
                    style={{
                      fontWeight: 600,
                      color: c.status === "activo" ? "#4ade80" : "#f87171",
                    }}
                  >
                    {c.status || "—"}
                  </span>
                </div>

                {/* Latitud & Longitud */}
                <div>
                  🌐 Lat/Lng:{" "}
                  {c.lat !== undefined && c.lng !== undefined
                    ? `${c.lat}, ${c.lng}`
                    : "No asignado"}
                </div>
              </div>
            </div>

            {/* BOTONES DERECHA */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {/* BOTÓN EDITAR */}
              <button
                onClick={() => onEdit(c.id)}
                style={{
                  padding: "0.45rem 0.9rem",
                  background: "#3b82f6",        // Azul estilo Tailwind
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.35rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#2563eb") // Hover más oscuro
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#3b82f6")
                }
              >
                Editar
              </button>

              {/* BOTÓN ELIMINAR */}
              <button
                onClick={() => onDelete(c.id)}
                style={{
                  padding: "0.45rem 0.9rem",
                  background: "#dc2626",        // Rojo peligro
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.35rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#b91c1c")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#dc2626")
                }
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
