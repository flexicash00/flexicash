// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js"; 

const firebaseConfig = {
  apiKey: "AIzaSyCJVMISPdm3FiUiFsy6QRCwSmdqjSsAgM4",
  authDomain: "flexicash-prod.firebaseapp.com",
  projectId: "flexicash-prod",
  storageBucket: "flexicash-prod.firebasestorage.app",
  messagingSenderId: "66396113487",
  appId: "1:66396113487:web:9c97ffe6142b4a4df4b83a",
  measurementId: "G-C56LE46X0G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // ✅ Initialize Database

export { auth, db };