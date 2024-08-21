// Initialize Firebase app and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAWwVoSru9MDFsxgZvR9jCAPmha9dkwn7I',
  authDomain: 'inventory-tracker-251d9.firebaseapp.com',
  projectId: 'inventory-tracker-251d9',
  storageBucket: 'inventory-tracker-251d9.appspot.com',
  messagingSenderId: '687688694025',
  appId: '1:687688694025:web:8687bfa31dc57a5177bbd8',
  measurementId: 'G-XLKM7VBSSD',
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

// Fetch all registered staff details from Firestore
async function fetchStaffDetails() {
  try {
    const querySnapshot = await getDocs(collection(db, "employees"));
    const staffTableBody = document.getElementById("staffTableBody");

    staffTableBody.innerHTML = ""; // Clear previous rows

    querySnapshot.forEach((doc) => {
      const staffData = doc.data();
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${staffData.firstName} ${staffData.lastName}</td>
        <td>${staffData.email}</td>
        <td>${staffData.phoneNumber}</td>
        <td>${staffData.staffId}</td>
        <td>${staffData.department}</td>
        <td>${staffData.designation}</td>
        <td><button data-staff-id="${staffData.staffId}" class="assign-task-btn">Assign Task</button></td>
      `;

      staffTableBody.appendChild(row);

      
    });

    // Attach event listeners to the buttons after the table has been populated
    attachEventListeners();
  } catch (error) {
    console.error("Error fetching staff details:", error);
  }
}

// Function to open the task assignment popup
function openPopup(staffId) {
  document.getElementById("popupStaffId").value = staffId;
  document.getElementById("taskPopup").classList.add("active");
}

// Function to close the task assignment popup
function closePopup() {
  document.getElementById("taskPopup").classList.remove("active");
}

// Function to assign task to a staff member
async function assignTask() {
  const staffId = document.getElementById("popupStaffId").value;
  const task = document.getElementById("task").value;
  const location = document.getElementById("location").value;
  const details = document.getElementById("details").value;
  const priority = document.getElementById("priority").value;
  const dateTime = new Date().toLocaleString();

  const taskData = {
    task,
    location,
    details,
    priorityOption: priority,
    progressOption: "NotStarted",
    dateTime
  };

  const notificationData = {
    message: `A new task has been assigned: ${task}`,
    dateTime
  };

  try {
    const docRef = doc(db, "reportbt", staffId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const reportsArray = data.reports || [];
      reportsArray.push(taskData);

      await setDoc(docRef, { reports: reportsArray }, { merge: true });
    } else {
      await setDoc(docRef, { reports: [taskData] });
    }

    // Update notifications
    const notificationsRef = doc(db, "notifications", staffId);
    const notificationsSnap = await getDoc(notificationsRef);

    if (notificationsSnap.exists()) {
      const data = notificationsSnap.data();
      const notificationsArray = data.notifications || [];
      notificationsArray.push(notificationData);

      await setDoc(notificationsRef, { notifications: notificationsArray }, { merge: true });
    } else {
      await setDoc(notificationsRef, { notifications: [notificationData] });
    }

    closePopup();
    alert("Task assigned successfully!");
  } catch (error) {
    console.error("Error assigning task:", error);
    alert("Error assigning task. Please try again.");
  }
}

// Attach event listeners to dynamically created buttons
function attachEventListeners() {
  const assignTaskButtons = document.querySelectorAll('.assign-task-btn');
  assignTaskButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const staffId = event.target.getAttribute('data-staff-id');
      openPopup(staffId);
    });
  });

  const assignTaskButton = document.getElementById('assignTaskButton');
  if (assignTaskButton) {
    assignTaskButton.addEventListener('click', assignTask);
  }

  const cancelButton = document.getElementById('cancelButton');
  if (cancelButton) {
    cancelButton.addEventListener('click', closePopup);
  }
}

// Initialize the page by fetching staff details
fetchStaffDetails();
