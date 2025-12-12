// js/login.js
import { auth } from "../firebase.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  
  // 1. Check if user is ALREADY logged in
  // If they are, send them straight to dashboard
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User detected, redirecting to dashboard...");
      window.location.replace("dashboard.html");
    }
  });

  if (!form) return;

  // 2. Handle Login Form Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // We do NOT save to localStorage anymore. 
      // The Dashboard handles fetching data from the Database now.
      
      console.log("Login successful:", userCredential.user.uid);
      
      // Redirect using 'replace' so they can't click Back button to return to login
      window.location.replace("dashboard.html");
      
    } catch (error) {
      console.error("Login Error:", error);
      alert("❌ Login Failed: " + error.message);
    }
  });
});