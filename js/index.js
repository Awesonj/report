import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  runTransaction, // Ensure runTransaction is imported
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
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
  
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
  
    let submitButton = document.getElementById("submit");
    let saveButton = document.getElementById("save");
    let reportTableBody = document.getElementById("reportTableBody");
    let reportDateSpan = document.getElementById("reportDate");
    let reportDatesHeading = document.getElementById("reportDates");
  
    // Set the current date in the report date span and heading
    let currentDate = new Date().toLocaleDateString();
    reportDateSpan.textContent = `Report Date: ${currentDate}`;
    reportDatesHeading.textContent = `Report as at ${currentDate}`;
  
    // Initialize serial number
    let serialNumber = 1;
  
    // Get all textarea elements
    let textareas = document.querySelectorAll("textarea");
  
    // Function to check if all textareas are filled
    function checkTextareas() {
      let allFilled = true;
      textareas.forEach((textarea) => {
        if (textarea.value.trim() === "") {
          allFilled = false;
        }
      });
      submitButton.disabled = !allFilled;
    }
  
    // Add event listeners to all textareas to check for input
    textareas.forEach((textarea) => {
      textarea.addEventListener("input", checkTextareas);
    });
  
    // Function to add a new row to the table
    function addReportRow() {
      // Get the values from the text areas
      let task = document.getElementById("task").value;
      let location = document.getElementById("location").value;
      let details = document.getElementById("details").value;
      let priorityOption = document.getElementById("priorityOption").value;
      let progressOption = document.getElementById("progressOption").value;
      let remarks = document.getElementById("remarks").value;
      let dateTime = new Date().toLocaleString();
  
      // Create a new row
      let newRow = document.createElement("tr");
  
      // Create and append cells to the row
      let cells = [
        serialNumber,
        task,
        location,
        details,
        remarks,
        priorityOption,
        progressOption,
        dateTime,
      ];
      cells.forEach((cellContent) => {
        let cell = document.createElement("td");
        cell.textContent = cellContent;
        newRow.appendChild(cell);
      });
  
      // Append the new row to the table body
      reportTableBody.appendChild(newRow);
  
      // Increment the serial number
      serialNumber++;
  
      // Clear the text areas after submission
      textareas.forEach((textarea) => {
        textarea.value = "";
      });
  
      // Disable the submit button again until all fields are filled
      submitButton.disabled = true;
    }
  
    // Handle Firestore operations within an async function
    const fetchUserData = async () => {
      const staffId = localStorage.getItem("staffId");
  
      if (staffId) {
        try {
          // Query Firestore for user data using staffId
          const q = query(
            collection(db, "employees"),
            where("staffId", "==", staffId)
          );
          const querySnapshot = await getDocs(q);
          console.log("Query snapshot:", querySnapshot);
  
          if (!querySnapshot.empty) {
            // Since staffId is not the document ID, we assume there's only one matching document
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              // Use userData as needed, e.g., display user's name
              document.getElementById(
                "userData"
              ).innerHTML = `<p>Welcome, ${userData.firstName} ${userData.lastName}</p>`;
              console.log("User data:", userData);
            });
          } else {
            console.log("No document found with staffId:", staffId);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("Staff ID not found in localStorage");
      }
    };
  


   

    // Function to save all table data to Firestore under one document
    async function saveReportData() {
      const rows = reportTableBody.querySelectorAll("tr");
      let reportData = [];
    
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length === 8) {
          reportData.push({
            sn: cells[0].textContent,
            task: cells[1].textContent,
            location: cells[2].textContent,
            details: cells[3].textContent,
            remarks: cells[4].textContent,
            priorityOption: cells[5].textContent,
            progressOption: cells[6].textContent,
            dateTime: cells[7].textContent,
          });
        }
      });
    
      const staffId = localStorage.getItem("staffId");
    
      if (staffId) {
        try {
          const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    
          // Reference to the Firestore document for the specific staff and date
          const reportRef = doc(collection(db, "reportbt"), staffId, "dailyReports", today);
    
          // Use a transaction to handle concurrent updates
          await runTransaction(db, async (transaction) => {
            const docSnapshot = await transaction.get(reportRef);
            let existingData = docSnapshot.exists() ? docSnapshot.data() : { reports: {} };
    
            // Add or update today's data
            existingData.reports[today] = reportData;
    
            // Perform the update
            transaction.set(reportRef, existingData, { merge: true });
          });
    
          alert("Saved successfully");
        } catch (error) {
          console.error("Error saving report data: ", error);
        }
      } else {
        console.log("Staff ID not found in localStorage");
      }
    }
    

  
  
    // Add event listener to the submit button
    submitButton.addEventListener("click", addReportRow);
  
    // Add event listener to the save button
    saveButton.addEventListener("click", saveReportData);
  
    // Initially disable the submit button
    submitButton.disabled = true;
  
    // Fetch user data on DOMContentLoaded
    fetchUserData();
  
    // Menu click functionality
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
  
    // Menu button click functionality
    $(".menu-btn").click(function () {
      // Toggle the 'active' class on the sidebar
      $(".sidebar").toggleClass("active");
    });
  });