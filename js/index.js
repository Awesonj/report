// Function to display the current date
function displayCurrentDate() {
    // Get the current date
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Update the span with the current date
    document.getElementById('reportDates').textContent = 'Report as at ' + currentDate;
}

// Event listener for the submit button
document.getElementById('submit').addEventListener('click', function() {
    // Get the values of daily report, location, comments, and remarks
    const dailyReport = document.getElementById('dailyReport').value.trim(); // Trim whitespace
    const location = document.getElementById('location').value.trim();
    const comments = document.getElementById('comments').value.trim();
    const remarks = document.getElementById('remarks').value.trim();

    // Check if any of the text areas are empty
    if (dailyReport === '' || location === '' || comments === '' || remarks === '') {
        // If any text area is empty, display an alert and prevent submission
        alert('Please fill in all fields before submitting the report.');
        return; // Exit the function early
    }

    // Create a new table row
    const newRow = document.createElement('tr');

    // Create table cells for SN, location, comments, and remarks
    const snCell = document.createElement('td');
    snCell.textContent = document.getElementById('reportTableBody').childElementCount + 1; // Increment SN
    const locationCell = document.createElement('td');
    locationCell.textContent = location;
    const commentsCell = document.createElement('td');
    commentsCell.textContent = comments;
    const remarksCell = document.createElement('td');
    remarksCell.textContent = remarks;

    // Append cells to the new row
    newRow.appendChild(snCell);
    newRow.appendChild(locationCell);
    newRow.appendChild(commentsCell);
    newRow.appendChild(remarksCell);

    // Append the new row to the table body
    document.getElementById('reportTableBody').appendChild(newRow);

    // Clear the form fields after submission
    document.getElementById('dailyReport').value = '';
    document.getElementById('location').value = '';
    document.getElementById('comments').value = '';
    document.getElementById('remarks').value = '';
});
document.addEventListener('DOMContentLoaded', function() {
    // Display the current date
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('reportDate').textContent =  currentDate;

    // Event listener for the submit button
    document.getElementById('submit').addEventListener('click', function() {
        // Your existing submit button logic here
    });
});


// Call the function to display the current date when the DOM content is loaded
document.addEventListener('DOMContentLoaded', displayCurrentDate);
