import { useState } from "react";

interface Props {
  filter: any;
  setFilter: (updater: (prev: any) => any) => void;
}

export function SmartFilterRadio({ filter, setFilter }: Props) {
  const [km, setKm] = useState(filter?.near?.km ?? 3);

  const activarGPS = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        console.log("📍 Ubicación obtenida:", { latitude, longitude });

        setFilter((prev: any) => ({
          ...prev,
          near: {
            lat: latitude,
            lng: longitude,
            km,
          },
        }));
      },
      (err) => {
        console.error("❌ Error geolocalización:", err);

        alert(
          `No se pudo obtener tu ubicación.
          
Código: ${err.code}
Mensaje: ${err.message}

Voy a usar una ubicación por defecto (centro de Santa Rosa) para que puedas probar el filtro.`
        );

        // Fallback: centro de Santa Rosa
        const fallbackLat = -36.6167;
        const fallbackLng = -64.2833;

        setFilter((prev: any) => ({
          ...prev,
          near: {
            lat: fallbackLat,
            lng: fallbackLng,
            km,
          },
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 flex items-center gap-4 shadow">
      {/* Input de KM */}
      <div className="flex items-center gap-2">
        <label className="font-medium text-slate-200">Radio:</label>
        <input
          type="number"
          className="border rounded px-2 py-1 w-20 bg-slate-800 text-slate-100"
          value={km}
          onChange={(e) => setKm(Number(e.target.value))}
        />
        <span className="text-slate-400">km</span>
      </div>

      {/* Botón para activar GPS */}
      <button
        onClick={activarGPS}
        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded shadow"
      >
        Cerca de mí (GPS)
      </button>

      {/* Botón reset */}
      <button
        onClick={() =>
          setFilter((prev: any) => ({
            ...prev,
            near: null,
          }))
        }
        className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded"
      >
        Reset
      </button>
    </div>
  );
}
