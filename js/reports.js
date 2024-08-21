import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";


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

// Fetch staff details from employees collection
async function fetchStaffDetails() {
  try {
    const querySnapshot = await getDocs(collection(db, "employees"));
    const staffSelect = document.getElementById("staffSelect");

    staffSelect.innerHTML = ""; // Clear previous options

    querySnapshot.forEach((doc) => {
      const staffData = doc.data();
      const option = document.createElement("option");
      option.value = staffData.staffId; // Use staffId as the value
      option.textContent = `${staffData.firstName} ${staffData.lastName}`;
      staffSelect.appendChild(option);
    });

    // Trigger report display for default selected staff member
    displayReports();
  } catch (error) {
    console.error("Error fetching staff details:", error);
  }
}

// Function to display reports
// Function to display reports
// Function to display reports
// Function to display reports
async function displayReports() {
    try {
      const staffId = document.getElementById("staffSelect").value;
      const selectedDate = document.getElementById("filterDate").value;
  
      // Format selectedDate to match the Firestore date format (YYYY-MM-DD)
      const formattedDate = selectedDate;
  
      // Reference to the specific date document
      const dateDocRef = doc(db, `reportbt/${staffId}/dailyReports/${formattedDate}`);
      const dateDoc = await getDoc(dateDocRef);
  
      const reportTableBody = document.getElementById("reportTableBody");
      reportTableBody.innerHTML = ""; // Clear previous reports
  
      if (dateDoc.exists()) {
        const dateData = dateDoc.data();
        console.log("Date Data:", dateData); // Inspect the date data
  
        const reportsObject = dateData.reports; // Access the reports object
        const reports = reportsObject[formattedDate] || []; // Get the array for the specific date
  
        if (Array.isArray(reports)) {
          reports.forEach((report, index) => {
            const row = document.createElement("tr");
  
            const snCell = document.createElement("td");
            snCell.textContent = report.sn || (index + 1); // Use 'sn' if available, otherwise index + 1
            row.appendChild(snCell);
  
            const taskCell = document.createElement("td");
            taskCell.textContent = report.task || "";
            row.appendChild(taskCell);
  
            const locationCell = document.createElement("td");
            locationCell.textContent = report.location || "";
            row.appendChild(locationCell);
  
            const detailsCell = document.createElement("td");
            detailsCell.textContent = report.details || "";
            row.appendChild(detailsCell);
  
            const commentsCell = document.createElement("td");
            commentsCell.textContent = report.remarks || ""; // Adjusted to match the correct field name
            row.appendChild(commentsCell);
  
            const priorityCell = document.createElement("td");
            priorityCell.textContent = report.priorityOption || "";
            row.appendChild(priorityCell);
  
            const progressCell = document.createElement("td");
            progressCell.textContent = report.progressOption || "";
            row.appendChild(progressCell);
  
            const dateTimeCell = document.createElement("td");
            dateTimeCell.textContent = report.dateTime || "";
            row.appendChild(dateTimeCell);
  
            reportTableBody.appendChild(row);
          });
          
  
          console.log("Reports displayed successfully.");
        } else {
          alert("No reports found for the selected date. Type:", typeof reports);
          console.log("Reports is not an array. Type:", typeof reports);
        }
      } else {
        console.log("No report found for the selected date.");
      }
    } catch (error) {
      console.error("Error displaying reports:", error);
    }
  }
  

// Event listeners for filters
document.getElementById("staffSelect").addEventListener("change", displayReports);
document.getElementById("filterDate").addEventListener("change", displayReports);
document.getElementById("filterButton").addEventListener("click", displayReports);

// Initial fetch of staff details on page load
window.onload = fetchStaffDetails;