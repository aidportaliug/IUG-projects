import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCT4JAh0LWRPhZ50nrd8X7KTsCGzkXh9po",
    authDomain: "iug-aidportal.firebaseapp.com",
    projectId: "iug-aidportal",
    storageBucket: "iug-aidportal.appspot.com",
    messagingSenderId: "22120487",
    appId: "1:22120487:web:a106261f46b316b7122602",
    measurementId: "G-HMRD5FP6E4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
