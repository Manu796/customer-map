import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/app");
    } catch (err: any) {
      console.error(err);
      setError("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit} style={{ maxWidth: 320 }}>
        <div>
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

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "0.75rem" }}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      <div style={{ marginTop: "0.75rem" }}>
        <Link to="/register">Crear cuenta</Link>
      </div>
      <div>
        <Link to="/reset-password">¿Olvidaste la contraseña?</Link>
      </div>
    </div>
  );
}

export default LoginPage;
