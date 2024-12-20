// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDtdgabIKn6wKdlumnbCTK1GD8sOdjiYTQ",
  authDomain: "mern-zoney.firebaseapp.com",
  projectId: "mern-zoney",
  storageBucket: "mern-zoney.firebasestorage.app",
  messagingSenderId: "520506529335",
  appId: "1:520506529335:web:a2e9b0c74a2055648751b2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);