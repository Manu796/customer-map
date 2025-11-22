import React from "react";

interface Props {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  lat: string;
  lng: string;
  status: string;
  editingId: string | null;
  onSubmit: (e: React.FormEvent) => void;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setPhone: (v: string) => void;
  setAddress: (v: string) => void;
  setLat: (v: string) => void;
  setLng: (v: string) => void;
  setStatus: (v: string) => void;
}

/*
  Versión corregida:

  ✔ Inputs con espacio entre sí
  ✔ Grid con más separación vertical
  ✔ Focus visual sin romper tamaño
  ✔ No se superponen nunca
*/

export function ClientForm(props: Props) {
  const {
    firstName,
    lastName,
    phone,
    address,
    lat,
    lng,
    status,
    editingId,
    onSubmit,
    setFirstName,
    setLastName,
    setPhone,
    setAddress,
    setLat,
    setLng,
    setStatus,
  } = props;

  // Estilos base del input: SE USA EN BLUR TAMBIÉN
  const baseInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem 1rem",
    background: "#1b1b1b",
    border: "1px solid #333",
    borderRadius: "0.55rem",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    transition: "0.2s",

    // 👇 SEPARA visualmente las columnas
    marginRight: "0.5rem",
    marginLeft: "0.5rem",
  };

  const applyFocus = (e: any) => {
    Object.assign(e.target.style, {
      border: "1px solid #3b82f6",
      boxShadow: "0 0 0 2px rgba(59,130,246,0.25)",
    });
  };

  const applyBlur = (e: any) => {
    Object.assign(e.target.style, baseInputStyle);
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: "#111",
        padding: "1.2rem",
        borderRadius: "0.7rem",
        border: "1px solid #333",
        marginBottom: "1rem",
      }}
    >
      <h3
        style={{
          marginBottom: "1rem",
          fontSize: "1.2rem",
          fontWeight: 600,
        }}
      >
        {editingId ? "Editar cliente" : "Agregar cliente"}
      </h3>

      {/* GRID de 3 columnas con más separación */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "1.4rem",
        }}
      >
        {/* Primera fila */}
        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={baseInputStyle}
          onFocus={applyFocus}
          onBlur={applyBlur}
        />

        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={baseInputStyle}
          onFocus={applyFocus}
          onBlur={applyBlur}
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={baseInputStyle}
          onFocus={applyFocus}
          onBlur={applyBlur}
        />

        {/* Dirección — fila completa */}
        <input
          type="text"
          placeholder="Dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ ...baseInputStyle, gridColumn: "span 3" }}
          onFocus={applyFocus}
          onBlur={applyBlur}
        />

        {/* Latitud */}
        <input
          type="text"
          placeholder="Latitud"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          style={baseInputStyle}
          onFocus={applyFocus}
          onBlur={applyBlur}
        />

        {/* Longitud */}
        <input
          type="text"
          placeholder="Longitud"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          style={baseInputStyle}
          onFocus={applyFocus}
          onBlur={applyBlur}
        />

        {/* Estado */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{
            ...baseInputStyle,
            appearance: "none",
            cursor: "pointer",
          }}
          onFocus={applyFocus}
          onBlur={applyBlur}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>

      {/* BOTÓN */}
      <button
        type="submit"
        style={{
          background: "#3b82f6",
          padding: "0.7rem 1.2rem",
          borderRadius: "0.45rem",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: 600,
          width: "fit-content",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
      >
        {editingId ? "Guardar cambios" : "Agregar cliente"}
      </button>
    </form>
  );
}
