import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration - using environment variables with fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCNjmOYR5pjOfRpt_4fRnb_h06G03sUk2g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sixfix-3bbfd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sixfix-3bbfd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sixfix-3bbfd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "595949864703",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:595949864703:web:5b381a4d9f091287da2eca"
};

// Debug: verificar se variáveis estão carregadas
console.log('Firebase Config loaded:', {
  apiKey: firebaseConfig.apiKey ? 'Loaded ✓' : 'Missing ✗',
  authDomain: firebaseConfig.authDomain ? 'Loaded ✓' : 'Missing ✗',
  projectId: firebaseConfig.projectId ? 'Loaded ✓' : 'Missing ✗'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore
export const db: Firestore = getFirestore(app);

// Initialize Storage
export const storage: FirebaseStorage = getStorage(app);

export default app;
