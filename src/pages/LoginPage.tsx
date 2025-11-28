import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

type FormState = {
  email: string;
  password: string;
  remember: boolean;
};

type FieldErrors = {
  email?: string;
  password?: string;
};

const REMEMBER_KEY = "cm_remember_email";

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    remember: true,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setForm((f) => ({ ...f, email: saved, remember: true }));
    }
  }, []);

  const validate = (values: FormState): FieldErrors => {
    const errors: FieldErrors = {};

    if (!values.email.trim()) {
      errors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      errors.email = "El correo no es válido.";
    }

    if (!values.password) {
      errors.password = "La contraseña es obligatoria.";
    } else if (values.password.length < 6) {
      errors.password = "Mínimo 6 caracteres.";
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const email = form.email.trim();
      console.log("Intentando login con:", email);

      await signInWithEmailAndPassword(auth, email, form.password);

      if (form.remember) {
        localStorage.setItem(REMEMBER_KEY, email);
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      navigate("/app", { replace: true });
    } catch (err: any) {
      console.error("Error en login:", err);
      let msg = "No pudimos iniciar sesión. Revisá los datos.";
      if (err.code === "auth/invalid-email") {
        msg = "El correo no es válido.";
      } else if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        msg = "Correo o contraseña incorrectos.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Demasiados intentos. Probá de nuevo en unos minutos.";
      }
      setGlobalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlurField = (field: "email" | "password") => {
    const errors = validate(form);
    setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }));
  };

  return (
    <main className="min-h-screen w-screen bg-slate-950 text-slate-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-4xl px-4 py-10 md:py-12 relative z-10">
        <div className="flex flex-col md:flex-row rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {/* Columna izquierda: login */}
          <section className="w-full md:w-[52%] px-6 py-8 sm:px-8 sm:py-10">
            <div className="mb-8 flex items-center gap-2">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-500/20 to-sky-600/10 flex items-center justify-center border border-sky-500/40 shadow-lg shadow-sky-500/20">
                <span className="text-sm font-bold text-sky-400 tracking-tight">
                  CM
                </span>
              </div>
              <div className="text-sm leading-tight">
                <p className="font-semibold">Customer Map</p>
                <p className="text-[11px] text-slate-400">
                  Panel de clientes · Insert Redes
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent">
                Iniciar sesión
              </h1>
              <p className="text-sm text-slate-400">
                Entrá para ver y gestionar tus clientes en el mapa.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-200">
                  Correo
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  className={`w-full rounded-xl border bg-slate-900/60 backdrop-blur-sm px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 ${
                    fieldErrors.email
                      ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/60"
                      : "border-slate-700 focus:border-sky-500 focus:ring-sky-500/50"
                  }`}
                  placeholder="tu@correo.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  onBlur={() => handleBlurField("email")}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-400 mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <PasswordField
                value={form.password}
                onChange={(val) => setForm((f) => ({ ...f, password: val }))}
                error={fieldErrors.password}
                onBlur={() => handleBlurField("password")}
              />

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-slate-200 transition-colors">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
                    checked={form.remember}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, remember: e.target.checked }))
                    }
                  />
                  <span>Recordarme en este dispositivo</span>
                </label>
              </div>

              {globalError && (
                <p className="text-sm text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-3 py-2 animate-shake">
                  {globalError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-2.5 text-sm font-medium shadow-lg shadow-sky-500/30 transition-all hover:shadow-xl hover:shadow-sky-500/40 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? "Entrando..." : "Iniciar sesión"}
              </button>
            </form>

            <p className="mt-6 text-[11px] text-center text-slate-500">
              Customer Map · Panel de clientes
            </p>
          </section>

          {/* Columna derecha: panel "SaaS" */}
          <aside className="hidden md:flex flex-1 bg-gradient-to-br from-sky-500/15 via-slate-900/80 to-slate-950/80 backdrop-blur-sm border-l border-slate-700/50 px-8 py-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 border border-sky-500/40 px-3 py-1.5 text-[11px] text-sky-200 shadow-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Mapa inteligente de clientes
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent">
                  Tus clientes, ubicados en segundos.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Filtrá, buscá y visualizá miles de clientes sobre el mapa.
                  Ubicaciones claras para rutas más eficientes.
                </p>
              </div>

              <ul className="space-y-2.5 text-sm text-slate-200">
                <Bullet>
                  Filtro por radio y búsqueda por nombre, apellido y teléfono.
                </Bullet>
                <Bullet>Marcadores centrados al seleccionar un cliente.</Bullet>
                <Bullet>
                  Optimizado para ~2000 clientes sin perder rendimiento.
                </Bullet>
              </ul>

              <div className="mt-6 rounded-2xl border border-slate-700/80 bg-slate-950/70 p-4 shadow-xl">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                  <span>Customer map</span>
                  <span>Vista rápida</span>
                </div>
                <div className="h-36 rounded-xl bg-gradient-to-tr from-sky-600/20 via-slate-800 to-emerald-500/20 relative overflow-hidden">
                  <div className="absolute inset-4 border border-slate-600/60 rounded-lg" />
                  <div className="absolute left-6 top-6 h-2.5 w-2.5 rounded-full bg-sky-400 shadow-lg shadow-sky-400/50 animate-pulse" />
                  <div className="absolute right-10 bottom-8 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse delay-500" />
                  <div className="absolute left-10 bottom-4 h-2.5 w-2.5 rounded-full bg-sky-300 shadow-lg shadow-sky-300/50 animate-pulse delay-1000" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function PasswordField({
  value,
  onChange,
  error,
  onBlur,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  onBlur?: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-200">
          Contraseña
        </label>
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          className={`w-full rounded-xl border bg-slate-900/60 backdrop-blur-sm px-3 py-2.5 text-sm pr-11 outline-none transition-all focus:ring-2 ${
            error
              ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/60"
              : "border-slate-700 focus:border-sky-500 focus:ring-sky-500/50"
          }`}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          onClick={() => setShowPassword((v) => !v)}
        >
          {showPassword ? "Ocultar" : "Ver"}
        </button>
      </div>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-sky-400" />
      <span>{children}</span>
    </li>
  );
}
