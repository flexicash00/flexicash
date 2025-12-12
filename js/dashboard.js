// js/dashboard.js
import { auth, db } from "../firebase.js"; 
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const userNameEl = document.getElementById("userName");
  const dashboardInfo = document.getElementById("dashboardInfo");
  const logoutBtn = document.getElementById("logoutBtn");

  // ✅ SECURITY CHECK: Listen to Auth Changes
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // --- USER IS LOGGED IN ---
      console.log("User logged in:", user.uid);

      // 1. Fetch User Data from Database (Firestore)
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // 2. Update UI with Database Data
          if (userNameEl) userNameEl.textContent = data.name;

          if (dashboardInfo) {
            // Determine Status Color and Message
            let statusColor = "#f59e0b"; // Orange (Pending)
            let statusBg = "#fffbeb"; // Light Orange BG
            let statusText = "Pending Approval";
            
            if(data.status === "Approved") {
                statusColor = "#10b981"; // Green
                statusBg = "#d1fae5";
                statusText = "Approved";
            }
            if(data.status === "Rejected") {
                statusColor = "#ef4444"; // Red
                statusBg = "#fee2e2";
                statusText = "Declined";
            }

            // Create a fake "Application ID" using the first 8 chars of their ID
            const appID = user.uid ? user.uid.slice(0, 8).toUpperCase() : "APP-001"; 

            // ✅ PROFESSIONAL DASHBOARD LAYOUT
            dashboardInfo.innerHTML = `
              <!-- Account Section -->
              <div class="info-card" style="border-left: 4px solid #0056b3;">
                <h3>👤 Account Profile</h3>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Member ID:</strong> ${appID}</p> 
              </div>

              <!-- Loan Section -->
              <div class="info-card">
                <h3>💰 Loan Application #${appID}</h3>
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span>Amount Requested:</span>
                    <span style="font-size: 1.2rem; font-weight:bold;">$${data.loan_amount}</span>
                </div>

                <div style="background: ${statusBg}; padding: 10px; border-radius: 6px; border: 1px solid ${statusColor};">
                    <p style="margin:0; color: ${statusColor}; font-weight: bold;">
                        Status: ${statusText}
                    </p>
                    <small style="color: #666;">
                        ${statusText === "Pending Approval" ? "Current stage: Underwriter Review. Please allow 24-48 hours." : "Check your email for further instructions."}
                    </small>
                </div>
              </div>

              <!-- Action Section -->
              <div class="info-card" style="text-align:center;">
                 <p style="font-size:0.9rem; color:#666;">Need to change your details?</p>
                 <a href="mailto:support@flexicash.com" style="color: #0056b3; text-decoration: none; font-weight: bold;">Contact Loan Officer</a>
              </div>
            `;
          }
        } else {
          // User exists in Auth but no data in DB
          if(dashboardInfo) dashboardInfo.innerHTML = "<p>No application found. Please apply.</p>";
        }

      } catch (error) {
        // ✅ This is the CATCH block that was missing
        console.error("Error fetching data:", error);
        if(dashboardInfo) dashboardInfo.innerHTML = "<p style='color:red'>Error loading data. Please refresh.</p>";
      }

    } else {
      // --- USER IS NOT LOGGED IN ---
      // 🚪 Force Redirect to Login
      console.log("No user found, redirecting...");
      window.location.replace("login.html");
    }
  });

  // ✅ LOGOUT FUNCTION
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // 1. Sign out from Firebase
      signOut(auth).then(() => {
        // 2. Clear any local junk
        localStorage.clear();
        sessionStorage.clear();
        // 3. Force Redirect
        window.location.replace("login.html");
      }).catch((error) => {
        console.error("Error signing out:", error);
      });
    });
  }
});