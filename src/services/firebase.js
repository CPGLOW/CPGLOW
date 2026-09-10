import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Configuración de Firebase para CP GLOW
 * Los valores se leen de las variables de entorno VITE_FIREBASE_*
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
  console.info('[CP GLOW Firebase] Variables de Firebase no configuradas aún. Usando persistencia local y estática de contingencia.');
}

export { app, db };
