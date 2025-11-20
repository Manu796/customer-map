import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Guardar datos básicos del usuario en Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        name,
        email,
        role: "admin",
        createdAt: serverTimestamp(),
      });

      navigate("/app");
    } catch (err: any) {
      console.error(err);
      setError("No se pudo crear la cuenta. Revisá el mail o la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Crear cuenta</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: "block", width: "100%" }}
          />
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", width: "100%" }}
          />
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          <label>Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", width: "100%" }}
          />
        </div>

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "0.75rem" }}
        >
          {loading ? "Creando..." : "Registrarse"}
        </button>
      </form>

      <div style={{ marginTop: "0.75rem" }}>
        <Link to="/login">¿Ya tenés cuenta? Iniciar sesión</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
