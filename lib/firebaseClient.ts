import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional: Add types for better TypeScript support
export type FirebaseApp = typeof app;
export type FirebaseAuth = typeof auth;
export type FirebaseDB = typeof db;

// Function to store user session
export const storeUserSession = (user: any) => {
  if (user) {
    sessionStorage.setItem('user', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }));
  }
};

// Function to clear user session
export const clearUserSession = () => {
  sessionStorage.removeItem('user');
};

// Function to get stored user session
export const getUserSession = () => {
  const userStr = sessionStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Setup auth state listener
export const initializeAuthListener = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      storeUserSession(user);
    } else {
      clearUserSession();
    }
  });
};
