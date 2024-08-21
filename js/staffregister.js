import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("myForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const employeeData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      otherName: document.getElementById("otherName").value,
      email: document.getElementById("email").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      gender: document.getElementById("gender").value,
      staffId: document.getElementById("staffId").value,
      department: document.getElementById("department").value,
      designation: document.getElementById("designation").value,
      unit: document.getElementById("unit").value,
      userType: document.getElementById("userType").value,
    };

    const messageElement = document.getElementById("message");

    try {
      const docRef = await addDoc(collection(db, "employees"), employeeData);
      console.log("Document written with ID: ", docRef.id);
      messageElement.textContent = "Form submitted successfully!";
      messageElement.style.color = "green";
      document.getElementById("myForm").reset();
    } catch (e) {
      console.error("Error adding document: ", e);
      messageElement.textContent = "An error occurred. Please try again.";
      messageElement.style.color = "red";
    }
  });
});
