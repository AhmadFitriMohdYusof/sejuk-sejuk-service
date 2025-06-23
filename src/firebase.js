// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1vix0iCngEpN1pWG-dUo2gCX8uAv9JDA",
  authDomain: "sejuk-sejuk-service.firebaseapp.com",
  projectId: "sejuk-sejuk-service",
  storageBucket: "sejuk-sejuk-service.firebasestorage.app",
  messagingSenderId: "967284188281",
  appId: "1:967284188281:web:8671356746b6dde12fe0a8",
  databaseURL: "https://sejuk-sejuk-service-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app); 
export { db, realtimeDb }; // Export Firestore instance