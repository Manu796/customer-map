# 🗺️ Customer Map

Customer Map is a modern web application built with **React + Vite + Firebase + Tailwind** for managing clients, visualizing their locations on an interactive map, and improving operational planning.

Ideal for small businesses, ISPs, técnicos de campo, distribuidores y cualquier negocio que necesite ver clientes en un mapa.

---

## 🚀 Features

### **📍 Map & Geolocation**

- Interactive map powered by Leaflet.
- Click on the map to auto-fill client coordinates.
- Draggable yellow marker to update coordinates in real time.
- When selecting a client, the map centers and highlights the location with a green marker.
- Smooth animations using `flyTo()`.
- Fix implemented for map resizing issues.

### **👤 Client Management (CRUD)**

- Create, edit, delete and view clients.
- Required fields: **First Name**, **Last Name**.
- Phone number input accepts only numeric values.
- Optional notes field.
- Real-time sync with Firestore.

### **🔍 Search & Sorting**

- Search by **name, last name or phone**.
- Sorting options:

  - First Name (A–Z)
  - Last Name (A–Z)
  - Address (A–Z)

### **🗂️ Data Structure**

All clients are stored in the **Firestore collection `clients`**.

### **🔐 Authentication**

- Firebase Auth login.
- Protected routes.

### **📱 Responsive UI**

- Built with TailwindCSS.
- Dashboard layout optimized for desktop.
- Mobile UI improvements planned.

---

## 📦 Tech Stack

- **React (Vite)**
- **TailwindCSS**
- **Firebase (Auth + Firestore)**
- **Leaflet + React Leaflet**
- **TypeScript (optional depending on version)**

---

## 📸 Screenshots (Opcional)

_(Agregar cuando tengas imágenes del dashboard)_

---

## 🧩 Project Structure

```
src/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── services/
 ├── hooks/
 ├── context/
 ├── App.jsx
 └── main.jsx
```

---

## 🛠️ Installation

```bash
git clone <repo-url>
cd customer-map
npm install
npm run dev
```

Create a `.env` file with your Firebase credentials:

```
VITE_API_KEY="..."
VITE_AUTH_DOMAIN="..."
VITE_PROJECT_ID="..."
VITE_STORAGE_BUCKET="..."
VITE_MESSAGING_SENDER_ID="..."
VITE_APP_ID="..."
```

---

## 📅 Backlog / To‑Do

### 🔥 High Priority

- Clustering of map markers.
- Intelligent filters.
- Export clients to Excel.
- Import clients from Excel/Sheets.

### ⚙️ Medium Priority

- Loader for login.
- Mobile-optimized view.
- Client type color system.

### 🧪 Future

- Roles (admin/viewer).
- Visit history.
- Notifications.

---

## 🤝 Contributing

Pull requests are welcome! Follow typical PR conventions and write clean, commented code.

---

## 📄 License

MIT License.

---

## 👤 Author

Developed by **Manu**.

If you want help improving your README with images, badges, or gifs, avisame 😉

---

# 🇺🇸 Customer Map – Full English Version

Customer Map is a modern web application built with **React, Vite, Firebase, and Leaflet** to manage clients and visualize their locations on an interactive map.

Ideal for ISPs, technicians, delivery businesses, distributors, or any operation that needs to track clients geographically.

## 🚀 Features

### 📍 Map & Geolocation

- Interactive map powered by Leaflet.
- Click on the map to automatically fill location coordinates.
- Draggable editable marker for precise positioning.
- Client selection auto-centers the map, zooms in, and highlights the client with a green marker.
- Smooth transitions using `flyTo()`.
- Automatic resize fixes.

### 👤 Client Management (CRUD)

- Add, edit, delete, and view clients.
- Required fields: **First Name**, **Last Name**.
- Phone number field accepts only numeric input.
- Optional notes field.
- Real-time Firestore synchronization.

### 🔍 Search & Sorting

- Search clients by **first name, last name, or phone**.
- Sorting options:

  - First Name (A–Z)
  - Last Name (A–Z)
  - Address (A–Z)

### 🔐 Authentication

- Firebase Authentication.
- Protected routes.

### 📂 Database Structure

- All clients are stored under the Firestore collection: **`clients`**.

### 📱 Responsive UI

- TailwindCSS-powered dashboard.
- Mobile view improvements planned.

## 🧩 Tech Stack

- React (Vite)
- Firebase (Auth + Firestore)
- TailwindCSS
- Leaflet / React Leaflet
- TypeScript-ready

## 🛠️ Installation

```
git clone <repo-url>
cd customer-map
npm install
npm run dev
```

Create a `.env` file with your Firebase keys:

```
VITE_API_KEY="..."
VITE_AUTH_DOMAIN="..."
VITE_PROJECT_ID="..."
VITE_STORAGE_BUCKET="..."
VITE_MESSAGING_SENDER_ID="..."
VITE_APP_ID="..."
```

## 📅 Backlog / To‑Do

### High Priority

- Marker clustering.
- Intelligent filters.
- Export clients to Excel.
- Import clients from Excel/Sheets.

### Medium Priority

- Login loader.
- Mobile optimization.
- Color categorization by client type.

### Future Improvements

- User roles (admin/viewer).
- Visit history.
- Push notifications.

## 🤝 Contributing

Pull requests are welcome. Please keep code clean and documented.

## 📄 License

MIT License.

## 👤 Author

Created by **Manuel Ortiz**.
