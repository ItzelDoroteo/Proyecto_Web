// src/firebaseMessaging.js
import { messaging } from "./firebaseConfig";

export const requestNotificationPermission = async () => {
  try {
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log("Token de dispositivo:", token);
    return token;
  } catch (error) {
    console.error("Permiso de notificación denegado:", error);
  }
};
