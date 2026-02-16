import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration - hardcoded for production
const firebaseConfig = {
  apiKey: "AIzaSyCNjmOYR5pjOfRpt_4fRnb_h06G03sUk2g",
  authDomain: "sixfix-3bbfd.firebaseapp.com",
  projectId: "sixfix-3bbfd",
  storageBucket: "sixfix-3bbfd.firebasestorage.app",
  messagingSenderId: "595949864703",
  appId: "1:595949864703:web:5b381a4d9f091287da2eca"
};

// Debug: verificar se Firebase está inicializando
console.log('🔥 Firebase initializing...', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log('✅ Firebase initialized successfully');

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore
export const db: Firestore = getFirestore(app);

// Initialize Storage
export const storage: FirebaseStorage = getStorage(app);

export default app;
