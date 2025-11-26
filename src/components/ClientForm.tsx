// src/components/ClientForm.tsx
import React, { useState, FormEvent } from "react";

interface Props {
  // Valores controlados (vienen del padre)
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  lat: string;
  lng: string;
  notes: string;
  editingId: string | null;

  // Handler de submit (lo define AppLayout)
  onSubmit: (e: FormEvent) => void;

  // Setters para actualizar estado en el padre
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setPhone: (v: string) => void;
  setAddress: (v: string) => void;
  setLat: (v: string) => void;
  setLng: (v: string) => void;
  setNotes: (v: string) => void;
}

/**
 * ClientForm con Tailwind + validación visual
 * -------------------------------------------
 * - Nombre y Apellido obligatorios
 * - Teléfono obligatorio y solo numérico
 * - Campo Notas opcional (textarea)
 */
export function ClientForm(props: Props) {
  const {
    firstName,
    lastName,
    phone,
    address,
    lat,
    lng,
    notes,
    editingId,
    onSubmit,
    setFirstName,
    setLastName,
    setPhone,
    setAddress,
    setLat,
    setLng,
    setNotes,
  } = props;

  // 🧠 Errores por campo
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = "El nombre es obligatorio.";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "El apellido es obligatorio.";
    }

    if (!phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio.";
    } else if (!/^[0-9]+$/.test(phone)) {
      newErrors.phone = "El teléfono debe contener solo números.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full
        mb-4
        rounded-xl
        border border-slate-800
        bg-slate-900
        px-4 py-4
        sm:px-6 sm:py-5
        shadow-md
      "
    >
      {/* Título */}
      <h3 className="mb-4 text-base sm:text-lg font-semibold text-slate-100">
        {editingId ? "Editar cliente" : "Agregar cliente"}
      </h3>

      {/* GRID principal */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-4
          mb-5
        "
      >
        {/* Nombre */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-300">
            Nombre <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`
              w-full rounded-lg px-3 py-2.5 text-sm
              text-slate-100 placeholder-slate-500
              outline-none transition bg-slate-950/60 border
              ${
                errors.firstName
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/60"
                  : "border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
              }
            `}
          />
          {errors.firstName && (
            <p className="text-xs text-red-400 mt-0.5">{errors.firstName}</p>
          )}
        </div>

        {/* Apellido */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-300">
            Apellido <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`
              w-full rounded-lg px-3 py-2.5 text-sm
              text-slate-100 placeholder-slate-500
              outline-none transition bg-slate-950/60 border
              ${
                errors.lastName
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/60"
                  : "border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
              }
            `}
          />
          {errors.lastName && (
            <p className="text-xs text-red-400 mt-0.5">{errors.lastName}</p>
          )}
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-300">
            Teléfono <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Solo números"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`
              w-full rounded-lg px-3 py-2.5 text-sm
              text-slate-100 placeholder-slate-500
              outline-none transition bg-slate-950/60 border
              ${
                errors.phone
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/60"
                  : "border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60"
              }
            `}
          />
          {errors.phone && (
            <p className="text-xs text-red-400 mt-0.5">{errors.phone}</p>
          )}
        </div>

        {/* Dirección */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-slate-300">
            Dirección
          </label>
          <input
            type="text"
            placeholder="Dirección"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="
              w-full rounded-lg border border-slate-700
              bg-slate-950/60 px-3 py-2.5 text-sm
              text-slate-100 placeholder-slate-500
              outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60
            "
          />
        </div>

        {/* Latitud */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-300">
            Latitud{" "}
            <span className="text-[10px] text-slate-400">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ej: -36.6384"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="
              w-full rounded-lg border border-slate-700
              bg-slate-950/60 px-3 py-2.5 text-sm
              text-slate-100 placeholder-slate-500
              outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60
            "
          />
        </div>

        {/* Longitud */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-300">
            Longitud{" "}
            <span className="text-[10px] text-slate-400">(opcional)</span>
          </label>
          <input
            type="text"
            placeholder="Ej: -64.2745"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="
              w-full rounded-lg border border-slate-700
              bg-slate-950/60 px-3 py-2.5 text-sm
              text-slate-100 placeholder-slate-500
              outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60
            "
          />
        </div>

        {/* Notas */}
        <div className="flex flex-col gap-1 md:col-span-3">
          <label className="text-xs font-medium text-slate-300">
            Notas <span className="text-[10px] text-slate-400">(opcional)</span>
          </label>
          <textarea
            placeholder="Ej: Cliente solo por la mañana, tiene portón eléctrico, dejar aviso si no está..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="
              w-full rounded-lg border border-slate-700
              bg-slate-950/60 px-3 py-2.5 text-sm
              text-slate-100 placeholder-slate-500
              outline-none resize-y
              transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/60
            "
          />
        </div>
      </div>

      {/* BOTÓN */}
      <button
        type="submit"
        className="
          inline-flex items-center
          px-4 py-2.5 rounded-lg
          bg-blue-600 hover:bg-blue-500
          text-sm font-semibold text-white
          shadow-sm transition
        "
      >
        {editingId ? "Guardar cambios" : "Agregar cliente"}
      </button>
    </form>
  );
}
