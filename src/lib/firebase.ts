import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSgoNqeFqtGy6nl-SZQcxrQySi6KCc9I8",
  authDomain: "leny-chat.firebaseapp.com",
  projectId: "leny-chat",
  storageBucket: "leny-chat.appspot.com",
  messagingSenderId: "896396117656",
  appId: "1:896396117656:web:4f7e270b442d2c7a5cf2ed",
  measurementId: "G-NNGH52TJD8"
};

let app: FirebaseApp;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} catch (e) {
  console.error("Failed to initialize Firebase", e);
  // @ts-ignore
  app = null;
  // @ts-ignore
  auth = null;
  // @ts-ignore
  googleProvider = null;
}


export { app, auth, googleProvider };
