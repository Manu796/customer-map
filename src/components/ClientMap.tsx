// src/components/ClientMap.tsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { ClienteConId } from "../services/clientes";
import { Icon, LatLngExpression } from "leaflet";
import { useEffect } from "react";

/**
 * 🎨 Iconos para Leaflet
 * -----------------------
 * Usamos el set de Leaflet Color Markers:
 * https://github.com/pointhi/leaflet-color-markers
 *
 * - defaultIcon   → clientes normales
 * - selectedIcon  → cliente seleccionado (resaltado)
 * - editableIcon  → marcador editable (lat/lng del formulario)
 */

// 🟦 ICONO NORMAL (cliente cargado)
const defaultIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🟩 ICONO SELECCIONADO (destacado)
const selectedIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [30, 45], // un poco más grande para que resalte
  iconAnchor: [15, 45],
});

// 🟨 ICONO EDITABLE (arrastrable / elegido con click)
const editableIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});

/**
 * Props que recibe el mapa desde AppLayout
 */
interface ClientMapProps {
  // Todos los clientes del usuario
  clientes: ClienteConId[];

  // Punto editable (lat/lng que viene del formulario)
  editablePosition?: { lat: number; lng: number } | null;

  // Avisar al padre cuando cambia el punto editable
  onEditableMove?: (lat: number, lng: number) => void;

  // Cliente seleccionado (para centrar y destacar)
  selectedClientId?: string | null;
}

/**
 * Componente auxiliar:
 * - Escucha cambios en selectedClientId
 * - Busca el cliente en la lista
 * - Centra el mapa en su posición
 */
function CenterOnSelected({
  clientes,
  selectedClientId,
}: {
  clientes: ClienteConId[];
  selectedClientId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedClientId) return;

    const target = clientes.find(
      (c) =>
        c.id === selectedClientId &&
        typeof c.lat === "number" &&
        typeof c.lng === "number"
    );

    if (!target) return;

    const coords: LatLngExpression = [target.lat!, target.lng!];

    // flyTo = animación suave hacia el punto
    map.flyTo(coords, 16, { duration: 0.8 });
  }, [selectedClientId, clientes, map]);

  return null;
}

/**
 * Componente auxiliar:
 * - Escucha clicks en cualquier parte del mapa
 * - Llama a onSelect(lat, lng)
 * Esto nos permite:
 *  - Hacer click en el mapa y que se llenen lat/lng del formulario
 */
function MapClickHandler({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export function ClientMap({
  clientes,
  editablePosition = null,
  onEditableMove,
  selectedClientId = null,
}: ClientMapProps) {
  // Centro inicial del mapa → Santa Rosa
  const center: [number, number] = [-36.6167, -64.2833];

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={13}
        className="w-full h-full rounded-xl"
      >
        {/* Capa base de OpenStreetMap */}
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🖱 Click en el mapa → actualiza lat/lng del formulario */}
        {onEditableMove && (
          <MapClickHandler
            onSelect={(lat, lng) => {
              onEditableMove(lat, lng);
            }}
          />
        )}

        {/* 🎯 Centrar cuando cambia el cliente seleccionado */}
        <CenterOnSelected
          clientes={clientes}
          selectedClientId={selectedClientId ?? null}
        />

        {/* 🔵 Marcadores de clientes guardados */}
        {clientes
          .filter(
            (c) =>
              typeof c.lat === "number" &&
              typeof c.lng === "number" &&
              !Number.isNaN(c.lat) &&
              !Number.isNaN(c.lng)
          )
          .map((c) => {
            const isSelected = c.id === selectedClientId;

            // Elegimos ícono según esté seleccionado o no
            const icon = isSelected ? selectedIcon : defaultIcon;

            return (
              <Marker
                key={c.id}
                position={[c.lat as number, c.lng as number]}
                icon={icon}
              >
                <Popup>
                  <strong>
                    {c.firstName} {c.lastName}
                  </strong>
                  <br />
                  📍 {c.address}
                  <br />
                  🌐 {c.lat}, {c.lng}
                </Popup>
              </Marker>
            );
          })}

        {/* ✏️ Marcador editable (cuando el form tiene lat/lng) */}
        {editablePosition && (
          <Marker
            position={[editablePosition.lat, editablePosition.lng]}
            draggable={true}
            icon={editableIcon}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                onEditableMove?.(pos.lat, pos.lng);
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
