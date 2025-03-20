// Modal functionality
const modal = document.getElementById('rsvpModal');
const btn = document.getElementById('rsvpButton');
const span = document.getElementsByClassName('close')[0];
const kidsRadioYes = document.getElementById('kids-yes');
const kidsRadioNo = document.getElementById('kids-no');
const kidsCountGroup = document.getElementById('kidsCountGroup');
const form = document.getElementById('rsvpForm');
const successMessage = document.getElementById('successMessage');

// Open modal when button is clicked
btn.onclick = function() {
    modal.style.display = 'block';
}

// Close modal when (x) is clicked
span.onclick = function() {
    modal.style.display = 'none';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Show/hide kids count based on selection
kidsRadioYes.addEventListener('change', function() {
    kidsCountGroup.style.display = 'block';
});

kidsRadioNo.addEventListener('change', function() {
    kidsCountGroup.style.display = 'none';
});

// Submit form to Google Sheets
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Google Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwcxI8ydtw9EicaCi1Ntf6QxNxVvzNmZape2q2Q2QN01Notcrvf2ZEzjqJN28eCbf3W/exec';
    
    // Send data to Google Sheets via fetch API
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
        },
        redirect: 'follow',
        body: JSON.stringify(data)
    })
    .then(response => {
        // Show success message
        form.style.display = 'none';
        successMessage.style.display = 'block';
        
        // Reset form
        form.reset();
        
        // Close modal after 3 seconds
        setTimeout(() => {
            modal.style.display = 'none';
            // Reset display for next time
            form.style.display = 'block';
            successMessage.style.display = 'none';
        }, 3000);
    })
    .catch(error => console.error('Error!', error.message));
}); 