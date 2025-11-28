// src/components/ClientMap.tsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { ClienteConId } from "../services/clientes";
import { Icon, LatLngExpression } from "leaflet";
import * as L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet.markercluster";

/**
 * 🎨 ICONOS
 */
const defaultIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});

const editableIcon = new Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});

/**
 * Props actualizados → incluye el filtro
 */
interface ClientMapProps {
  clientes: ClienteConId[];
  editablePosition?: { lat: number; lng: number } | null;
  onEditableMove?: (lat: number, lng: number) => void;
  selectedClientId?: string | null;
  filter?: any; // 🔵 agregado
}

/**
 * 🧭 Centrar mapa al seleccionar cliente
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
 * 🖱 Click en el mapa → actualizar lat/lng editable
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

/**
 * 🩹 Fix para que el mapa no aparezca cortado
 */
function FixMapResize() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 150);
  }, [map]);
  return null;
}

/**
 * 🔵 CLUSTERING + Apertura automática
 */
function ClientMarkersCluster({
  clientes,
  selectedClientId,
}: {
  clientes: ClienteConId[];
  selectedClientId: string | null;
}) {
  const map = useMap();

  const markerRefs = useRef<Record<string, L.Marker>>({});
  const clusterGroupRef = useRef<any>(null);

  const createClusterIcon = (cluster: any) => {
    const count = cluster.getChildCount();
    return L.divIcon({
      html: `<div class="cluster-bubble">${count}</div>`,
      className: "cluster-custom",
      iconSize: L.point(40, 40, true),
    });
  };

  useEffect(() => {
    if (!map) return;

    markerRefs.current = {};

    const clusterGroup = (L as any).markerClusterGroup({
      iconCreateFunction: createClusterIcon,
      chunkedLoading: true,
      spiderfyOnEveryZoom: false,
      showCoverageOnHover: false,
    });

    clusterGroupRef.current = clusterGroup;

    clientes
      .filter(
        (c) =>
          typeof c.lat === "number" &&
          typeof c.lng === "number" &&
          !Number.isNaN(c.lat) &&
          !Number.isNaN(c.lng)
      )
      .forEach((c) => {
        const icon = c.id === selectedClientId ? selectedIcon : defaultIcon;
        const marker = L.marker([c.lat!, c.lng!], { icon });

        marker.bindPopup(`
          <div style="font-size:14px; line-height:1.3">
            <strong>${c.firstName ?? ""} ${c.lastName ?? ""}</strong><br/>
            📍 ${c.address || "Sin dirección"}<br/>
            🌐 ${c.lat}, ${c.lng}<br/>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=${
                c.lat
              },${c.lng}"
              target="_blank"
              style="color:#3b82f6; font-weight:600; text-decoration:underline;"
            >
              Cómo llegar 🚗
            </a>
          </div>
        `);

        markerRefs.current[c.id] = marker;
        clusterGroup.addLayer(marker);
      });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [map, clientes, selectedClientId]);

  /** Abrir clúster automáticamente */
  useEffect(() => {
    if (!selectedClientId) return;
    if (!clusterGroupRef.current) return;

    const marker = markerRefs.current[selectedClientId];
    if (!marker) return;

    clusterGroupRef.current.zoomToShowLayer(marker, () => {
      const pos = marker.getLatLng();
      map.flyTo(pos, 18, { duration: 0.5 });
      marker.openPopup();
    });
  }, [selectedClientId, map]);

  return null;
}

/**
 * 🔵 Círculo del filtro (Google Maps style)
 */
function FilterCircle({ filter }: { filter: any }) {
  if (!filter?.near) return null;

  const center: LatLngExpression = [filter.near.lat, filter.near.lng];
  const radius = filter.near.km * 1000;

  return (
    <>
      <Circle
        center={center}
        radius={radius}
        pathOptions={{
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.18,
          weight: 2,
        }}
      />

      <Popup position={center}>
        <div style={{ fontSize: "14px" }}>Radio: {filter.near.km} km</div>
      </Popup>
    </>
  );
}

/**
 * 🗺️ COMPONENTE PRINCIPAL DEL MAPA
 */
export function ClientMap({
  clientes,
  editablePosition = null,
  onEditableMove,
  selectedClientId = null,
  filter = null,
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

          {/* Click para mover marcador editable */}
          {onEditableMove && (
            <MapClickHandler
              onSelect={(lat, lng) => onEditableMove(lat, lng)}
            />
          )}

          {/* 🔵 Círculo del filtro */}
          <FilterCircle filter={filter} />

          {/* Centrar cliente */}
          <CenterOnSelected
            clientes={clientes}
            selectedClientId={selectedClientId}
          />

          {/* Clustering */}
          <ClientMarkersCluster
            clientes={clientes}
            selectedClientId={selectedClientId}
          />

          {/* Marcador editable */}
          {editablePosition && (
            <Marker
              position={[editablePosition.lat, editablePosition.lng]}
              draggable={true}
              icon={editableIcon}
              eventHandlers={{
                dragend: (e) => {
                  const pos = e.target.getLatLng();
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
