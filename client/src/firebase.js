// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-834f5.firebaseapp.com",
  projectId: "realestate-834f5",
  storageBucket: "realestate-834f5.appspot.com",
  messagingSenderId: "781051536974",
  appId: "1:781051536974:web:4b48a719670b762e3dc51f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);