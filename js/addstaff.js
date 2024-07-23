// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import {
  getFirestore,
  collection,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAWwVoSru9MDFsxgZvR9jCAPmha9dkwn7I',
  authDomain: 'inventory-tracker-251d9.firebaseapp.com',
  projectId: 'inventory-tracker-251d9',
  storageBucket: 'inventory-tracker-251d9.appspot.com',
  messagingSenderId: '687688694025',
  appId: '1:687688694025:web:8687bfa31dc57a5177bbd8',
  measurementId: 'G-XLKM7VBSSD',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

document.addEventListener('DOMContentLoaded', async () => {
  const staffDetailsElement = document.getElementById('staffDetails');

  try {
    // Query all documents from the luthreport collection
    const luthreportCollection = collection(db, 'luthreport');
    const querySnapshot = await getDocs(luthreportCollection);

    if (!querySnapshot.empty) {
      const pageSize = 10;
      let currentPage = 1;
      let totalPages = Math.ceil(querySnapshot.size / pageSize);

      // Display initial page
      displayStaffRecords(querySnapshot.docs, currentPage, pageSize);

      // Pagination controls
      const prevButton = document.getElementById('prevButton');
      const nextButton = document.getElementById('nextButton');

      prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          displayStaffRecords(querySnapshot.docs, currentPage, pageSize);
        }
      });

      nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          displayStaffRecords(querySnapshot.docs, currentPage, pageSize);
        }
      });
    } else {
      staffDetailsElement.innerHTML =
        '<p>No Staff Records found in the collection.</p>';
      console.error('No Records found in the collection.');
    }
  } catch (error) {
    console.error('Error fetching staff records:', error);
    staffDetailsElement.innerHTML = `<p>Error fetching staff records: ${error.message}</p>`;
  }
});

function displayStaffRecords(docs, currentPage, pageSize) {
  const staffDetailsElement = document.getElementById('staffDetails');
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDocs = docs.slice(startIndex, endIndex);

  const table = document.createElement('table');
  const headers = [
    'S/N',
    'Staff ID',
    'Employee Name',
    'Phone',
    'Email',
    'Department',
    'Unit',
    'Actions'
  ];

  // Create table headers
  const headerRow = table.insertRow();
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  // Populate table rows with staff data
  let serialNumber = startIndex + 1;
  paginatedDocs.forEach((doc) => {
    const staffData = doc.data();
    const row = table.insertRow();
    row.insertCell().textContent = serialNumber++;
    row.insertCell().textContent = staffData.staffId;
    row.insertCell().textContent = `${staffData.firstName} ${staffData.lastName}`;
    row.insertCell().textContent = staffData.phoneNumber;
    row.insertCell().textContent = staffData.email;
    row.insertCell().textContent = staffData.department;
    row.insertCell().textContent = staffData.unit;

    // Add "Details" button
    const detailsCell = row.insertCell();
    const detailsButton = document.createElement('button');
    detailsButton.innerHTML = 'Details';
    detailsButton.classList.add('details-button');
    detailsButton.setAttribute('data-staff-id', staffData.staffId);
    detailsCell.appendChild(detailsButton);

    // Add click event listener to the details button
    detailsButton.addEventListener('click', () => {
      const modalContent = document.getElementById('modal-content');
      modalContent.innerHTML = `
        <h2>Staff Details</h2>
        <p>Staff ID: ${staffData.staffId}</p>
        <p>Name: ${staffData.firstName} ${staffData.lastName}</p>
        <p>Email: ${staffData.email}</p>
        <p>Phone Number: ${staffData.phoneNumber}</p>
        <p>Department: ${staffData.department}</p>
        <p>Unit: ${staffData.unit}</p>
      `;

      const modal = document.getElementById('myModal');
      modal.style.display = 'block';
    });

    // Add "Edit" button with Font Awesome icon
    const editCell = row.insertCell();
    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => {
      window.location.href = 'salary.html';
    });
    editCell.appendChild(editButton);
  });

  // Clear existing content and append table to the element
  staffDetailsElement.innerHTML = '';
  staffDetailsElement.appendChild(table);
}

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