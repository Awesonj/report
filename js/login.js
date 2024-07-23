// Import and configure Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWwVoSru9MDFsxgZvR9jCAPmha9dkwn7I",
    authDomain: "inventory-tracker-251d9.firebaseapp.com",
    projectId: "inventory-tracker-251d9",
    storageBucket: "inventory-tracker-251d9.appspot.com",
    messagingSenderId: "687688694025",
    appId: "1:687688694025:web:8687bfa31dc57a5177bbd8",
    measurementId: "G-XLKM7VBSSD"
};

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from submitting the default way

        const staffId = document.getElementById('staffId').value.trim();
        const messageElement = document.getElementById('message');

        console.log('Attempting to login with Staff ID:', staffId);

        if (staffId === "") {
            messageElement.textContent = 'Please enter a Staff ID.';
            messageElement.style.color = 'red';
            return;
        }

        try {
            // Query the collection for the document with the matching Staff ID
            const q = query(collection(db, 'luthreport'), where('staffId', '==', staffId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Staff ID exists, redirect to dashboard.html with the staffId as a parameter
                console.log('Staff ID exists. Redirecting to dashboard.html');
                window.location.href = `../html/dashboard.html?staffId=${staffId}`;
            } else {
                // Staff ID does not exist, show error message
                console.log('Staff ID does not exist.');
                messageElement.textContent = 'Staff ID does not exist.';
                messageElement.style.color = 'red';
            }
        } catch (error) {
            console.error('Error checking staff ID:', error);
            messageElement.textContent = 'An error occurred. Please try again.';
            messageElement.style.color = 'red';
        }
    });
});
