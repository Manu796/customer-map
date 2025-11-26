import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

// Caracteristicas base de un cliente
export interface Cliente {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  status: string;
  userId: string;
  lat?: number;
  lng?: number;
  createdAt?: any;
  updatedAt?: any;
  notes?: string;
}

//Cliente con id (como lo voy a usar en el frontend)
export interface ClienteConId extends Cliente {
  id: string;
  notes?: string;
}

// CREATE → crea un nuevo cliente y devuelve el id
export async function crearCliente(
  cliente: Omit<Cliente, "createdAt" | "updatedAt">
) {
  const ref = collection(db, "clients"); // referencia a la colección clients en Firestore

  const docRef = await addDoc(ref, {
    ...cliente,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id; //devuelve el id
}

// READ → trae todos los clientes de un usuario
export async function obtenerClientes(userId: string): Promise<ClienteConId[]> {
  const ref = collection(db, "clients");

  // armo una query: where userId == el user actual
  const q = query(ref, where("userId", "==", userId));

  // ejecuto la query
  const snapshot = await getDocs(q);

  // transformo cada doc de Firestore en un objeto ClienteConId
  const clientes: ClienteConId[] = snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Cliente),
  }));

  return clientes;
}

// UPDATE → actualiza un cliente existente
export async function actualizarCliente(
  id: string,
  data: Partial<Cliente> // Partial = puedo mandar los campos que quiera cambiar
) {
  const ref = doc(db, "clients", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// DELETE → borra un cliente por id
export async function borrarCliente(id: string) {
  const ref = doc(db, "clients", id);
  await deleteDoc(ref);
}
