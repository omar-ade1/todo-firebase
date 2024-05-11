import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRD1UskyEe3QQtIh4b8G2vt0gjd7IjqjE",
  authDomain: "todo-firebase-c04fb.firebaseapp.com",
  projectId: "todo-firebase-c04fb",
  storageBucket: "todo-firebase-c04fb.appspot.com",
  messagingSenderId: "591497490870",
  appId: "1:591497490870:web:65c7ad0901bd004caa1117"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
