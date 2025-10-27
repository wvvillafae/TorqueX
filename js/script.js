// ==================================================================================
// FINAL AND COMPLETE JAVASCRIPT FILE
// Includes: Mobile Menu, Quick Search (with price filter by thousands and range),
// and Local Video Mute/Unmute Control (with audio activated on start).
// ==================================================================================

// ----------------------------------------------------
// I. GLOBAL DECLARATIONS (Search Filter)
// ----------------------------------------------------
const marcaSelect = document.querySelector('select[name="marca"]'); // Brand select
const tipoSelect = document.querySelector('select[name="tipo"]');   // Type select
const priceInput = document.querySelector('input[name="precio_max"]');
const vehicleCards = document.querySelectorAll('.vehicle-card');
const quickSearchForm = document.getElementById('quick-search');


// ----------------------------------------------------
// II. VEHICLE FILTER FUNCTIONS
// ----------------------------------------------------

/**
 * Main function that filters the vehicle cards.
 */
function filterVehicles() {
    // Defining the approximate range: $2,000
    const RANGE_OFFSET = 2000; 

    // Get filter values
    const selectedMarca = marcaSelect.value;
    const selectedTipo = tipoSelect.value;
    
    let inputPrice = parseFloat(priceInput.value); 

    // PRICE LOGIC BY THOUSANDS
    let maxPrice;
    if (isNaN(inputPrice)) {
        maxPrice = Infinity;
    } else {
        // If the user enters a small value (e.g., 23), multiply by 1000.
        if (inputPrice < 1000) {
            maxPrice = inputPrice * 1000;
        } else {
            maxPrice = inputPrice; // If they enter 25000, use it as is.
        }
    }
    
    // Calculate the minimum price for the approximate range.
    const minPrice = maxPrice === Infinity ? 0 : Math.max(0, maxPrice - RANGE_OFFSET);


    // Iterate over all vehicle cards
    vehicleCards.forEach(card => {
        const cardMarca = card.getAttribute('data-marca'); // Card Brand
        const cardTipo = card.getAttribute('data-tipo');   // Card Type
        
        // Robust price extraction
        const priceText = card.querySelector('.price').textContent.replace(/[^\d.]/g, ''); 
        const cardPrice = parseFloat(priceText);
        
        if (isNaN(cardPrice)) {
            card.style.display = 'none';
            return; 
        }

        // 1. Check Brand
        const matchesMarca = !selectedMarca || cardMarca === selectedMarca;

        // 2. Check Type
        const matchesTipo = !selectedTipo || cardTipo === selectedTipo;

        // 3. Check Price (Range [minPrice, maxPrice])
        const matchesPrice = cardPrice >= minPrice && cardPrice <= maxPrice; 

        // Show or hide the card
        if (matchesMarca && matchesTipo && matchesPrice) {
            card.style.display = 'block'; // Show card
        } else {
            card.style.display = 'none'; // Hide card
        }
    });
}

// ----------------------------------------------------
// III. LOCAL VIDEO AUDIO CONTROL FUNCTION
// ----------------------------------------------------

/**
 * Function to mute/unmute the local video audio.
 */
function toggleMuteLocalVideo() {
    const video = document.getElementById('video-drife-fondo');
    const muteIcon = document.querySelector('#mute-toggle-btn .icon-mute');

    if (video) {
        // Invert the 'muted' state
        video.muted = !video.muted;
        
        // If the video was paused by the browser (due to having audio), we play it
        if (!video.muted && video.paused) {
            video.play().catch(error => {
                // Handle error if playback is blocked by the browser
                console.log("Playback with audio was blocked:", error);
            });
        }
        
        // Update the button icon
        if (muteIcon) {
            // If muted (video.muted is true), show the mute icon (&#128264;)
            // If NOT muted, show the sound icon (&#128266;)
            muteIcon.innerHTML = video.muted ? '&#128264;' : '&#128266;';
        }
    }
}


// ----------------------------------------------------
// IV. MAIN DOMContentLoaded INITIALIZATION
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Logic to ensure audio on load ---
    const video = document.getElementById('video-drife-fondo');
    if (video) {
        // 1. Attempt to play with audio (may fail due to browser policies)
        video.play().catch(error => {
            // If it fails, we mute the video and try again to ensure autoplay
            video.muted = true;
            video.play().catch(e => console.log("Autoplay blocked:", e));
            
            // Update the icon to "mute" if we had to force the mute
            const muteIcon = document.querySelector('#mute-toggle-btn .icon-mute');
            if (muteIcon) {
                muteIcon.innerHTML = '&#128264;';
            }
        });
    }

    // --- 1. MOBILE MENU FUNCTIONALITY ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('.main-nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active'); 
        });
        
        // Close the menu if a link is clicked (mobile UX)
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                }
            });
        });
    }

    // --- 2. AUDIO BUTTON CONNECTION ---
    const muteButton = document.getElementById('mute-toggle-btn');
    if (muteButton) {
        muteButton.addEventListener('click', toggleMuteLocalVideo);
    }


    // --- 3. EVENT LISTENERS FOR FILTERING ---

    // Filter on brand change
    if (marcaSelect) marcaSelect.addEventListener('change', filterVehicles);
    
    // Filter on type change
    if (tipoSelect) tipoSelect.addEventListener('change', filterVehicles);
    
    // Filter on price input
    if (priceInput) priceInput.addEventListener('input', filterVehicles);

    // --- 4. "Search Vehicle" Button Logic (Simulated) ---
    if (quickSearchForm) {
        quickSearchForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            // Force filter application on submit
            filterVehicles(); 
            
            const brand = marcaSelect.value;
            const type = tipoSelect.value;
            const maxPrice = priceInput.value || 'N/A';
            
            // ALERT MESSAGE TRANSLATION
            alert(`✅ Search Applied:\nBrand: ${brand || 'Any'}\nType: ${type || 'Any'}\nApprox Max Price: ${maxPrice}\n\nThe featured vehicles have been filtered.`);
            
            // Optional: Uncomment the following line to force a scroll to the vehicle section
            // document.querySelector('.featured-section').scrollIntoView({ behavior: 'smooth' });
        });
    }
});