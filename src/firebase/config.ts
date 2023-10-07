import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore'; // Import getFirestore to access Firestore
import {getAuth} from 'firebase/auth';
import "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyCNP6L0EI5OZS8Ye3zzfjO8F878JySisHw",
    authDomain: "d-social-eb5e7.firebaseapp.com",
    projectId: "d-social-eb5e7",
    storageBucket: "d-social-eb5e7.appspot.com",
    messagingSenderId: "176240081630",
    appId: "1:176240081630:web:2273c40b4dab2e97f6604f",
    measurementId: "G-BP3EXDMDZZ"
  };

  const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);  // Initialize Cloud Storage and get a reference to the service


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app); // Use getFirestore to initialize Firestore



export const auth = getAuth(app);