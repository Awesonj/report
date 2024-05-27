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

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const staffId = urlParams.get('staffId');
    const messageElement = document.getElementById('message');

    if (!staffId) {
        messageElement.textContent = 'No Staff ID provided.';
        messageElement.style.color = 'red';
        return;
    }

    try {
        // Query the collection for the document with the matching Staff ID
        const q = query(collection(db, 'payslip'), where('staffId', '==', staffId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const infoDisplay = document.getElementById('infoDisplay');
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                for (const [key, value] of Object.entries(data)) {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${key}:</strong> ${value}`;
                    infoDisplay.appendChild(p);
                }
            });
        } else {
            messageElement.textContent = 'Staff ID does not exist in the database.';
            messageElement.style.color = 'red';
        }
    } catch (error) {
        console.error('Error fetching staff information:', error);
        messageElement.textContent = 'An error occurred while fetching the data. Please try again.';
        messageElement.style.color = 'red';
    }
});



$('.menu > ul > li').click(function (e) {
    // Remove the 'active' class from other menu items
    $(this).siblings().removeClass('active');
    // Toggle the 'active' class on the clicked menu item
    $(this).toggleClass('active');
    // Toggle the visibility of the submenu
    $(this).find('ul').slideToggle();
    // Close other submenus if they are open
    $(this).siblings().find('ul').slideUp();
    // Remove the 'active' class from submenu items
    $(this).siblings().find('ul').find('li').removeClass('active');
  });
  
  $('.menu-btn').click(function () {
    // Toggle the 'active' class on the sidebar
    $('.sidebar').toggleClass('active');
  });
      