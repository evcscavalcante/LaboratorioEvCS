import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, GoogleAuthProvider, signOut, onAuthStateChanged, getRedirectResult } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1234567890abcdefghijklmnopqrstuvwx", // Placeholder - needs real API key
  authDomain: "laboratorio-evcs.firebaseapp.com",
  projectId: "laboratorio-evcs",
  storageBucket: "laboratorio-evcs.firebasestorage.app",
  messagingSenderId: "53045134219",
  appId: "1:53045134219:web:e80d49f77f58870ac8e58e",
  measurementId: "G-R8M9D9H8XB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');

export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Error during Google sign in:", error);
    throw error;
  }
};

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error("Error handling redirect result:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

export { onAuthStateChanged };