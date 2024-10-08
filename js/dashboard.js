import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import {
  getFirestore,
  collection,
  where,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
} from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

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

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Function to fetch and display total number of employees
async function getTotalEmployees() {
  try {
    const querySnapshot = await getDocs(collection(db, 'luthreport'));
    const totalEmployees = querySnapshot.size;
    document.getElementById('totalEmployees').textContent = totalEmployees;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

// Function to fetch and display total number of female staff
async function getTotalFemaleStaff() {
  try {
    const querySnapshot = await getDocs(collection(db, 'luthreport'));
    let femaleCount = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().gender === 'female') {
        femaleCount++;
      }
    });
    document.getElementById('totalFemale').textContent = femaleCount;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

// Function to fetch and display total number of male staff
async function getTotalMaleStaff() {
  try {
    const querySnapshot = await getDocs(collection(db, 'luthreport'));
    let maleCount = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().gender === 'male') {
        maleCount++;
      }
    });
    document.getElementById('totalMale').textContent = maleCount;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

// Function to fetch and display total number of Technical Services staff
async function getTotalBillersStaff() {
  try {
    const querySnapshot = await getDocs(collection(db, 'luthreport'));
    let BillersCount = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().department === 'Billers') {
        BillersCount++;
      }
    });
    document.getElementById('totalBillers').textContent = BillersCount;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

// Function to fetch and display total number of Financial Services staff
async function getTotalHIMSStaff() {
  try {
    const querySnapshot = await getDocs(collection(db, 'luthreport'));
    let HIMSCount = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().department === 'HIMS') {
        HIMSCount++;
      }
    });
    document.getElementById('totalHIMS').textContent = HIMSCount;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

// Function to fetch and display total number of General Services staff
async function getTotalLANStaff() {
  try {
    const querySnapshot = await getDocs(collection(db, 'luthreport'));
    let LANCount = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().department === 'LAN') {
        LANCount++;
      }
    });
    document.getElementById('totalLAN').textContent = LANCount;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

async function getTotalWEBStaff() {
  try {
    const querySnapshot = await getDocs(collection(db, 'luthreport'));
    let WEBCount = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().department === 'WEB') {
        WEBCount++;
      }
    });
    document.getElementById('totalWEB').textContent = WEBCount;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

async function getTotalITStaff() {
  try {
    const querySnapshot = await getDocs(collection(db, 'luthreport'));
    let ITCount = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().department === 'IT') {
        ITCount++;
      }
    });
    document.getElementById('totalIT').textContent = ITCount;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

// Call the functions to fetch and display total number of employees, female, male, and IT staff when the page loads
window.onload = function () {
  getTotalEmployees();
  getTotalFemaleStaff();
  getTotalMaleStaff();
  getTotalBillersStaff()
  getTotalHIMSStaff()
  getTotalLANStaff();
  getTotalWEBStaff();
  getTotalITStaff();
};

// Function to fetch salary data from Firestore
async function fetchSalaryData() {
  const salaryData = {};
  const querySnapshot = await getDocs(collection(db, 'luthreport'));
  querySnapshot.forEach((doc) => {
    const department = doc.data().department;
    const baseSalary = doc.data().baseSalary || 0; // Ensure baseSalary is valid
    if (!salaryData[department]) {
      salaryData[department] = baseSalary;
    } else {
      salaryData[department] += baseSalary; // Aggregate base salary for the same department
    }
  });
  return salaryData;
}

// Function to fetch department distribution data from Firestore
async function fetchDepartmentData() {
  const departmentData = {};
  const querySnapshot = await getDocs(collection(db, 'luthreport'));
  querySnapshot.forEach((doc) => {
    const department = doc.data().department;
    if (!departmentData[department]) {
      departmentData[department] = 1;
    } else {
      departmentData[department] += 1; // Count number of employees in each department
    }
  });
  return departmentData;
}

// Function to fetch base salary data for graph from Firestore
async function fetchBaseSalaryData() {
  const baseSalaryData = {};
  const querySnapshot = await getDocs(collection(db, 'luthreport'));
  querySnapshot.forEach((doc) => {
    const month = doc.data().month;
    const baseSalary = doc.data().baseSalary || 0; // Ensure baseSalary is valid
    baseSalaryData[month] = baseSalary;
  });
  return baseSalaryData;
}

// Function to fetch pension and tax data from Firestore
async function fetchPensionTaxData() {
  const pensionData = { total: 0 };
  const taxData = { total: 0 };
  const querySnapshot = await getDocs(collection(db, 'luthreport'));
  querySnapshot.forEach((doc) => {
    const pension = doc.data().pension || 0;
    const tax = doc.data().tax || 0;
    pensionData.total += pension;
    taxData.total += tax;
  });
  return { pensionData, taxData };
}

function renderSalaryBarChart(salaryData) {
  const ctx = document.getElementById('salaryChartCanvas').getContext('2d');
  const salaryChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(salaryData),
      datasets: [
        {
          label: 'Basic Salary',
          data: Object.values(salaryData),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function renderDepartmentPieChart(departmentData) {
  const ctx = document.getElementById('departmentChartCanvas').getContext('2d');
  const departmentChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(departmentData),
      datasets: [
        {
          label: 'Departments',
          data: Object.values(departmentData),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    },
  });
}

function renderGraphs(baseSalaryData, pensionData, taxData) {
  const salaryGraphCtx = document
    .getElementById('salaryGraphCanvas')
    .getContext('2d');
  const pensionTaxGraphCtx = document
    .getElementById('pensionTaxGraphCanvas')
    .getContext('2d');

  // Salary graph
  const salaryGraph = new Chart(salaryGraphCtx, {
    type: 'line',
    data: {
      labels: Object.keys(baseSalaryData),
      datasets: [
        {
          label: 'Base Salary',
          data: Object.values(baseSalaryData),
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false, 
        },
      ],
    },
  });



  // Pension & Tax graph
  const pensionTaxGraph = new Chart(pensionTaxGraphCtx, {
    type: 'bar',
    data: {
      labels: ['Total Pensions', 'Total Tax'],
      datasets: [
        {
          label: 'Amount',
          data: [pensionData.total, taxData.total],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Display total pensions and tax
  document.getElementById('totalPensions').textContent = pensionData.total;
  document.getElementById('totalTax').textContent = taxData.total;
}

 
// Function to display the last 10 reports in the table and show notifications
async function displayRecentReports() {
  console.log('Displaying recent reports...');
  try {
    const reportsRef = collection(db, 'reportbt');
    const querySnapshot = await getDocs(reportsRef);

    let recentReports = [];

    for (const staffDoc of querySnapshot.docs) {
      const staffId = staffDoc.id;
      const dailyReportsRef = collection(db, 'reportbt', staffId, 'dailyReports');
      const dailyReportsSnapshot = await getDocs(dailyReportsRef);

      // Fetch the staff name and department based on the staffId
      const staffDocRef = doc(db, 'staff', staffId); // Assuming you have a 'staff' collection
      const staffDocSnap = await getDoc(staffDocRef);
      const staffData = staffDocSnap.data();
      const staffName = staffData ? staffData.name : 'Unknown';
      const staffDepartment = staffData ? staffData.department : 'Unknown';

      dailyReportsSnapshot.forEach((dailyReportDoc) => {
        const reports = dailyReportDoc.data().reports || {};
        // Iterate over each date key in the reports object
        for (const dateKey in reports) {
          if (Array.isArray(reports[dateKey])) {
            reports[dateKey].forEach((report) => {
              recentReports.push({
                name: staffName,
                department: staffDepartment,
                timeSubmitted: report.dateTime,
              });
            });
          } else {
            console.warn('Expected reports to be an array but got:', reports[dateKey]);
          }
        }
      });
    }

    // Sort reports by timeSubmitted in descending order and limit to last 10 reports
    recentReports.sort((a, b) => new Date(b.timeSubmitted) - new Date(a.timeSubmitted));
    recentReports = recentReports.slice(0, 10);

    const recentReportsTable = document.getElementById('recentReportsTable').getElementsByTagName('tbody')[0];
    const notificationContainer = document.getElementById('notificationContainer');

    recentReportsTable.innerHTML = ''; // Clear existing rows

    recentReports.forEach((report, index) => {
      const { name, department, timeSubmitted } = report;

      // Create table row
      const newRow = recentReportsTable.insertRow();
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      const cell4 = newRow.insertCell(3);

      cell1.textContent = index + 1;
      cell2.textContent = name;
      cell3.textContent = department;
      cell4.textContent = new Date(timeSubmitted).toLocaleString();

      // Show notifications
      const notification = document.createElement('div');
      notification.classList.add('notification');
      notification.textContent = `New report from ${name} in ${department} department submitted at ${new Date(timeSubmitted).toLocaleString()}`;
      notificationContainer.appendChild(notification);

      // Auto-remove notification after a few seconds
      setTimeout(() => {
        notificationContainer.removeChild(notification);
      }, 5000);
    });
  } catch (error) {
    console.error('Error fetching recent reports:', error);
  }
}

// Call the function to display recent reports when the page loads
document.addEventListener('DOMContentLoaded', displayRecentReports);




document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch data from Firestore and render charts
    const salaryData = await fetchSalaryData();
    const departmentData = await fetchDepartmentData();
    const baseSalaryData = await fetchBaseSalaryData();
    const { pensionData, taxData } = await fetchPensionTaxData();

    // Render charts using fetched data
    renderSalaryBarChart(salaryData);
    renderDepartmentPieChart(departmentData);
    renderGraphs(baseSalaryData, pensionData, taxData);
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
  }
});

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
