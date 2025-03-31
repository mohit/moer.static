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
    
    // Show submitting state immediately
    const submitButton = form.querySelector('.submit-button');
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    // Google Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyloAT9mlnH_NQYvtrz5wxSW1cafVg4X_3QOk79WIUWmWgD_M5RkefmcsBBcj1oyLX0/exec';
    
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
            // Reset button
            submitButton.textContent = 'Submit RSVP';
            submitButton.disabled = false;
        }, 3000);
    })
    .catch(error => {
        console.error('Error!', error.message);
        // Reset button on error
        submitButton.textContent = 'Submit RSVP';
        submitButton.disabled = false;
    });
}); 

document.addEventListener('DOMContentLoaded', function() {
    // Array of image paths - update these with your actual image filenames
    const images = [
        'images/rainshadowParty1Of5.jpeg',
        'images/rainshadowParty2Of5.jpeg',
        'images/rainshadowParty3Of5.jpeg',
        'images/rainshadowParty4Of5.jpeg',
        'images/rainshadowParty5Of5.jpeg'
    ]; 
    
    const gallery = document.getElementById('photoGallery');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const currentImageNum = document.getElementById('currentImageNum');
    const totalImages = document.getElementById('totalImages');
    let currentIndex = 0;

    // Populate the total images count
    totalImages.textContent = images.length;

    // Create image elements and add to gallery
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Gallery image ${index + 1}`;
        img.className = index === 0 ? 'active' : '';
        gallery.appendChild(img);
    });

    // Function to show the current image
    function showImage(index) {
        const allImages = gallery.querySelectorAll('img');
        allImages.forEach(img => img.classList.remove('active'));
        allImages[index].classList.add('active');
        currentImageNum.textContent = index + 1;
        
        // Preload the next image for smoother transitions
        preloadNextImage(index);
    }
    
    // Preload next image
    function preloadNextImage(currentIndex) {
        const nextIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        const preloadImg = new Image();
        preloadImg.src = images[nextIndex];
    }

    // Event listeners for navigation buttons
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
        showImage(currentIndex);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
        showImage(currentIndex);
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    gallery.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    gallery.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - show next image
            nextButton.click();
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right - show previous image
            prevButton.click();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') {
            prevButton.click();
        } else if (e.key === 'ArrowRight') {
            nextButton.click();
        }
    });
    
    // Initialize the gallery with the first image
    showImage(0);
});