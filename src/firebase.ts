// Importo la función que inicializa la app de Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Importo Firestore (nuestra base de datos NoSQL)
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Esta es la configuración que te da Firebase al registrar la app.
// Contiene las "credenciales" para conectar tu frontend al proyecto.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Inicializo la app de Firebase con esa config.
// Sin esto, nada de Firebase funciona.
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// "db" es la instancia de Firestore.
// Es la base de datos que vamos a usar en todo el proyecto.
export const db = getFirestore(app);
// Auth
export const auth = getAuth(app);
