import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
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

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    let submitButton = document.getElementById('submit');
    let saveButton = document.getElementById('save');
    let reportTableBody = document.getElementById('reportTableBody');
    let reportDateSpan = document.getElementById('reportDate');
    let reportDatesHeading = document.getElementById('reportDates');

    // Set the current date in the report date span and heading
    let currentDate = new Date().toLocaleDateString();
    reportDateSpan.textContent = `Report Date: ${currentDate}`;
    reportDatesHeading.textContent = `Report as at ${currentDate}`;

    // Initialize serial number
    let serialNumber = 1;

    // Get all textarea elements
    let textareas = document.querySelectorAll('textarea');

    // Function to check if all textareas are filled
    function checkTextareas() {
        let allFilled = true;
        textareas.forEach(textarea => {
            if (textarea.value.trim() === '') {
                allFilled = false;
            }
        });
        submitButton.disabled = !allFilled;
    }

    // Add event listeners to all textareas to check for input
    textareas.forEach(textarea => {
        textarea.addEventListener('input', checkTextareas);
    });

    // Function to add a new row to the table
    function addReportRow() {
        // Get the values from the text areas
        let task = document.getElementById('task').value;
        let location = document.getElementById('location').value;
        let details = document.getElementById('details').value;
        let challenges = document.getElementById('challenges').value;
        let recommendations = document.getElementById('recommendations').value;
        let remarks = document.getElementById('remarks').value;
        let dateTime = new Date().toLocaleString();

        // Create a new row
        let newRow = document.createElement('tr');

        // Create and append cells to the row
        let cells = [serialNumber, task, location, details, challenges, recommendations, remarks, dateTime];
        cells.forEach(cellContent => {
            let cell = document.createElement('td');
            cell.textContent = cellContent;
            newRow.appendChild(cell);
        });

        // Append the new row to the table body
        reportTableBody.appendChild(newRow);

        // Increment the serial number
        serialNumber++;

        // Clear the text areas after submission
        textareas.forEach(textarea => {
            textarea.value = '';
        });

        // Disable the submit button again until all fields are filled
        submitButton.disabled = true;
    }

    // Function to save all table data to Firestore under one document
    async function saveReportData() {
        const rows = reportTableBody.querySelectorAll('tr');
        let reportData = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 8) {
                reportData.push({
                    sn: cells[0].textContent,
                    task: cells[1].textContent,
                    location: cells[2].textContent,
                    details: cells[3].textContent,
                    challenges: cells[4].textContent,
                    recommendations: cells[5].textContent,
                    remarks: cells[6].textContent,
                    dateTime: cells[7].textContent
                });
            }
        });

        try {
            await setDoc(doc(db, 'reports', 'report_data'), { reportData });
            alert('Saved successfully');
        } catch (error) {
            console.error("Error saving report data: ", error);
        }
    }

    // Add event listener to the submit button
    submitButton.addEventListener('click', addReportRow);

    // Add event listener to the save button
    saveButton.addEventListener('click', saveReportData);

    // Initially disable the submit button
    submitButton.disabled = true;
});
