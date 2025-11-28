import { type ClienteConId } from "../services/clientes";

interface ClientListItemProps {
  cliente: ClienteConId;
  isSelected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientListItem({
  cliente,
  isSelected,
  onClick,
  onEdit,
  onDelete,
}: ClientListItemProps) {
  const hasLocation = typeof cliente.lat === "number" && typeof cliente.lng === "number";
  const googleMapsUrl = hasLocation
    ? `https://www.google.com/maps/dir/?api=1&destination=${cliente.lat},${cliente.lng}`
    : null;

  return (
    <div
      className={`w-full text-left px-3 sm:px-4 py-3 transition-colors ${
        isSelected
          ? "!bg-sky-100 dark:!bg-sky-600/20 border-l-2 border-sky-500"
          : "!bg-slate-50 dark:!bg-transparent hover:!bg-slate-100 dark:hover:!bg-slate-800/50"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button onClick={onClick} className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate !text-slate-900 dark:!text-slate-100">
              {cliente.firstName} {cliente.lastName}
            </p>
            {hasLocation ? (
              <span className="text-xs">📍</span>
            ) : (
              <span className="text-xs opacity-40">📌</span>
            )}
          </div>
          {cliente.phone && (
            <p className="text-xs !text-slate-600 dark:!text-slate-400 mt-0.5">{cliente.phone}</p>
          )}
          {cliente.address && (
            <p className="text-xs !text-slate-500 dark:!text-slate-500 mt-0.5 truncate">
              {cliente.address}
            </p>
          )}
        </button>

        {/* Action Buttons - Touch Friendly */}
        <div className="flex gap-1">
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 transition-colors touch-manipulation"
              title="Abrir en Google Maps"
              onClick={(e) => e.stopPropagation()}
            >
              🗺️
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 rounded-lg hover:bg-sky-100 dark:hover:bg-sky-600/20 text-sky-600 dark:text-sky-400 transition-colors touch-manipulation"
            title="Editar cliente"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-600/20 text-red-600 dark:text-red-400 transition-colors touch-manipulation"
            title="Eliminar cliente"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
