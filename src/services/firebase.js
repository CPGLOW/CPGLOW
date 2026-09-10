import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Configuración de Firebase Firestore para CP GLOW
 * Permite sincronización en tiempo real multidispositivo en la nube.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDeNKbcCrSgn0_Tgc8mXkT9-F6CZrZnOFU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cpglow-ad6fa.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cpglow-ad6fa',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cpglow-ad6fa.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '602318944893',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:602318944893:web:40ae285903083157658f14',
};

// Verifica si la configuración mínima de Firebase está presente
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey.trim() !== '' &&
  firebaseConfig.projectId.trim() !== ''
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    console.info('[CP GLOW Firebase] Base de datos en la nube (Firestore) inicializada correctamente.');
  } catch (error) {
    console.warn('[CP GLOW Firebase] Error al inicializar Firebase:', error);
    db = null;
  }
} else {
  console.info('[CP GLOW Firebase] Variables de Firebase no configuradas. Usando persistencia de contingencia.');
}

export { app, db };
