// Importo la función que inicializa la app de Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Importo Firestore (nuestra base de datos NoSQL)
import { getFirestore } from "firebase/firestore";

// Esta es la configuración que te da Firebase al registrar la app.
// Contiene las "credenciales" para conectar tu frontend al proyecto.
const firebaseConfig = {
  apiKey: "AIzaSyBeUWnGvynKS0j4kG6Gb6d6mDey2Fwbxpg",
  authDomain: "customer-map-4dec4.firebaseapp.com",
  projectId: "customer-map-4dec4",
  storageBucket: "customer-map-4dec4.firebasestorage.app",
  messagingSenderId: "984906486596",
  appId: "1:984906486596:web:a1cad0b2130dc58e6d7d11",
  measurementId: "G-1VHBFSZ75R",
};

// Inicializo la app de Firebase con esa config.
// Sin esto, nada de Firebase funciona.
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// "db" es la instancia de Firestore.
// Es la base de datos que vamos a usar en todo el proyecto.
export const db = getFirestore(app);
