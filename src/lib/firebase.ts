import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Check if core Firebase config keys are provided and are not placeholders
const isFirebaseConfigValid = 
  firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_api_key' &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId;

if (isFirebaseConfigValid) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    if (app) {
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
    }
  } catch (e) {
    console.error("Failed to initialize Firebase", e);
  }
} else {
  // On the client-side, in a development environment, show a warning.
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn('Firebase is not configured. Please add your Firebase credentials to the .env file to enable authentication features.');
  }
}

export { app, auth, googleProvider };
