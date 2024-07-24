import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

// Initialize Firebase app
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Function to fetch recent reports
async function fetchRecentReports() {
  try {
    const reportsRef = collection(db, 'reports');
    const q = query(reportsRef, orderBy('timestamp', 'desc'), limit(5));
    const querySnapshot = await getDocs(q);

    const tableBody = document.querySelector('#recentReportsTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    let sn = 1;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { name, department, timestamp } = data;

      const timeSubmitted = new Date(timestamp.seconds * 1000).toLocaleString();

      const row = `
        <tr>
          <td>${sn}</td>
          <td>${name}</td>
          <td>${department}</td>
          <td>${timeSubmitted}</td>
        </tr>
      `;
      tableBody.innerHTML += row;

      sn++;
    });
  } catch (error) {
    console.error('Error fetching recent reports: ', error);
  }
}

// Call fetchRecentReports when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  await fetchRecentReports();
});
