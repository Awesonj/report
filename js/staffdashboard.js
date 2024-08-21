import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  query,
  where,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

// Get the staff ID from local storage
const staffId = localStorage.getItem("staffId");

// Function to open the event scheduler popup
function openEventPopup() {
  document.getElementById("eventPopup").classList.add("active");
}

// Function to close the event scheduler popup
function closeEventPopup() {
  document.getElementById("eventPopup").classList.remove("active");
}

// Function to save the scheduled event
async function saveEvent() {
  const eventName = document.getElementById("eventName").value;
  const eventDetails = document.getElementById("eventDetails").value;
  const eventTime = document.getElementById("eventTime").value;

  const eventData = {
    name: eventName,
    details: eventDetails,
    time: eventTime
  };

  const staffId = localStorage.getItem("staffId");

  if (staffId) {
    try {
      const eventsRef = doc(db, "events", staffId);
      const eventsSnap = await getDoc(eventsRef);

      if (eventsSnap.exists()) {
        const data = eventsSnap.data();
        const eventsArray = data.events || [];
        eventsArray.push(eventData);

        await setDoc(eventsRef, { events: eventsArray }, { merge: true });
      } else {
        await setDoc(eventsRef, { events: [eventData] });
      }

      closeEventPopup();
      alert("Event scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling event:", error);
      alert("Error scheduling event. Please try again.");
    }
  } else {
    console.log("Staff ID not found in localStorage");
  }
}

// Attach event listeners to dynamically created buttons
function attachEventListeners() {
  const viewTasksButtons = document.querySelectorAll('.view-tasks-btn');
  viewTasksButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const staffId = event.target.getAttribute('data-staff-id');
      localStorage.setItem("staffId", staffId);
      fetchAssignedTasks();
      fetchNotifications();
    });
  });

  const saveEventButton = document.getElementById('saveEventButton');
  if (saveEventButton) {
    saveEventButton.addEventListener('click', saveEvent);
  }

  const cancelEventButton = document.getElementById('cancelEventButton');
  if (cancelEventButton) {
    cancelEventButton.addEventListener('click', closeEventPopup);
  }
}

// Function to fetch and display notifications for a staff member
async function fetchNotifications() {
  if (staffId) {
    try {
      const notificationsRef = doc(db, "notifications", staffId);
      const notificationsSnap = await getDoc(notificationsRef);

      if (notificationsSnap.exists()) {
        const data = notificationsSnap.data();
        const notificationsArray = data.notifications || [];

        const notificationsList = document.getElementById("notificationsList");
        notificationsList.innerHTML = ""; // Clear previous notifications

        notificationsArray.forEach(notification => {
          const listItem = document.createElement("li");
          listItem.textContent = `${notification.message} (${notification.dateTime})`;
          notificationsList.appendChild(listItem);
        });

        // Update notification count and mini-view
        document.getElementById("notificationCount").textContent = notificationsArray.length;
        // Add mini-view of tasks assigned
        const miniView = document.getElementById("miniView");
        miniView.innerHTML = ""; // Clear previous mini-view

        notificationsArray.forEach(notification => {
          const listItem = document.createElement("li");
          listItem.textContent = notification.message;
          miniView.appendChild(listItem);
        });
      } else {
        console.log("No notifications found.");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  } else {
    console.log("Staff ID not found in localStorage");
  }
}


// Function to fetch and display assigned tasks for a staff member
async function fetchAssignedTasks() {
  if (staffId) {
    try {
      const docRef = doc(db, "reportbt", staffId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const reportsArray = data.reports || [];

        const tasksList = document.getElementById("tasksList");
        tasksList.innerHTML = ""; // Clear previous tasks

        reportsArray.forEach((report, index) => {
          const taskItem = document.createElement("div");
          taskItem.className = "task-item";
          taskItem.innerHTML = `
            <p><strong>Task:</strong> ${report.task}</p>
            <p><strong>Location:</strong> ${report.location}</p>
            <p><strong>Details:</strong> ${report.details}</p>
            <p><strong>Priority:</strong> ${report.priorityOption}</p>
            <p><strong>Date:</strong> ${report.dateTime}</p>
            <p><strong>Status:</strong> ${report.progressOption}</p>
            <button data-task-index="${index}" class="complete-btn">Complete</button>
            <button data-task-index="${index}" class="inprogress-btn">In Progress</button>
          `;

          tasksList.appendChild(taskItem);
        });


        // Update performance metrics
        updatePerformanceMetrics(reportsArray);
        // Attach event listeners to the complete buttons
        attachCompleteButtonListeners();
        attachInProgressButtonListeners();
      } else {
        console.log("No tasks found.");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  } else {
    console.log("Staff ID not found in localStorage");
  }
}

// Function to update performance metrics
function updatePerformanceMetrics(reportsArray) {
  const completedTasks = reportsArray.filter(task => task.progressOption === 'Completed').length;
  const inProgressTasks = reportsArray.filter(task => task.progressOption === 'InProgress').length;
  const notStartedTasks = reportsArray.filter(task => task.progressOption === 'NotStarted').length;

  const totalTasks = reportsArray.length;

  const ctx = document.getElementById('performanceChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'In Progress', 'Not Started'],
      datasets: [{
        data: [completedTasks, inProgressTasks, notStartedTasks],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ' + context.raw + ' (' + ((context.raw / totalTasks) * 100).toFixed(2) + '%)';
              }
              return label;
            }
          }
        }
      }
    }
  });
}

// Function to mark a task as completed
async function markTaskAsCompleted(taskIndex) {
  const staffId = localStorage.getItem("staffId");

  if (staffId) {
    try {
      const docRef = doc(db, "reportbt", staffId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const reportsArray = data.reports || [];

        if (taskIndex < reportsArray.length) {
          reportsArray[taskIndex].progressOption = "Completed";
          await updateDoc(docRef, { reports: reportsArray });
          alert("Task marked as completed!");
          fetchAssignedTasks(); // Refresh the task list
        } else {
          console.error("Invalid task index");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  } else {
    console.log("Staff ID not found in localStorage");
  }
}

// Attach event listeners to the complete buttons
function attachCompleteButtonListeners() {
  const completeButtons = document.querySelectorAll('.complete-btn');
  completeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const taskIndex = event.target.getAttribute('data-task-index');
      markTaskAsCompleted(taskIndex);
    });
  });
}


// Function to mark a task as completed
async function markTaskAsInProgress(taskIndex) {
  const staffId = localStorage.getItem("staffId");

  if (staffId) {
    try {
      const docRef = doc(db, "reportbt", staffId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const reportsArray = data.reports || [];

        if (taskIndex < reportsArray.length) {
          reportsArray[taskIndex].progressOption = "InProgress";
          await updateDoc(docRef, { reports: reportsArray });
          alert("Task marked as In Progress!");
          fetchAssignedTasks(); // Refresh the task list
        } else {
          console.error("Invalid task index");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  } else {
    console.log("Staff ID not found in localStorage");
  }
}

// Attach event listeners to the complete buttons
function attachInProgressButtonListeners() {
  const inprogressButtons = document.querySelectorAll('.inprogress-btn');
  inprogressButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const taskIndex = event.target.getAttribute('data-task-index');
      markTaskAsInProgress(taskIndex);
    });
    console.log("Task marked as In Progress!");
  });
}

// Function to fetch staff details
const fetchStaffDetails = async () => {
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
          document.getElementById(
            "userName"
          ).innerHTML = `<p>${userData.firstName} ${userData.lastName}</p>`;
          document.getElementById(
            "userDesignation"
          ).innerHTML = `<p>${userData.designation}</p>`;
          document.getElementById(
            "userStaffId"
          ).innerHTML = `<p>${userData.staffId}</p>`;
          document.getElementById(
            "userEmail"
          ).innerHTML = `<p>${userData.email}</p>`;
          document.getElementById(
            "userPhoneNumber"
          ).innerHTML = `<p>${userData.phoneNumber}</p>`;
          
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

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  let calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      navLinks: true,
      selectable: true,
      editable: true,
      events: async (info, successCallback, failureCallback) => {
          try {
              const querySnapshot = await db.collection('hrEvents').get();
              const events = [];
              querySnapshot.forEach((doc) => {
                  const eventData = doc.data();
                  events.push({
                      id: doc.id,
                      title: eventData.event,
                      start: eventData.date.toDate(), // Convert Firestore Timestamp to Date
                  });
              });
              successCallback(events);
          } catch (error) {
              console.error('Error fetching events:', error);
              failureCallback(error);
          }
      },
      dateClick: function (info) {
          // Show the event scheduler popup when a date is clicked
          document.getElementById('eventScheduler').style.display = 'block';
          document.getElementById('eventTime').value = info.dateStr; // Pre-fill the event time with the clicked date
      },
      eventClick: function (info) {
          const confirmed = confirm(
              `Are you sure you want to delete the event "${info.event.title}"?`
          );
          if (confirmed) {
              deleteEventFromFirebase(info.event.id);
          }
      },
  });

  calendar.render();

  async function saveEventToFirebase(date, eventText) {
      try {
          const dateString = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
          await db.collection('hrEvents').add({
              date: Timestamp.fromDate(date),
              event: eventText,
          });
          console.log('Event saved successfully!');
          calendar.refetchEvents(); // Reload events after saving
      } catch (error) {
          console.error('Error saving event:', error);
      }
  }

  async function deleteEventFromFirebase(eventId) {
      try {
          await db.collection('hrEvents').doc(eventId).delete();
          console.log('Event deleted successfully!');
          calendar.refetchEvents(); // Reload events after deletion
      } catch (error) {
          console.error('Error deleting event:', error);
      }
  }

  // Event listener to save the event
  document.getElementById('saveEventButton').addEventListener('click', async function() {
      const eventName = document.getElementById('eventName').value;
      const eventDetails = document.getElementById('eventDetails').value;
      const eventTime = new Date(document.getElementById('eventTime').value);

      const eventData = {
          name: eventName,
          details: eventDetails,
          time: eventTime
      };

      try {
          await saveEventToFirebase(eventTime, eventName);
          closeEventSchedulerPopup();
          alert("Event scheduled successfully!");
      } catch (error) {
          console.error('Error scheduling event:', error);
          alert("Error scheduling event. Please try again.");
      }
  });

  // Event listener to close the event scheduler popup
  document.getElementById('cancelEventButton').addEventListener('click', function() {
      closeEventSchedulerPopup();
  });

  function closeEventSchedulerPopup() {
      document.getElementById('eventScheduler').style.display = 'none';
  }
});


// Initialize the page by fetching staff details
fetchStaffDetails();
// Initialize the page by fetching notifications and tasks
fetchNotifications();
fetchAssignedTasks();
attachEventListeners();

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