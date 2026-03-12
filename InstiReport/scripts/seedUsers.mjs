/**
 * seedUsers.mjs
 * Run once to add hardcoded users into Firestore:
 *   node scripts/seedUsers.mjs
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_HcO33ijOYH34pWOX_oDEbYdkqhHN00k",
  authDomain: "instireport.firebaseapp.com",
  projectId: "instireport",
  storageBucket: "instireport.firebasestorage.app",
  messagingSenderId: "991809853213",
  appId: "1:991809853213:web:1781b64acc823c46af73f4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usersToSeed = [
  { name: "Dr. Smith", email: "smith@example.com", password: "password123", role: "hod" },
  { name: "Sneha",     email: "sneha044l2005@gmail.com", password: "Sneha1234", role: "report-maker" },
];

(async () => {
  const usersRef = collection(db, "users");

  for (const user of usersToSeed) {
    const q = query(usersRef, where("email", "==", user.email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      await addDoc(usersRef, { ...user, createdAt: new Date() });
      console.log(`✅ Seeded user: ${user.email}`);
    } else {
      console.log(`⚠️  User already exists: ${user.email}`);
    }
  }

  console.log("✅ Seeding complete!");
  process.exit(0);
})();
