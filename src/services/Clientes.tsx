// src/services/clientes.ts
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

// Tipo base de un cliente
export interface Cliente {
  nombre: string;
  direccion?: string;
  lat?: number;
  lng?: number;
  createdAt?: Date;
}

// Tipo de cliente con id (como viene de Firestore)
export type ClienteConId = Cliente & { id: string };

// CREATE → crea un nuevo cliente y devuelve el id
export const crearCliente = async (data: Cliente): Promise<string> => {
  const ref = collection(db, "clientes");
  const docRef = await addDoc(ref, data);
  return docRef.id;
};

// READ → trae todos los clientes
export const obtenerClientes = async (): Promise<ClienteConId[]> => {
  const querySnapshot = await getDocs(collection(db, "clientes"));

  const clientes: ClienteConId[] = querySnapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Cliente),
  }));

  return clientes;
};

// UPDATE → actualiza un cliente existente
export const actualizarCliente = async (
  id: string,
  data: Partial<Cliente>
): Promise<void> => {
  const ref = doc(db, "clientes", id);
  await updateDoc(ref, data);
};

// DELETE → borra un cliente
export const borrarCliente = async (id: string): Promise<void> => {
  const ref = doc(db, "clientes", id);
  await deleteDoc(ref);
};
