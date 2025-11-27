import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { ClienteConId } from "../services/clientes";
import { Icon, LatLngExpression } from "leaflet";
import * as L from "leaflet";
import { useEffect } from "react";
import "leaflet.markercluster";

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

interface ClientMapProps {
  clientes: ClienteConId[];
  editablePosition?: { lat: number; lng: number } | null;
  onEditableMove?: (lat: number, lng: number) => void;
  selectedClientId?: string | null;
}

/**
 * Centra el mapa cuando cambia el cliente seleccionado
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

    map.flyTo(coords, 16, { duration: 0.8 });
  }, [selectedClientId, clientes, map]);

  return null;
}

/**
 * Click en el mapa → actualiza lat/lng del formulario
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

function FixMapResize() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  }, [map]);

  return null;
}

/**
 * 🔵 Marcadores de clientes agrupados en clusters
 */
function ClientMarkersCluster({
  clientes,
  selectedClientId,
}: {
  clientes: ClienteConId[];
  selectedClientId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Creamos el grupo de clusters
    const clusterGroup = (L as any).markerClusterGroup();

    clientes
      .filter(
        (c) =>
          typeof c.lat === "number" &&
          typeof c.lng === "number" &&
          !Number.isNaN(c.lat) &&
          !Number.isNaN(c.lng)
      )
      .forEach((c) => {
        const isSelected = c.id === selectedClientId;
        const icon = isSelected ? selectedIcon : defaultIcon;

        const marker = L.marker([c.lat as number, c.lng as number], {
          icon,
        });

        const popupHtml = `
          <div>
            <strong>${c.firstName ?? ""} ${c.lastName ?? ""}</strong><br/>
            📍 ${c.address || "Sin dirección"}<br/>
            🌐 ${c.lat}, ${c.lng}<br/>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${
                c.lat
              },${c.lng}" 
              target="_blank" 
              rel="noopener noreferrer"
              style="color:#3b82f6;font-weight:600;text-decoration:underline;"
            >
              Cómo llegar 🚗
            </a>
          </div>
        `;

        marker.bindPopup(popupHtml);
        clusterGroup.addLayer(marker);
      });

    map.addLayer(clusterGroup);

    // Cleanup al cambiar clientes / desmontar
    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, clientes, selectedClientId]);

  return null;
}

export function ClientMap({
  clientes,
  editablePosition = null,
  onEditableMove,
  selectedClientId = null,
}: ClientMapProps) {
  const center: [number, number] = [-36.6167, -64.2833];

  return (
    <div className="h-full relative">
      <div className="absolute inset-0">
        <MapContainer
          center={center}
          zoom={13}
          className="w-full h-full rounded-xl"
        >
          <FixMapResize />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {onEditableMove && (
            <MapClickHandler
              onSelect={(lat, lng) => {
                onEditableMove(lat, lng);
              }}
            />
          )}

          <CenterOnSelected
            clientes={clientes}
            selectedClientId={selectedClientId ?? null}
          />

          {/* 🔵 Marcadores agrupados en clusters */}
          <ClientMarkersCluster
            clientes={clientes}
            selectedClientId={selectedClientId ?? null}
          />

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
    </div>
  );
}
