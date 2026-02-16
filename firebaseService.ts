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

console.log('🔥 Firebase config:', firebaseConfig);

let app;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  // Initialize Firebase
  console.log('🔥 Initializing Firebase app...');
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');

  // Initialize Firebase Authentication
  console.log('🔥 Initializing Auth...');
  auth = getAuth(app);
  console.log('✅ Auth initialized');

  // Initialize Cloud Firestore
  console.log('🔥 Initializing Firestore...');
  db = getFirestore(app);
  console.log('✅ Firestore initialized');

  // Initialize Storage
  console.log('🔥 Initializing Storage...');
  storage = getStorage(app);
  console.log('✅ Storage initialized');

  console.log('✅ Firebase fully initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

export { auth, db, storage };
export default app;
