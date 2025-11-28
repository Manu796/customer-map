// Página para restablecer contraseña mediante email.
// Funcionalidades:
// - Enviar email de recuperación con Firebase
// - Mostrar mensajes de éxito o error
// - Loading mientras envía el email

import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

function ResetPasswordPage() {
  // Estados del formulario
  const [email, setEmail] = useState("");

  // Estados UI
  const [sent, setSent] = useState(false); // si se envió el mail
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handler principal
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError(null);
    setSent(false);
    setLoading(true);

    try {
      // Firebase envía el email de recuperación
      await sendPasswordResetEmail(auth, email);

      // Confirmar éxito
      setSent(true);
    } catch (err: any) {
      console.error(err);

      // Manejo de errores comunes
      if (err.code === "auth/user-not-found") {
        setError("No existe un usuario con ese email.");
      } else if (err.code === "auth/invalid-email") {
        setError("El email no es válido.");
      } else {
        setError("No se pudo enviar el email. Probá de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-semibold text-slate-50 mb-1">
          Recuperar contraseña
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Ingresá tu email y te enviaremos un enlace para restablecerla.
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-700 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Mensaje de éxito */}
        {sent && !error && (
          <div className="mb-4 rounded-lg bg-emerald-900/40 border border-emerald-700 px-3 py-2 text-sm text-emerald-200">
            Te enviamos un enlace para restablecer tu contraseña. Revisá tu
            bandeja de entrada (y el spam).
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input email */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
              placeholder="tu@correo.com"
            />
          </div>

          {/* Botón enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium px-3 py-2 mt-2"
          >
            {/* Spinner */}
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        {/* Volver al login */}
        <div className="mt-5 text-sm">
          <p className="text-slate-400">
            ¿Ya te acordaste?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Volver al login
            </Link>
          </p>
        </div>

        <p className="mt-6 text-xs text-slate-500 text-center">
          Proyecto interno · Customer Map
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
