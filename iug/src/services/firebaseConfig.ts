import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: (process.env.REACT_APP_PROJECT_ID as string) + ".firebaseapp.com",
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: (process.env.REACT_APP_PROJECT_ID as string) + ".appspot.com",
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: `G-${process.env.REACT_APP_MEASUREMENT_ID}`,
};

// console.log("HELLU:" + firebaseConfig.apiKey);
// console.log("HELLU:" + firebaseConfig.authDomain);
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app);
const functions = getFunctions(app);
if (window.location.hostname === "localhost") {
  console.log("localhost detected!");
  connectFirestoreEmulator(db, "localhost", 8080);
  const auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFunctionsEmulator(functions, "localhost", 5001);
}
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
