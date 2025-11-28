// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "../firebase";

// 👇 Configurable loader delay (en milisegundos)
// 0 = sin demora artificial (se apaga apenas Firebase responde)
// 1000 = 1 segundo, 2000 = 2 segundos, etc.
const AUTH_LOADER_DELAY_MS = 0;

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId: number | undefined;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);

      // 🔥 Control del loader centralizado acá
      if (AUTH_LOADER_DELAY_MS > 0) {
        // limpiamos timeout anterior si hubiera
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(() => {
          setLoading(false);
        }, AUTH_LOADER_DELAY_MS);
      } else {
        // sin delay artificial
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook cómodo para usar el contexto
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  // 🔧 Fallback por si algún componente se monta fuera del AuthProvider
  if (!ctx) {
    // Podés dejar esto o agregar un console.warn si querés:
    // console.warn("useAuth usado fuera de AuthProvider, devolviendo estado por defecto");
    return { user: null, loading: true };
  }

  return ctx;
}
