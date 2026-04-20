import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where, writeBatch, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA_HcO33ijOYH34pWOX_oDEbYdkqhHN00k",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "instireport.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "instireport",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "instireport.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "991809853213",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:991809853213:web:1781b64acc823c46af73f4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Function to store user's email explicitly
export const saveEmailToDatabase = async (emailAddress) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      email: emailAddress,
      createdAt: serverTimestamp(),
      status: "active"
    });
    console.log("Email saved successfully with ID: ", docRef.id);
    return true;
  } catch (e) {
    console.error("Error adding email: ", e);
    return false;
  }
};
