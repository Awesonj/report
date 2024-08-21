// Initialize Firebase app and Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Initialize Firebase app and Firestore
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

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
async function displayReports() {
  try {
    const staffId = document.getElementById("staffSelect").value;
    const selectedDate = document.getElementById("filterDate").value;

    console.log("Selected Staff ID:", staffId);
    console.log("Selected Date:", selectedDate);

    // Query report documents that match the actualStaffId
    const q = query(collection(db, "reportbt"), where("staffId", "==", staffId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      let reportsArray = [];

      // Collect all reports into a single array
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Ensure 'reports' field exists and is an array
        if (data.reports && Array.isArray(data.reports)) {
          reportsArray = reportsArray.concat(data.reports);
        }
      });

      // Filter reports for the selected date
      const filteredReports = reportsArray.filter((report) => {
        const reportDate = report.dateTime; // Assuming dateTime is in format 'MM/DD/YYYY, HH:MM:SS AM/PM'

        // Convert reportDate to a Date object
        const reportDateTime = new Date(reportDate);

        // Format the selected date for comparison
        const selectedDateTime = new Date(selectedDate);

        // Check if the date parts match (ignoring time)
        return (
          reportDateTime.toLocaleDateString() ===
          selectedDateTime.toLocaleDateString()
        );
      });

      console.log("Filtered Reports:", filteredReports);

      // Display filtered reports in the table
      renderReports(filteredReports);

      // Calculate and update performance gauge
      updatePerformanceGauge(filteredReports);
    } else {
      console.log(
        "No reports found for the selected staff member in 'reportbt' collection."
      );
      // Clear table when no reports are found
      renderReports([]);
      updatePerformanceGauge([]);
    }
  } catch (error) {
    console.error("Error fetching and displaying reports:", error);
  }
}

// Function to render reports in the table
function renderReports(reports) {
  const tableBody = document.getElementById("reportTableBody");
  tableBody.innerHTML = ""; // Clear previous table rows

  let sn = 1;
  reports.forEach((report) => {
    const newRow = createTableRow(sn++, report);
    tableBody.appendChild(newRow);
  });
}


// Function to create a table row for a report
function createTableRow(sn, report) {
  const newRow = document.createElement("tr");

  // Create table cells for each field
  const snCell = document.createElement("td");
  snCell.textContent = sn;
  const taskCell = document.createElement("td");
  taskCell.textContent = report.task || "";
  const locationCell = document.createElement("td");
  locationCell.textContent = report.location || "";
  const detailsCell = document.createElement("td");
  detailsCell.textContent = report.details || "";
  const remarksCell = document.createElement("td");
  remarksCell.textContent = report.remarks || "";
  const priorityCell = document.createElement("td");
  priorityCell.textContent = report.priorityOption || "";

  // Create a select element for progressOption
  const progressCell = document.createElement("td");
  const progressSelect = document.createElement("select");
  progressSelect.addEventListener("change", async (event) => {
    const newValue = event.target.value;
    await updateProgress(report, newValue);
    // Refresh reports after progress update
    displayReports();
  });
  const progressOptions = ["NotStarted", "InProgress", "Completed"];
  progressOptions.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    progressSelect.appendChild(optionElement);
  });
  progressSelect.value = report.progressOption || ""; // Set initial value based on Firestore data
  progressCell.appendChild(progressSelect);

  const dateTimeCell = document.createElement("td");
  dateTimeCell.textContent = report.dateTime || "";

  // Append cells to the new row
  newRow.appendChild(snCell);
  newRow.appendChild(taskCell);
  newRow.appendChild(locationCell);
  newRow.appendChild(detailsCell);
  newRow.appendChild(remarksCell);
  newRow.appendChild(priorityCell);
  newRow.appendChild(progressCell);
  newRow.appendChild(dateTimeCell);

  return newRow;
}

// Function to update progress in Firestore
async function updateProgress(report, newProgress) {
  try {
    const staffId = document.getElementById("staffSelect").value;

    // Query for the specific report based on staffId
    const q = query(collection(db, "reportbt"), where("staffId", "==", staffId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Assuming there's only one document per staffId in "reportbt"
      const docRef = doc(db, "reportbt", querySnapshot.docs[0].id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const reportsArray = data.reports || [];

        // Find the index of the report to update
        const reportIndex = reportsArray.findIndex((r) => r.sn === report.sn);

        if (reportIndex !== -1) {
          // Update the progressOption field
          reportsArray[reportIndex].progressOption = newProgress;

          // Update Firestore document with the modified reportsArray
          await setDoc(docRef, { reports: reportsArray }, { merge: true });

          console.log("Progress updated successfully:", newProgress);
        } else {
          console.log("Report not found with SN:", report.sn);
        }
      } else {
        console.log("No such document!");
      }
    } else {
      console.log(
        "No document found for the selected staffId in reportbt collection."
      );
    }
  } catch (error) {
    console.error("Error updating progress:", error);
  }
}

// Initialize the page by fetching staff details
fetchStaffDetails();

// Function to update the performance gauge
function updatePerformanceGauge(reports) {
  const totalReports = reports.length;
  const completedReports = reports.filter(
    (report) => report.progressOption === "Completed"
  ).length;
  const percentage =
    totalReports > 0 ? (completedReports / totalReports) * 100 : 0;

  const gaugeFill = document.getElementById("gaugeFill");
  gaugeFill.style.width = `${percentage}%`;
}

// Event listener for filter button click
document.addEventListener("DOMContentLoaded", (event) => {
  fetchStaffDetails();
  const filterButton = document.getElementById("filterButton");
  filterButton.addEventListener("click", displayReports);
});

// Fetch staff details when the page loads
fetchStaffDetails();

// Toggle active class on sidebar menu items
$(".menu > ul > li").click(function (e) {
  // Remove the 'active' class from other menu items
  $(this).siblings().removeClass("active");
  // Toggle the 'active' class on the clicked menu item
  $(this).toggleClass("active");
  // Toggle the visibility of the submenu
  $(this).find("ul").slideToggle();
  // Close other submenus if they are open
  $(this).siblings().find("ul").slideUp();
  // Remove the 'active' class from submenu items
  $(this).siblings().find("ul").find("li").removeClass("active");
});

// Toggle active class on sidebar
$(".menu-btn").click(function () {
  // Toggle the 'active' class on the sidebar
  $(".sidebar").toggleClass("active");
});
