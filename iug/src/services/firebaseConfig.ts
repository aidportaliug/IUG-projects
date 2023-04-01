import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
