// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
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

// Function to display reports from Firestore
async function displayReports() {
  try {
    const staffId = localStorage.getItem("staffId"); // Retrieve staffId from localStorage
    if (!staffId) {
      console.log("Staff ID not found in localStorage");
      return;
    }

    // Retrieve the document using staffId as document ID
    const docRef = doc(db, "reportbt", staffId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Document data:", data); // Log to check if data is retrieved

      // Clear previous table rows
      const tableBody = document.getElementById("reportTableBody");
      if (!tableBody) {
        console.error("Table body element not found.");
        return;
      }
      tableBody.innerHTML = "";

      // Access the reports array from Firestore document
      const reportsArray = data.reports || [];
      console.log("Reports Array:", reportsArray); // Log to check if reports array is retrieved

      let sn = 1;

      // Filter reports for today's date
      const today = new Date().toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
      const filteredReports = reportsArray.filter((report) => {
        const reportDate = report.dateTime.split(",")[0].trim(); // Split date and time and trim whitespace
        return reportDate === today;
      });
      console.log("Filtered Reports:", filteredReports);

      // Iterate over each report in the filtered reports array
      filteredReports.forEach((report) => {
        // Create a new table row for each report
        const newRow = createTableRow(sn++, report);
        tableBody.appendChild(newRow);
      });

      // Display success message after reports are displayed
      console.log("Reports displayed successfully!");
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching report from Firestore:", error);
  }
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
  const progressCell = document.createElement("td");
  progressCell.textContent = report.progressOption || "";
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

// Function to filter reports based on selected date
async function filterReports() {
    try {
      const selectedDate = document.getElementById("filterDate").value; // Assuming you have an input with id 'filterDate' for date selection
      const tableBody = document.getElementById("reportTableBody");
      if (!tableBody) {
        console.error("Table body element not found.");
        return;
      }
      tableBody.innerHTML = ""; // Clear previous table rows
  
      const staffId = localStorage.getItem("staffId");
      if (!staffId) {
        console.log("Staff ID not found in localStorage");
        return;
      }
  
      // Retrieve the document using staffId as document ID
      const docRef = doc(db, "reportbt", staffId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        const reportsArray = data.reports || [];
  
        // Filter reports for the selected date
        const filteredReports = reportsArray.filter((report) => {
          // Check each dateTime entry in the report
          const reportDate = report.dateTime; // Assuming dateTime is in format 'MM/DD/YYYY, HH:MM:SS AM/PM'
          
          // Convert reportDate to a Date object
          const reportDateTime = new Date(reportDate);
  
          // Format the selected date for comparison
          const selectedDateTime = new Date(selectedDate);
  
          // Check if the date parts match (ignoring time)
          return reportDateTime.toLocaleDateString() === selectedDateTime.toLocaleDateString();
        });
  
        console.log("Filtered Reports:", filteredReports);
  
        // Display filtered reports in the table
        if (filteredReports.length > 0) {
          let sn = 1;
          filteredReports.forEach((report) => {
            const newRow = createTableRow(sn++, report);
            tableBody.appendChild(newRow);
          });
          console.log("Reports filtered and displayed successfully!");
        } else {
          console.log("No reports found for the selected date.");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error filtering reports:", error);
    }
  }
  

// Event listener for the filter button click
document.addEventListener("DOMContentLoaded", () => {
  const filterButton = document.getElementById("filterButton");
  if (filterButton) {
    filterButton.addEventListener("click", filterReports);
  } else {
    console.error("Filter button not found.");
  }
});

// Function to display the current date
function displayCurrentDate() {
  // Get the current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Update the reportDates element
  const reportDatesElement = document.getElementById("reportDates");
  if (reportDatesElement) {
    reportDatesElement.textContent = `Report as at ${currentDate}`;
  } else {
    console.error('Element with id "reportDates" not found.');
  }
}

// Call the function to display reports when the DOM content is loaded
document.addEventListener("DOMContentLoaded", displayReports);

// Call the function to display the current date when the DOM content is loaded
document.addEventListener("DOMContentLoaded", displayCurrentDate);

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
