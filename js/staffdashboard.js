import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, collection, query as firestoreQuery, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

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

// Initialize Firebase app
// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);


// Initialize Firebase app and Firestore
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Retrieve staffId from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const staffId = urlParams.get("staffId");

    // Query Firestore for documents where staffId matches
    const q = firestoreQuery(
      collection(db, "luthreport"),
      where("staffId", "==", staffId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming staffId is unique, retrieve the first document
      const userData = querySnapshot.docs[0].data();

      // Populate user profile container
      document.getElementById(
        "userName"
      ).textContent = `${userData.firstName} ${userData.lastName}`;
      document.getElementById("userDesignation").textContent =
        userData.designation;
      document.getElementById(
        "userStaffId"
      ).textContent = `Staff ID: ${userData.staffId}`;
      document.getElementById("userImage").src =
        userData.userImageURL || "../img/default-user-image.png";

      // Populate contact info container
      document.getElementById(
        "userPhoneNumber"
      ).textContent = `Phone: ${userData.phoneNumber}`;
      document.getElementById(
        "userEmail"
      ).textContent = `Email: ${userData.email}`;
    } else {
      console.log("User document not found.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});