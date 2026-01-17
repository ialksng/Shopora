import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY ,
  authDomain: "shopora-c69e8.firebaseapp.com",
  projectId: "shopora-c69e8",
  storageBucket: "shopora-c69e8.firebasestorage.app",
  messagingSenderId: "884401173965",
  appId: "1:884401173965:web:13f3b83d3f42276bf00084",
  measurementId: "G-ZTYBZDGT73"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth , provider}