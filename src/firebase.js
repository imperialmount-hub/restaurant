// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8la7s-OADrEw4cPcgjMoHH1qV_Ncdkmo",
  authDomain: "impreal-restourant.firebaseapp.com",
  projectId: "impreal-restourant",
  storageBucket: "impreal-restourant.firebasestorage.app",
  messagingSenderId: "1078262652132",
  appId: "1:1078262652132:web:972bfaaa26298d88a7e0f1",
  measurementId: "G-PKSCZY4XJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };
