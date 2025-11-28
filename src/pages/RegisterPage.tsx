// Página de registro de nuevos usuarios.
// Funcionalidades:
// - Crear cuenta con Firebase (email + contraseña)
// - Validar contraseña repetida
// - Manejar errores (email en uso, email inválido, etc.)
// - Redirigir al dashboard tras registrarse
// - Mostrar loading mientras se procesa

import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

function RegisterPage() {
  // Para redireccionar después de registrar
  const navigate = useNavigate();

  // Estados controlados de los inputs
  const [displayName, setDisplayName] = useState(""); // opcional
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // Estados de UI
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handler principal del registro
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Resetear errores previos
    setError(null);

    // Verificación de contraseñas
    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      // Crear usuario en Firebase
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Si se ingresó nombre, actualizar perfil
      if (displayName.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }

      // Redirigir a la app
      navigate("/app");
    } catch (err: any) {
      console.error(err);

      // Manejo de errores comunes de Firebase
      if (err.code === "auth/email-already-in-use") {
        setError("Ese email ya está registrado.");
      } else if (err.code === "auth/invalid-email") {
        setError("El email no es válido.");
      } else {
        setError("No se pudo crear la cuenta. Probá de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      {/* Card principal */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-semibold text-slate-50 mb-1">
          Crear cuenta
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Registrate para empezar a usar Customer Map.
        </p>

        {/* Error si lo hay */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-700 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre opcional */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Nombre (opcional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
              placeholder="Ej: Manu"
            />
          </div>

          {/* Email */}
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

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {/* Repetir contraseña */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">
              Repetir contraseña
            </label>
            <input
              type="password"
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
              placeholder="Repetí la contraseña"
            />
          </div>

          {/* Botón de crear */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-medium px-3 py-2 mt-2"
          >
            {/* Spinner mientras carga */}
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Link al login */}
        <div className="mt-5 text-sm">
          <p className="text-slate-400">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Iniciar sesión
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

export default RegisterPage;
