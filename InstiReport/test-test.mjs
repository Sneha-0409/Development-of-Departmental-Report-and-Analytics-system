import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
try {
  const app = initializeApp({ apiKey: undefined, projectId: undefined });
  const db = getFirestore(app);
  console.log("Did not crash");
} catch (e) {
  console.error("Crashed:", e.message);
}
