# 🗺️ Customer Map

Customer Map es una aplicación web moderna desarrollada con **React, Vite, Firebase, TailwindCSS y Leaflet**, diseñada para gestionar clientes y visualizar sus ubicaciones en un mapa interactivo.

Ideal para **ISPs, técnicos de campo, distribuidores, comercios de entrega a domicilio** o cualquier negocio que necesite ver y organizar clientes geográficamente.

---

## 🚀 Funcionalidades

### 📍 **Mapa y Geolocalización**

- Mapa interactivo mediante Leaflet.
- Click en el mapa para autocompletar latitud y longitud.
- Marcador editable (amarillo) arrastrable para ajustar coordenadas.
- Seleccionar un cliente centra el mapa, hace zoom y coloca un marcador verde destacado.
- Transiciones suaves con `flyTo()`.
- Fix aplicado para evitar que el mapa se vea cortado o mal renderizado.

### 👤 **Gestión de Clientes (CRUD)**

- Crear, editar, ver y eliminar clientes.
- Campos obligatorios: **Nombre** y **Apellido**.
- Validación para teléfono (solo valores numéricos).
- Campo opcional de **Notas**.
- Sincronización en tiempo real con Firestore.

### 🔍 **Búsqueda y Ordenamiento**

- Búsqueda instantánea por **nombre**, **apellido** o **teléfono**.
- Opciones de ordenamiento:

  - Nombre (A–Z)
  - Apellido (A–Z)
  - Dirección (A–Z)

### 🔐 **Autenticación**

- Login con Firebase Authentication.
- Rutas protegidas para evitar acceso sin sesión.

### 📂 **Estructura de Datos**

Todos los clientes se almacenan en la colección de Firestore:

```
clients
```

### 📱 **Interfaz y Responsividad**

- Interfaz moderna con TailwindCSS.
- Panel tipo dashboard.
- Mejoras planificadas para vista móvil.

---

## 🧩 Tecnologías Utilizadas

- **React (Vite)**
- **TailwindCSS**
- **Firebase (Auth + Firestore)**
- **Leaflet / React Leaflet**
- **TypeScript-ready** (opcional según el proyecto)

---

## 🛠️ Instalación

1. Clonar el repositorio:

```
git clone <repo-url>
cd customer-map
```

2. Instalar dependencias:

```
npm install
```

3. Iniciar servidor de desarrollo:

```
npm run dev
```

4. Crear tu archivo `.env` con las credenciales de Firebase:

```
VITE_API_KEY="..."
VITE_AUTH_DOMAIN="..."
VITE_PROJECT_ID="..."
VITE_STORAGE_BUCKET="..."
VITE_MESSAGING_SENDER_ID="..."
VITE_APP_ID="..."
```

---

## 📅 Backlog / Próximas Funcionalidades

### 🔥 Alta Prioridad

- Clustering de marcadores en el mapa.
- Filtros inteligentes (por zona, tipo de cliente, radio, etc.).
- Exportación de clientes a Excel.
- Importación desde Excel o Google Sheets.

### ⚙️ Media Prioridad

- Loader visual en login.
- Optimización móvil completa.
- Sistema de colores según tipo de cliente.

### 🧪 Futuras Mejoras

- Roles de usuario (admin / solo lectura).
- Historial de visitas (registro por fecha + notas).
- Envío de notificaciones push.

---

## 🤝 Contribuciones

¡Contribuciones son bienvenidas! Asegurate de escribir código claro, comentado y seguir buenas prácticas de PR.

---

## 📄 Licencia

Proyecto bajo licencia **MIT**.

---

## 👤 Autor

Desarrollado por **Manuel Ortiz**.
