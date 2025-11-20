import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

function AppLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h1>Mapa de clientes</h1>
        <div>
          <span style={{ marginRight: "1rem" }}>
            {user?.email ?? "Sin usuario"}
          </span>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main>
        <p>Acá después va el CRUD de clientes y el mapa.</p>
      </main>
    </div>
  );
}

export default AppLayout;
