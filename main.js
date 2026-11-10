/* ═══════════════════════════════════════════════════════
   MOLINO DE RAMIRO — Main Interaction & Animations
   Powered by GSAP & ScrollTrigger
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    initPreloader();
    initCursor();
    initNavbar();
    initLanguage();
    initHeroAnimations();
    initScrollAnimations();
    initHorizontalGallery();
    initStatsCounter();
    initReservationForm();
});

/* ─── 1. PRELOADER ────────────────────────────────────── */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            // Trigger hero animation once preloader fades
            playHeroEntry();
        }, 700);
    });

    // Fallback if window load takes too long
    setTimeout(() => {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            playHeroEntry();
        }
    }, 2500);
}

/* ─── 2. CUSTOM CURSOR ────────────────────────────────── */
function initCursor() {
    const dot = document.getElementById('cursorDot');
    const outline = document.getElementById('cursorOutline');
    if (!dot || !outline) return;

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Hover scale effect
    const hoverables = document.querySelectorAll('a, button, input, select, textarea, .pillar-card, .gallery-item');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
        el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
    });
}

/* ─── 3. NAVBAR & MOBILE MENU ─────────────────────────── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Scroll state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/* ─── 4. LANGUAGE SYSTEM (ES / EN) ────────────────────── */
let currentLang = localStorage.getItem('molino_lang') || 'es';

function initLanguage() {
    const langToggle = document.getElementById('langToggle');
    applyLanguage(currentLang);

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'es' ? 'en' : 'es';
            localStorage.setItem('molino_lang', currentLang);
            applyLanguage(currentLang);
        });
    }
}

function applyLanguage(lang) {
    document.documentElement.lang = lang;

    // Toggle button UI
    const langCurrent = document.querySelector('.lang-current');
    const langOther = document.querySelector('.lang-other');
    if (langCurrent && langOther) {
        langCurrent.textContent = lang.toUpperCase();
        langOther.textContent = (lang === 'es' ? 'en' : 'es').toUpperCase();
    }

    // Elements with data-es / data-en attributes
    const translatables = document.querySelectorAll('[data-es][data-en]');
    translatables.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (!text) return;

        // If element contains HTML (like links) or simple text
        if (text.includes('<')) {
            el.innerHTML = text;
        } else {
            el.textContent = text;
        }
    });

    // Inputs with placeholder attributes if any
    const inputsWithPlaceholder = document.querySelectorAll('[data-es-placeholder]');
    inputsWithPlaceholder.forEach(inp => {
        const ph = inp.getAttribute(`data-${lang}-placeholder`);
        if (ph) inp.setAttribute('placeholder', ph);
    });
}

/* ─── 5. HERO ENTRANCE ANIMATIONS ─────────────────────── */
function initHeroAnimations() {
    // Initial states prepared in CSS
}

function playHeroEntry() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.to('.hero-subtitle', {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.1
    })
    .to('.title-line-inner', {
        y: '0%',
        duration: 1.3,
        stagger: 0.15,
        ease: 'power3.out'
    }, '-=0.7')
    .to('.hero-tagline', {
        y: 0,
        opacity: 1,
        duration: 1
    }, '-=0.8')
    .to('.hero-cta', {
        y: 0,
        opacity: 1,
        duration: 1
    }, '-=0.8')
    .to('.scroll-indicator', {
        opacity: 1,
        duration: 1.2
    }, '-=0.6');
}

/* ─── 6. SCROLL ANIMATIONS (GSAP ScrollTrigger) ───────── */
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Headings Reveal
    gsap.utils.toArray('.reveal-text').forEach(heading => {
        gsap.to(heading, {
            scrollTrigger: {
                trigger: heading,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out'
        });
    });

    // Reveal Up general elements
    gsap.utils.toArray('.reveal-up').forEach(item => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                toggleActions: 'play none none none'
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Image Reveal effect
    gsap.utils.toArray('.img-reveal').forEach(wrap => {
        ScrollTrigger.create({
            trigger: wrap,
            start: 'top 80%',
            onEnter: () => wrap.classList.add('revealed')
        });
    });

    // Pillar icons spin on scroll
    gsap.utils.toArray('.spin-on-scroll').forEach(icon => {
        gsap.to(icon, {
            scrollTrigger: {
                trigger: icon,
                start: 'top 90%',
                end: 'bottom 20%',
                scrub: 1.5
            },
            rotation: 180,
            ease: 'none'
        });
    });

    // Floating background year parallax
    const floatingYear = document.querySelector('.floating-year');
    if (floatingYear) {
        gsap.to(floatingYear, {
            scrollTrigger: {
                trigger: '#historia',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -120,
            ease: 'none'
        });
    }

    // 3D Card tilt on mouse hover
    const cards = document.querySelectorAll('.pillar-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

/* ─── 7. HORIZONTAL GALLERY SCRUB ─────────────────────── */
function initHorizontalGallery() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const track = document.getElementById('galleryTrack');
    const gallerySection = document.querySelector('.section-gallery');
    if (!track || !gallerySection) return;

    // Responsive adaptation: Pinned scrub on desktop, touch swipe with snap on mobile
    ScrollTrigger.matchMedia({
        // Desktop & large screens
        "(min-width: 769px)": function() {
            const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 80);

            const tween = gsap.to(track, {
                x: getScrollAmount,
                ease: 'none'
            });

            ScrollTrigger.create({
                trigger: gallerySection,
                start: 'top 20%',
                end: () => `+=${track.scrollWidth - window.innerWidth + 200}`,
                pin: true,
                animation: tween,
                scrub: 1,
                invalidateOnRefresh: true
            });
        },
        // Mobile screens: clean native touch swipe
        "(max-width: 768px)": function() {
            gsap.set(track, { clearProps: 'all' });
        }
    });
}

/* ─── 8. STATS COUNTER ────────────────────────────────── */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;

    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'), 10);
        if (isNaN(target)) return;

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                let start = 0;
                const duration = 2000;
                const stepTime = 20;
                const totalSteps = duration / stepTime;
                const increment = target / totalSteps;

                const timer = setInterval(() => {
                    start += increment;
                    if (start >= target) {
                        stat.textContent = target.toLocaleString('es-ES');
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(start).toLocaleString('es-ES');
                    }
                }, stepTime);
            }
        });
    });
}

/* ─── 9. RESERVATION FORM ─────────────────────────────── */
function initReservationForm() {
    const form = document.getElementById('reservationForm');
    const successMsg = document.getElementById('formSuccess');
    if (!form || !successMsg) return;

    // Minimum date = today
    const dateInput = document.getElementById('formDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check validity
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;

        // Button loading state
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.querySelector('span').textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';

        // Simulate submission
        setTimeout(() => {
            successMsg.classList.add('visible');
            form.reset();

            // Restore button after 5 seconds
            setTimeout(() => {
                successMsg.classList.remove('visible');
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerHTML = originalText;
            }, 6000);
        }, 1200);
    });
}
