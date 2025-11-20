// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeUWnGvynKS0j4kG6Gb6d6mDey2Fwbxpg",
  authDomain: "customer-map-4dec4.firebaseapp.com",
  projectId: "customer-map-4dec4",
  storageBucket: "customer-map-4dec4.firebasestorage.app",
  messagingSenderId: "984906486596",
  appId: "1:984906486596:web:a1cad0b2130dc58e6d7d11",
  measurementId: "G-1VHBFSZ75R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);