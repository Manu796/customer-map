// Loader de pantalla completa
// Se muestra mientras Firebase valida la sesión (loading = true)

import { useEffect, useState } from "react";

export function FullScreenLoader() {
  const [visible, setVisible] = useState(false);

  // Pequeño delay para activar el fade-in después del primer render
  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), 10);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
        <p className="text-sky-100 text-sm font-medium tracking-wide">
          Cargando…
        </p>
      </div>
    </div>
  );
}
