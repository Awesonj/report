// pull.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Initialize Firebase app and Firestore
const firebaseConfig = {
    apiKey: 'AIzaSyAWwVoSru9MDFsxgZvR9jCAPmha9dkwn7I',
    authDomain: 'inventory-tracker-251d9.firebaseapp.com',
    projectId: 'inventory-tracker-251d9',
    storageBucket: 'inventory-tracker-251d9.appspot.com',
    messagingSenderId: '687688694025',
    appId: '1:687688694025:web:8687bfa31dc57a5177bbd8',
    measurementId: 'G-XLKM7VBSSD',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to display the contents of the Firestore 'reports' collection in the table
async function displayReports() {
    try {
        // Get all documents from the 'reports' collection
        const querySnapshot = await getDocs(collection(db, 'reports', 'report_data'));

        // Counter for serial number (SN)
        let sn = 1;

        // Loop through each document in the query snapshot
        querySnapshot.forEach(doc => {
            // Get data from the document
            const data = doc.data();

            // Create a new table row
            const newRow = document.createElement('tr');

            // Create table cells for each field
            const snCell = document.createElement('td');
            snCell.textContent = sn++; // Increment SN for indentation
            const taskCell = document.createElement('td');
            taskCell.textContent = data.task;
            const locationCell = document.createElement('td');
            locationCell.textContent = data.location;
            const detailsCell = document.createElement('td');
            detailsCell.textContent = data.details;
            const challengesCell = document.createElement('td');
            challengesCell.textContent = data.challenges;
            const recommendationsCell = document.createElement('td');
            recommendationsCell.textContent = data.recommendations;
            const remarksCell = document.createElement('td');
            remarksCell.textContent = data.remarks;
            const dateTimeCell = document.createElement('td');
            dateTimeCell.textContent = data.timestamp; // Assuming timestamp is stored in the Firestore document

            // Append cells to the new row
            newRow.appendChild(snCell);
            newRow.appendChild(taskCell);
            newRow.appendChild(locationCell);
            newRow.appendChild(detailsCell);
            newRow.appendChild(challengesCell);
            newRow.appendChild(recommendationsCell);
            newRow.appendChild(remarksCell);
            newRow.appendChild(dateTimeCell);

            // Append the new row to the table body
            document.getElementById('reportTableBody').appendChild(newRow);
        });
    } catch (error) {
        console.error('Error fetching reports from Firestore:', error);
    }
}

// Function to display the current date
function displayCurrentDate() {
    // Get the current date
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Update the reportDates element
    document.getElementById('reportDates').textContent = 'Report as at ' + currentDate;
}

// Call the function to display reports when the DOM content is loaded
document.addEventListener('DOMContentLoaded', displayReports);

// Call the function to display the current date when the DOM content is loaded
document.addEventListener('DOMContentLoaded', displayCurrentDate);

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
      