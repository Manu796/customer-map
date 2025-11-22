import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { ClienteConId } from "../services/clientes";
import { Icon } from "leaflet";

//Icono basico para los marcadores
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface ClientMapProps {
  clientes: ClienteConId[];
}

export function ClientMap({ clientes }: ClientMapProps) {
  //Centro del mapa
  const center: [number, number] = [-36.6167, -64.2833];

  return (
    <MapContainer //div del mapa
      center={center}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      {/* Mapa base (tiles) de OpenStreetMap, gratis */}
      <TileLayer //baldositas del mapa
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marcadores */}
      {clientes
        .filter(
          (c) =>
            typeof c.lat === "number" &&
            typeof c.lng === "number" &&
            !Number.isNaN(c.lat) &&
            !Number.isNaN(c.lng)
        )
        .map((c) => (
          <Marker
            key={c.id}
            position={[c.lat as number, c.lng as number]}
            icon={defaultIcon}
          >
            ...
          </Marker>
        ))}
    </MapContainer>
  );
}
