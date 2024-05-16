import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyAWwVoSru9MDFsxgZvR9jCAPmha9dkwn7I",
  authDomain: "inventory-tracker-251d9.firebaseapp.com",
  projectId: "inventory-tracker-251d9",
  storageBucket: "inventory-tracker-251d9.appspot.com",
  messagingSenderId: "687688694025",
  appId: "1:687688694025:web:8687bfa31dc57a5177bbd8",
  measurementId: "G-XLKM7VBSSD"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const registrationForm = document.getElementById('registrationForm');

registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const repeatPassword = document.getElementById('repeatPassword').value;
  const username = document.getElementById('username').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const middleName = document.getElementById('middleName').value;
  const department = document.getElementById('department').value;
  const designation = document.getElementById('designation').value;

  // Validate password match
  if (password !== repeatPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    // Save authentication details to Firebase Firestore collection 'Authentication'
    const docRef = await addDoc(collection(db, 'Authentication'), {
      email,
      password,
      username,
      firstName,
      lastName,
      middleName,
      department,
      designation
    });

    console.log('Document written with ID: ', docRef.id);
    alert('Registration successful!'); // Display success message

    // Redirect to login page
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Registration failed. Please try again.');
  }
});

// Toggle Password Visibility
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye-slash'); // Toggle eye-slash icon
});

// Repeat Password Input
const toggleRepeatPassword = document.getElementById('toggleRepeatPassword');
const repeatPasswordInput = document.getElementById('repeatPassword');

toggleRepeatPassword.addEventListener('click', () => {
    const type = repeatPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    repeatPasswordInput.setAttribute('type', type);
    toggleRepeatPassword.classList.toggle('fa-eye-slash'); // Toggle eye-slash icon
});
