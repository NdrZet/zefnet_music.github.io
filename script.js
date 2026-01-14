document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM загружен. Скрипты инициализируются.");

    // --- Load Header and Footer ---
    const loadComponent = (url, placeholderId) => {
        return fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(placeholderId).innerHTML = data;
            });
    };

    Promise.all([
        loadComponent('header.html', 'header-placeholder'),
        loadComponent('footer.html', 'footer-placeholder')
    ]).then(() => {
        console.log("Header and Footer loaded.");
        initializeSmoothScroll();
    });

    function initializeSmoothScroll() {
        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('header nav ul li a');
            if (link) {
                const href = link.getAttribute('href');
                const [path, anchor] = href.split('#');
                if (path === window.location.pathname.split('/').pop() && anchor) {
                    e.preventDefault();
                    const targetElement = document.getElementById(anchor);
                    if (targetElement) {
                        const topOffset = targetElement.getBoundingClientRect().top + window.pageYOffset - (document.querySelector('header')?.offsetHeight || 0);
                        window.scrollTo({
                            top: topOffset,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    }

    // --- Ripple Effect for Buttons ---
    document.body.addEventListener('click', function(e) {
        const button = e.target.closest('.md-button, .md-button--icon');
        if (button) {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${e.clientX - rect.left - radius}px`;
            ripple.style.top = `${e.clientY - rect.top - radius}px`;
            ripple.classList.add('ripple');
            const oldRipple = button.querySelector('.ripple');
            if (oldRipple) {
                oldRipple.remove();
            }
            button.appendChild(ripple);
        }
    });

    // --- Audio Player Logic ---
    const playPauseBtn = document.querySelector('.play-pause');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            const icon = this.querySelector('.material-icons');
            if (icon.textContent === 'play_arrow') {
                icon.textContent = 'pause';
            } else {
                icon.textContent = 'play_arrow';
            }
        });
    }

    // --- Gallery Lightbox Logic ---
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const galleryItems = document.querySelectorAll('.gallery-item img');
        const closeBtn = document.querySelector('.close-lightbox');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                lightbox.style.display = 'block';
                lightboxImg.src = item.src;
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
});

// --- Preloader and Scroll Animation Logic ---
window.onload = () => {
    console.log("Страница полностью загружена.");
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');

    setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        const elementsToAnimate = document.querySelectorAll('.md-card, .feed-item, .photo-grid img, .video-container, .album-card, .tour-item, .gallery-item');
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
        
        elementsToAnimate.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                el.classList.add('visible');
            }
        });

    }, 500);
};
