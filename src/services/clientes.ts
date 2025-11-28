import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export interface Cliente {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  lat?: number;
  lng?: number;
  notes?: string;
  userId: string;
  createdAt?: number; // Timestamp in milliseconds
}

export interface ClienteConId extends Cliente {
  id: string;
}

// ➤ Asegurado: ahora usa "clients"
const COLLECTION = "clients";

/* ======================
   CREAR
====================== */
export async function crearCliente(data: Cliente) {
  const ref = collection(db, COLLECTION);
  const clienteConFecha = {
    ...data,
    createdAt: Date.now(), // Add timestamp
  };
  await addDoc(ref, clienteConFecha);
}

/* ======================
   OBTENER (filtrado por usuario)
====================== */
export async function obtenerClientes(userId: string) {
  const ref = collection(db, COLLECTION);
  const q = query(ref, where("userId", "==", userId));
  const snap = await getDocs(q);

  return snap.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Cliente),
  }));
}

/* ======================
   ACTUALIZAR
====================== */
export async function actualizarCliente(id: string, data: Partial<Cliente>) {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, data);
}

/* ======================
   BORRAR
====================== */
export async function borrarCliente(id: string) {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

/* ======================
   SPLIT FULL NAME
====================== */
export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(" ").filter(Boolean);

  if (parts.length === 1) return { firstName: parts[0], lastName: "" };

  const lastName = parts[parts.length - 1];
  const firstName = parts.slice(0, -1).join(" ");

  return { firstName, lastName };
}

/* ======================
   NORMALIZAR NOMBRES
====================== */
export async function normalizarNombresClientes(userId: string) {
  const ref = collection(db, COLLECTION);
  const q = query(ref, where("userId", "==", userId));
  const snap = await getDocs(q);

  const ops: Promise<any>[] = [];

  snap.forEach((docSnap) => {
    const data = docSnap.data() as Cliente;
    const { firstName, lastName } = data;

    if (!lastName && firstName.includes(" ")) {
      const { firstName: newFirst, lastName: newLast } =
        splitFullName(firstName);
      const d = doc(db, COLLECTION, docSnap.id);
      ops.push(updateDoc(d, { firstName: newFirst, lastName: newLast }));
    }
  });

  await Promise.all(ops);
}
