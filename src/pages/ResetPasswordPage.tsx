import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Si el mail existe, te mandamos un link para resetear la contraseña."
      );
    } catch (err: any) {
      console.error(err);
      setError("No se pudo enviar el mail. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Restablecer contraseña</h1>

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

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
        )}
        {message && (
          <p style={{ color: "green", marginTop: "0.5rem" }}>{message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "0.75rem" }}
        >
          {loading ? "Enviando..." : "Enviar mail de reset"}
        </button>
      </form>

      <div style={{ marginTop: "0.75rem" }}>
        <Link to="/login">Volver al login</Link>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
