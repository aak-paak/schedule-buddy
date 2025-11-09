// ================= Firebase Config =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// ================= Your Firebase Project Config =================
const firebaseConfig = {
  apiKey: "AIzaSyCpuHjVHNhYIi9LOZnFBXp3tOIN97vYP0E",
  authDomain: "schedule-buddy-83aa6.firebaseapp.com",
  projectId: "schedule-buddy-83aa6",
  storageBucket: "schedule-buddy-83aa6.firebasestorage.app",
  messagingSenderId: "828252373447",
  appId: "1:828252373447:web:a78863fc2bcf6a5b2719e2",
  measurementId: "G-LSKV19YXYK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= Export Everything =================
export {
  app,
  auth,
  db,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  setDoc,
  getDoc,
  updateDoc
};
