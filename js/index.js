// Import necessary Firebase modules at the top of the script

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

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

// Event listener for the submit button
document.getElementById('submit').addEventListener('click', async function() {
    // Get the values of daily report, location, comments, and remarks
    const dailyReport = document.getElementById('dailyReport').value.trim();
    const location = document.getElementById('location').value.trim();
    const comments = document.getElementById('comments').value.trim();
    const remarks = document.getElementById('remarks').value.trim();

    // Check if any of the text areas are empty
    if (dailyReport === '' || location === '' || comments === '' || remarks === '') {
        alert('Please fill in all fields before submitting the report.');
        return;
    }

    try {
        // Add the report to Firestore
        const docRef = await addDoc(collection(db, 'reports'), {
            dailyReport,
            location,
            comments,
            remarks,
            timestamp: new Date().toISOString() // Add timestamp for sorting purposes
        });

        // Clear the form fields after submission
        document.getElementById('dailyReport').value = '';
        document.getElementById('location').value = '';
        document.getElementById('comments').value = '';
        document.getElementById('remarks').value = '';

        // Retrieve all reports from Firestore and populate the table
        const querySnapshot = await getDocs(collection(db, 'reports'));
        document.getElementById('reportTableBody').innerHTML = ''; // Clear existing table rows
        querySnapshot.forEach((doc, index) => {
            const data = doc.data();
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${index + 1}</td>
                <td>${data.location}</td>
                <td>${data.comments}</td>
                <td>${data.remarks}</td>
            `;
            document.getElementById('reportTableBody').appendChild(newRow);
        });
    } catch (error) {
        console.error('Error adding report to Firestore:', error);
    }
});
