import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, collection, doc, query as firestoreQuery, where, getDocs, getDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

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
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function fetchUserData() {
    try {
        // Retrieve the staffId from local storage
        const staffId = localStorage.getItem("staffId");
        console.log(staffId);
        // Check if staffId exists
        if (!staffId) {
            console.log("No staff ID found in localStorage.");
            return;
        }

        // Query Firestore for user data
        const userDocRef = doc(db, "employees", staffId);
        // console.log(userDocRef);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Data:", userData); // Inspect the user data
            // Display user name
            document.getElementById("userData").textContent = `${userData.firstName} ${userData.lastName}`;
        } else {
            console.log("User document not found.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Fetch user data on page load
window.onload = fetchUserData;

// Function to display reports
async function displayReports() {
  try {
    // Retrieve the staffId from local storage
    const staffId = localStorage.getItem("staffId");
    
    // Check if staffId exists
    if (!staffId) {
      console.log("No staff ID found in localStorage.");
      return;
    }

    // Get selected date from the filter input
    const filterDateElement = document.getElementById("filterDate");
    if (!filterDateElement) {
      console.error("Filter Date element not found.");
      return;
    }
    const selectedDate = filterDateElement.value;

    // Format selectedDate to match the Firestore date format (YYYY-MM-DD)
    const formattedDate = selectedDate;

    // Reference to the specific date document
    const dateDocRef = doc(db, `reportbt/${staffId}/dailyReports/${formattedDate}`);
    const dateDoc = await getDoc(dateDocRef);

    const reportTableBody = document.getElementById("reportTableBody");
    if (!reportTableBody) {
      console.error("Report Table Body element not found.");
      return;
    }
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
document.getElementById("filterDate").addEventListener("change", displayReports);
document.getElementById("filterButton").addEventListener("click", displayReports);

// Fetch user data and reports on page load
window.onload = async function() {
  await fetchUserData();
  await displayReports();
};

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
  
  $(".menu-btn").click(function () {
    // Toggle the 'active' class on the sidebar
    $(".sidebar").toggleClass("active");
  });
  