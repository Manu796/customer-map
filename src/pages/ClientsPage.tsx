import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useDebounce } from "../hooks/useDebounce";
import { 
  obtenerClientes, 
  crearCliente, 
  actualizarCliente,
  borrarCliente,
  type ClienteConId 
} from "../services/clientes";
import { ClientMap } from "../components/ClientMap";
import { ClientForm } from "../components/ClientForm";
import { ClientListItem } from "../components/ClientListItem";
import { SkeletonListItem } from "../components/Skeletons";

export default function ClientsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [clientes, setClientes] = useState<ClienteConId[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300); // 300ms debounce
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClienteConId | null>(null);
  const [zoneFilter, setZoneFilter] = useState<"all" | "with-location" | "without-location">("all");
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");
const [lat, setLat] = useState("");
const [lng, setLng] = useState("");
const [notes, setNotes] = useState("");
const [editingId, setEditingId] = useState<string | null>(null);

const ITEMS_PER_PAGE = 50;

const loadClientes = async () => {
  if (!user) return;
  try {
    const data = await obtenerClientes(user.uid);
    setClientes(data);
  } catch (error) {
    console.error("Error loading clients:", error);
    showToast("Error al cargar clientes", "error");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadClientes();
}, [user]);

// Filter clients based on debounced search and zone
const filteredClientes = clientes.filter((cliente) => {
  // Text search (using debounced value)
  if (debouncedSearch) {
    const searchLower = debouncedSearch.toLowerCase();
    const matchesSearch =
      cliente.firstName.toLowerCase().includes(searchLower) ||
      cliente.lastName.toLowerCase().includes(searchLower) ||
      cliente.phone.toLowerCase().includes(searchLower);
    if (!matchesSearch) return false;
  }

  // Zone filter
  if (zoneFilter === "with-location") {
    return typeof cliente.lat === "number" && typeof cliente.lng === "number";
  } else if (zoneFilter === "without-location") {
    return !(typeof cliente.lat === "number" && typeof cliente.lng === "number");
  }

  return true;
});

  // Pagination
  const totalPages = Math.ceil(filteredClientes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedClientes = filteredClientes.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setAddress("");
    setLat("");
    setLng("");
    setNotes("");
    setEditingId(null);
  };

  const handleAddClient = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditClient = (cliente: ClienteConId) => {
    setFirstName(cliente.firstName);
    setLastName(cliente.lastName);
    setPhone(cliente.phone);
    setAddress(cliente.address || "");
    setLat(cliente.lat?.toString() || "");
    setLng(cliente.lng?.toString() || "");
    setNotes(cliente.notes || "");
    setEditingId(cliente.id);
    setShowEditModal(true);
  };

  const handleDeleteClick = (cliente: ClienteConId) => {
    setClientToDelete(cliente);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    try {
      await borrarCliente(clientToDelete.id);
      await loadClientes();
      showToast(`Cliente ${clientToDelete.firstName} ${clientToDelete.lastName} eliminado`, "success");
      setShowDeleteConfirm(false);
      setClientToDelete(null);
    } catch (error) {
      console.error("Error deleting client:", error);
      showToast("Error al eliminar cliente", "error");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const clienteData = {
        firstName,
        lastName,
        phone,
        address,
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
        notes,
        userId: user.uid,
      };

      if (editingId) {
        await actualizarCliente(editingId, clienteData);
        showToast("Cliente actualizado correctamente", "success");
      } else {
        await crearCliente(clienteData);
        showToast("Cliente agregado correctamente", "success");
      }

      await loadClientes();
      resetForm();
      setShowForm(false);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error saving client:", error);
      showToast("Error al guardar cliente", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Cargando clientes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-3">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Clientes</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {filteredClientes.length} cliente{filteredClientes.length !== 1 ? "s" : ""} encontrado{filteredClientes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search Bar + Filters + Add Button - All aligned */}
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          {/* Search Bar */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 pl-10 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              🔍
            </div>
            {/* Searching indicator */}
            {searchQuery && searchQuery !== debouncedSearch && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-sky-600 dark:text-sky-400">
                <div className="animate-spin h-3 w-3 border-2 border-sky-600 dark:border-sky-400 border-t-transparent rounded-full"></div>
                <span className="hidden sm:inline">Buscando...</span>
              </div>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Zone Filter */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value as typeof zoneFilter)}
            className="h-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/50 cursor-pointer"
          >
            <option value="all">📍 Todas las zonas</option>
            <option value="with-location">✅ Con ubicación</option>
            <option value="without-location">❌ Sin ubicación</option>
          </select>

          {/* Add Client Button */}
          <button
            onClick={handleAddClient}
            className="h-11 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-sm font-medium transition-colors whitespace-nowrap flex items-center justify-center gap-2"
          >
            <span className="text-lg">➕</span>
            <span>Agregar</span>
          </button>
        </div>
      </div>

      {/* Client Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 p-4 sm:p-6">
          <ClientForm
            firstName={firstName}
            lastName={lastName}
            phone={phone}
            address={address}
            lat={lat}
            lng={lng}
            notes={notes}
            editingId={editingId}
            onSubmit={handleSubmit}
            setFirstName={setFirstName}
            setLastName={setLastName}
            setPhone={setPhone}
            setAddress={setAddress}
            setLat={setLat}
            setLng={setLng}
            setNotes={setNotes}
          />
          <button
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
            className="mt-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Main Content: Map + List - Optimized for Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-auto lg:h-[calc(100vh-340px)] min-h-[400px] lg:min-h-[600px]">
        {/* Client List - Left Panel */}
        <div className="lg:col-span-2 flex flex-col rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden h-[500px] lg:h-auto">
          {/* List Header */}
          <div className="px-3 sm:px-4 py-3 border-b border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60">
            <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Lista de Clientes
              <span className="ml-2 text-xs text-slate-600 dark:text-slate-500">
                (Pág. {currentPage}/{totalPages || 1})
              </span>
            </h2>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div>
                <SkeletonListItem />
                <SkeletonListItem />
                <SkeletonListItem />
                <SkeletonListItem />
                <SkeletonListItem />
              </div>
            ) : paginatedClientes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 dark:text-slate-500 p-6">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-sm">No se encontraron clientes</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {paginatedClientes.map((cliente) => (
                  <ClientListItem
                    key={cliente.id}
                    cliente={cliente}
                    isSelected={selectedClientId === cliente.id}
                    onClick={() => handleClientClick(cliente.id)}
                    onEdit={() => handleEditClient(cliente)}
                    onDelete={() => handleDeleteClick(cliente)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Controls - Mobile Optimized */}
          {totalPages > 1 && (
            <div className="px-3 sm:px-4 py-3 border-t border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← <span className="hidden sm:inline">Anterior</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage <= 2) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i;
                    } else {
                      pageNum = currentPage - 1 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 text-xs font-medium rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? "bg-sky-600 text-white"
                            : "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Siguiente</span> →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Map - Right Panel */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-300 dark:border-slate-800 overflow-hidden h-[400px] lg:h-auto">
          <ClientMap
            clientes={filteredClientes}
            selectedClientId={selectedClientId}
          />
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <ClientForm
                firstName={firstName}
                lastName={lastName}
                phone={phone}
                address={address}
                lat={lat}
                lng={lng}
                notes={notes}
                editingId={editingId}
                onSubmit={handleSubmit}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setPhone={setPhone}
                setAddress={setAddress}
                setLat={setLat}
                setLng={setLng}
                setNotes={setNotes}
              />
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="mt-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && clientToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-400 dark:border-red-500/50 max-w-md w-full p-6 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="text-5xl">⚠️</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">¿Eliminar cliente?</h3>
              <p className="text-slate-700 dark:text-slate-300">
                ¿Estás seguro de que querés eliminar a{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {clientToDelete.firstName} {clientToDelete.lastName}
                </span>
                ?
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setClientToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
