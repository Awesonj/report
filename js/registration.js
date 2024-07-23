// Initialize Firebase
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

const form = document.getElementById('myForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Get form values
    const firstName = form['firstName'].value;
    const lastName = form['lastName'].value;
    const otherName = form['otherName'].value;
    const email = form['email'].value;
    const phoneNumber = form['phoneNumber'].value;
    const gender = form['gender'].value;
    const staffId = form['staffId'].value;
    const department = form['department'].value;
    const designation = form['designation'].value;
    const unit = form['unit'].value;

    // Prepare data object
    const formData = {
        firstName,
        lastName,
        otherName,
        email,
        phoneNumber,
        gender,
        staffId,
        department,
        designation,
        unit
    };

    try {
        // Save data to Firestore
        const docRef = await addDoc(collection(db, 'luthreport'), formData);
        console.log('Document written with ID: ', docRef.id);

        // Clear form inputs after submission
        form.reset();

        // Optionally, show success message or update UI
    } catch (error) {
        console.error('Error adding document: ', error);
        // Handle errors here
    }
});
