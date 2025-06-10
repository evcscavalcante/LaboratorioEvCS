import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, enableNetwork, disableNetwork, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBQJvF9QGvHJ_Wf9vL8sKpXqRnMjEtGsDs",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "laboratorio-evcs"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "laboratorio-evcs",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "laboratorio-evcs"}.firebasestorage.app`,
  messagingSenderId: "53045134219",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:53045134219:web:e80d49f77f58870ac8e58e",
  measurementId: "G-R8M9D9H8XB"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let persistenceEnabled = false;

// Initialize Firebase
app = initializeApp(firebaseConfig);
auth = getAuth(app);
db = getFirestore(app);

try {
  
  // Enable persistence only once
  if (db && !persistenceEnabled) {
    enableIndexedDbPersistence(db)
      .then(() => {
        persistenceEnabled = true;
        console.log('Firebase offline persistence enabled');
      })
      .catch((error) => {
        if (error.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab');
        } else if (error.code === 'unimplemented') {
          console.warn('Browser does not support persistence');
        } else {
          console.warn('Persistence error:', error);
        }
      });
  }
} catch (error) {
  console.warn('Firebase initialization error:', error);
}

// Network status management
export const goOffline = () => {
  if (db) {
    return disableNetwork(db);
  }
  return Promise.resolve();
};

export const goOnline = () => {
  if (db) {
    return enableNetwork(db);
  }
  return Promise.resolve();
};

export { auth, db };
export default app;