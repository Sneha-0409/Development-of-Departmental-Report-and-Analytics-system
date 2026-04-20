import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyA_HcO33ijOYH34pWOX_oDEbYdkqhHN00k",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "instireport.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "instireport",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "instireport.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "991809853213",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:991809853213:web:1781b64acc823c46af73f4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const querySnapshot = await getDocs(collection(db, "reports"));
  let out = [];
  querySnapshot.forEach((doc) => {
    let data = doc.data();
    out.push({
      id: doc.id,
      department: data.department,
      userEmail: data.userEmail,
      hasFile: !!data.fileDataUrl,
      fileName: data.fileName,
      status: data.status,
      dateUrlLength: data.fileDataUrl ? data.fileDataUrl.length : 0
    });
  });
  console.log(JSON.stringify(out, null, 2));
}

check().catch(console.error);
