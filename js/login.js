import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWwVoSru9MDFsxgZvR9jCAPmha9dkwn7I",
  authDomain: "inventory-tracker-251d9.firebaseapp.com",
  projectId: "inventory-tracker-251d9",
  storageBucket: "inventory-tracker-251d9.appspot.com",
  messagingSenderId: "687688694025",
  appId: "1:687688694025:web:8687bfa31dc57a5177bbd8",
  measurementId: "G-XLKM7VBSSD",
};

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form from submitting the default way

    const staffId = document.getElementById("staffId").value.trim();
    const messageElement = document.getElementById("message");

    if (staffId === "") {
      messageElement.textContent = "Please enter a Staff ID.";
      messageElement.style.color = "red";
      return;
    }

    try {
      const q = query(collection(db, "employees"), where("staffId", "==", staffId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Document found, retrieve user data
        const userDoc = querySnapshot.docs[0].data();
        const accessiblePages = userDoc.accessiblePages || []; // Array of accessible pages
        const userType = userDoc.userType; // User type

        // Save user data to localStorage
        localStorage.setItem("staffId", staffId);
        localStorage.setItem("accessiblePages", JSON.stringify(accessiblePages));
        localStorage.setItem("userType", userType);

        // Redirect based on userType
        let redirectTo = "home.html"; // Default redirect
        if (userType === "admin") {
          redirectTo = "maindashboard.html";
        } else if (userType === "employee") {
          // Employees can access both index.html and employeeDashboard.html
          redirectTo = "staffdashboard.html";
        }

        window.location.href = `../html/${redirectTo}`;
      } else {
        // Staff ID does not exist, show error message
        messageElement.textContent = "Staff ID does not exist.";
        messageElement.style.color = "red";
      }
    } catch (error) {
      console.error("Error checking staff ID:", error);
      messageElement.textContent = "An error occurred. Please try again.";
      messageElement.style.color = "red";
    }
  });
});
