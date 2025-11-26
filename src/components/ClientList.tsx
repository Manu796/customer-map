// src/components/ClientList.tsx
import React from "react";
import type { ClienteConId } from "../services/clientes";

interface Props {
  clients: ClienteConId[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
}

export function ClientList({ clients, onEdit, onDelete, onSelect }: Props) {
  return (
    <div
      className="
        bg-slate-900 
        border border-slate-700 
        rounded-xl 
        p-4 
        sm:p-6 
        shadow-lg
      "
    >
      <h3 className="text-lg font-semibold text-slate-100 mb-4">
        Clientes cargados
      </h3>

      <ul className="space-y-4">
        {clients.map((c) => (
          <li
            key={c.id}
            onClick={() => onSelect?.(c.id)}
            className="
              bg-slate-800 
              border border-slate-700 
              rounded-lg 
              p-4 
              flex 
              flex-col 
              sm:flex-row 
              sm:items-center 
              sm:justify-between 
              gap-4
              shadow-md
              hover:border-blue-500
              hover:bg-slate-750/80
              cursor-pointer
              transition-all
            "
          >
            {/* INFO IZQUIERDA */}
            <div>
              <p className="text-slate-100 text-lg font-semibold">
                {c.firstName} {c.lastName}
              </p>

              <div className="text-slate-400 text-sm mt-2 space-y-1">
                {/* Teléfono */}
                <div>
                  <span className="text-slate-500">📞 Teléfono:</span>{" "}
                  {c.phone || "—"}
                </div>

                {/* Dirección */}
                <div>
                  <span className="text-slate-500">📍 Dirección:</span>{" "}
                  {c.address || "—"}
                </div>

                {/* Notas (si hay) */}
                {c.notes && c.notes.trim() !== "" && (
                  <div>
                    <span className="text-slate-500">📝 Notas:</span>{" "}
                    <span className="break-words">{c.notes}</span>
                  </div>
                )}

                {/* Lat/Lng */}
                <div>
                  <span className="text-slate-500">🌐 Lat/Lng:</span>{" "}
                  {typeof c.lat === "number" &&
                  typeof c.lng === "number" &&
                  !Number.isNaN(c.lat) &&
                  !Number.isNaN(c.lng)
                    ? `${c.lat}, ${c.lng}`
                    : "No asignado"}
                </div>
              </div>
            </div>

            {/* BOTONES DERECHA */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex gap-2 sm:gap-3"
            >
              <button
                onClick={() => onEdit(c.id)}
                className="
                  px-3 
                  py-2 
                  bg-blue-600 
                  hover:bg-blue-500 
                  text-white 
                  rounded-lg 
                  text-sm 
                  font-medium 
                  transition
                "
              >
                Editar
              </button>

              <button
                onClick={() => onDelete(c.id)}
                className="
                  px-3 
                  py-2 
                  bg-red-600 
                  hover:bg-red-500 
                  text-white 
                  rounded-lg 
                  text-sm 
                  font-medium 
                  transition
                "
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
