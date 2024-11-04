// Importa solo lo que necesitas de Firebase
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging"; // Ejemplo para notificaciones

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDlpUWbRmxARHBrX2A6kxg1fJWBZZA3fPY",
    authDomain: "chucheriasapp.firebaseapp.com",
    projectId: "chucheriasapp",
    storageBucket: "chucheriasapp.firebasestorage.app",
    messagingSenderId: "104787958041",
    appId: "1:104787958041:web:523307d22d2abcb22b0d88",
    measurementId: "G-E6H6C3YB4X"
};

// Inicializa la app de Firebase
const app = initializeApp(firebaseConfig);

// Inicializa el servicio de Firebase Messaging (si estás usando notificaciones push)
const messaging = getMessaging(app);

export { app, messaging, getToken, onMessage };
