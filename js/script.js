// Navbar scroll effect
let navbarDiv = document.querySelector('.navbar');
const navbarHeight = navbarDiv ? navbarDiv.offsetHeight : 70; // Fallback height

window.addEventListener('scroll', () => {
    if (navbarDiv) {
        if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
            navbarDiv.classList.add('navbar-cng');
        } else {
            navbarDiv.classList.remove('navbar-cng');
        }
    }
});

// Navbar mobile toggle
const navbarCollapseDiv = document.getElementById('navbar-collapse');
const navbarShowBtn = document.getElementById('navbar-show-btn');
const navbarCloseBtn = document.getElementById('navbar-close-btn');

if (navbarShowBtn && navbarCollapseDiv) {
    navbarShowBtn.addEventListener('click', () => {
        navbarCollapseDiv.classList.add('navbar-collapse-rmw');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when mobile nav is open
    });
}

if (navbarCloseBtn && navbarCollapseDiv) {
    navbarCloseBtn.addEventListener('click', () => {
        navbarCollapseDiv.classList.remove('navbar-collapse-rmw');
        document.body.style.overflow = ''; // Restore scrolling
    });
}

// Close mobile navbar when a link is clicked or when clicking outside
if (navbarCollapseDiv) {
    document.addEventListener('click', (e) => {
        // Close if clicked outside the navbar itself or the toggle button
        if (!navbarCollapseDiv.contains(e.target) && e.target !== navbarShowBtn && !navbarShowBtn.contains(e.target)) {
            if (navbarCollapseDiv.classList.contains('navbar-collapse-rmw')) {
                navbarCollapseDiv.classList.remove('navbar-collapse-rmw');
                document.body.style.overflow = '';
            }
        }
        // Close if a nav-link inside the mobile menu is clicked
        if (e.target.classList.contains('nav-link') && navbarCollapseDiv.classList.contains('navbar-collapse-rmw')) {
            navbarCollapseDiv.classList.remove('navbar-collapse-rmw');
            document.body.style.overflow = '';
        }
    });
}


// Stop transition and animation during window resizing - keep as is
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
    }, 400);
});

// Smooth Scroll for anchor links (if you have any pointing to #id)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const hrefAttribute = this.getAttribute('href');
        if (hrefAttribute && hrefAttribute.length > 1 && document.querySelector(hrefAttribute)) { // Ensure it's a valid ID selector
            e.preventDefault();
            const targetElement = document.querySelector(hrefAttribute);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - navbarHeight + 10; // Adjust for fixed navbar
                 window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});


// Active Nav Link highlighting based on scroll position
const sections = document.querySelectorAll('section[id]'); // Assuming your main content sections have IDs
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

function changeNavlinkState() {
    let index = sections.length;

    while(--index && window.scrollY + navbarHeight < sections[index].offsetTop) {}

    navLinks.forEach((link) => link.classList.remove('active'));
    // Check if a corresponding navLink exists before trying to add 'active' class
    if (sections[index]) { // Ensure section exists
        const activeNavLink = document.querySelector(`.navbar-nav .nav-link[href*="${sections[index].id}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        } else if (window.scrollY < sections[0].offsetTop - navbarHeight ) { // If above first section, highlight home
             const homeLink = document.querySelector(`.navbar-nav .nav-link[href="index.html"]`);
             if (homeLink) homeLink.classList.add('active');
        }
    } else if (navLinks.length > 0 && window.scrollY < (sections[0] ? sections[0].offsetTop - navbarHeight : 500) ) { // Fallback for top of page
        const homeLink = document.querySelector('.navbar-nav .nav-link[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
    }
}
// Initial check for active link on page load/refresh
if (sections.length > 0 && navLinks.length > 0) {
    changeNavlinkState();
    window.addEventListener('scroll', changeNavlinkState);
} else { // If no sections, try to highlight based on current page URL
     const currentPage = window.location.pathname.split("/").pop();
     if (currentPage) {
         navLinks.forEach(link => {
             if (link.getAttribute('href') === currentPage) {
                 link.classList.add('active');
             }
         });
     } else { // Default to home if no specific page identified
         const homeLink = document.querySelector('.navbar-nav .nav-link[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
     }
}


// Scroll Animations for elements using Intersection Observer
const animatedElements = document.querySelectorAll('.fade-in-element, .featured-item, .services-item, .test-item, .blog-item, .gallery-item, .popular-item, .facts-item, .about-left, .about-right, .contact-left, .contact-right');

const observerOptions = {
    root: null, // relative to document viewport
    rootMargin: '0px',
    threshold: 0.1 // 10% of the item is visible
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Optional: stop observing once animated
        }
    });
};

if (animatedElements.length > 0) {
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    animatedElements.forEach(el => scrollObserver.observe(el));
}


// Form submission feedback (basic example)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent actual submission for demo
        // Add validation logic here
        const submitButton = this.querySelector('input[type="submit"]');
        const originalButtonText = submitButton.value;
        submitButton.value = 'Sending...';
        submitButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // On success:
            // this.reset(); // Clear the form
            // submitButton.value = 'Message Sent!';
            // setTimeout(() => { submitButton.value = originalButtonText; submitButton.disabled = false; }, 3000);

            // For demo, just revert
            alert('Form submitted (simulated)!');
            submitButton.value = originalButtonText;
            submitButton.disabled = false;
            this.reset();

        }, 2000);
    });
}

// Video Player - Enhanced play/pause button state
const videoWrapper = document.querySelector('.video-wrapper');
if (videoWrapper) {
    const video = videoWrapper.querySelector('video');
    const playBtn = document.getElementById('play-btn');

    if (video && playBtn) {
        playBtn.addEventListener('click', () => {
            if (video.paused || video.ended) {
                video.play();
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', () => {
            videoWrapper.classList.add('video-playing');
            playBtn.setAttribute('aria-label', 'Pause video');
        });

        video.addEventListener('pause', () => {
            videoWrapper.classList.remove('video-playing');
            playBtn.setAttribute('aria-label', 'Play video');
        });
         video.addEventListener('ended', () => {
            videoWrapper.classList.remove('video-playing');
            playBtn.setAttribute('aria-label', 'Play video');
        });
    }
}


// Gallery Modal - Enhanced (from gallery.html)
const allGalleryItems = document.querySelectorAll('.gallery-item');
const imgModalDiv = document.getElementById('img-modal-box');

if (allGalleryItems.length > 0 && imgModalDiv) {
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const modalImage = imgModalDiv.querySelector('#img-modal img');
    let currentImgIndex = 0;
    let imagesSrc = [];

    allGalleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) imagesSrc.push(img.src); // Store all image sources

        item.addEventListener('click', () => {
            currentImgIndex = index;
            showImageContent(currentImgIndex);
            imgModalDiv.style.display = "flex"; // Use flex for centering
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });
    });

    function showImageContent(index) {
        if (modalImage && imagesSrc[index]) {
            modalImage.src = imagesSrc[index];
            modalImage.alt = `Gallery image ${index + 1}`;
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentImgIndex = (currentImgIndex + 1) % imagesSrc.length;
            showImageContent(currentImgIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentImgIndex = (currentImgIndex - 1 + imagesSrc.length) % imagesSrc.length;
            showImageContent(currentImgIndex);
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    imgModalDiv.addEventListener('click', (e) => { // Close on clicking background
        if (e.target === imgModalDiv) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (imgModalDiv.style.display === "flex") {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
            if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
        }
    });

    function closeModal() {
        imgModalDiv.style.display = "none";
        document.body.style.overflow = ''; // Restore scroll
    }
}