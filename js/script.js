// ===== Lenis Smooth Scroll =====
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// ===== Loader =====
window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 600);
});

// ===== Typewriter =====
class Typewriter {
    constructor(el, words, wait = 2000) {
        this.el = el; this.words = words; this.wait = wait;
        this.wordIdx = 0; this.txt = ''; this.isDeleting = false; this.type();
    }
    type() {
        const full = this.words[this.wordIdx % this.words.length];
        this.txt = this.isDeleting ? full.substring(0, this.txt.length - 1) : full.substring(0, this.txt.length + 1);
        this.el.textContent = this.txt;
        let speed = this.isDeleting ? 40 : 80;
        if (!this.isDeleting && this.txt === full) { speed = this.wait; this.isDeleting = true; }
        else if (this.isDeleting && this.txt === '') { this.isDeleting = false; this.wordIdx++; speed = 400; }
        setTimeout(() => this.type(), speed);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('typewriter');
    if (el) new Typewriter(el, ['Flutter Developer', 'Mobile App Developer', 'UI/UX Enthusiast', 'Hackathon Champion', 'Problem Solver']);
});

// ===== Navbar =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 50);
});

// ===== Active Nav =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
function updateActiveNav() {
    const y = window.pageYOffset;
    sections.forEach(s => {
        const top = s.offsetTop - 150, h = s.offsetHeight, id = s.getAttribute('id');
        if (y > top && y <= top + h) {
            navLinks.forEach(l => { l.classList.remove('active'); if (l.getAttribute('href') === '#' + id) l.classList.add('active'); });
        }
    });
}
window.addEventListener('scroll', updateActiveNav);

// ===== Mobile Menu =====
const navToggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
navToggle.addEventListener('click', () => { navToggle.classList.toggle('active'); navLinksEl.classList.toggle('open'); });
navLinksEl.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { navToggle.classList.remove('active'); navLinksEl.classList.remove('open'); }));
document.addEventListener('click', e => { if (!navToggle.contains(e.target) && !navLinksEl.contains(e.target)) { navToggle.classList.remove('active'); navLinksEl.classList.remove('open'); } });
// ===== Back to Top =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.pageYOffset > 400));
backToTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

// ===== Staggered Scroll Reveal (IntersectionObserver) =====
function initScrollReveal() {
    const els = document.querySelectorAll('.skill-category, .timeline-item, .project-card, .edu-card, .achievement-card, .contact-card, .stat-card, .info-card, .contact-form-section');
    els.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('revealed'), i * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));
}

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-count'));
                let count = 0;
                const inc = target / 40;
                const update = () => { count += inc; if (count < target) { entry.target.textContent = Math.ceil(count); requestAnimationFrame(update); } else { entry.target.textContent = target; } };
                update();
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

// ===== Project Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        projectCards.forEach((card, i) => {
            const cat = card.getAttribute('data-category');
            if (filter === 'all' || cat.includes(filter)) {
                card.style.display = 'block';
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, i * 50);
            } else {
                card.style.opacity = '0'; card.style.transform = 'translateY(16px)';
                setTimeout(() => card.style.display = 'none', 350);
            }
        });
    });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const name = fd.get('name'), email = fd.get('email'), subject = fd.get('subject') || 'Portfolio Contact', message = fd.get('message');
    window.location.href = 'mailto:mahmudkhanfarhan2001@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
    const btn = contactForm.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Opening Email...';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; contactForm.reset(); }, 3000);
});

// ===== Smooth Anchor Scroll (Lenis) =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) lenis.scrollTo(t, { offset: -80 });
    });
});
// ===== Parallax Mouse Effect =====
window.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mx = e.clientX / window.innerWidth - 0.5;
    const my = e.clientY / window.innerHeight - 0.5;
    shapes.forEach((s, i) => { const sp = (i + 1) * 15; s.style.transform = 'translate(' + (mx * sp) + 'px, ' + (my * sp) + 'px)'; });
});

// ===== Image Carousel =====
const carouselState = {};
function initCarousels() {
    document.querySelectorAll('.phone-carousel').forEach(carousel => {
        const id = carousel.id, track = carousel.querySelector('.carousel-track');
        const slides = track.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelector('.carousel-dots');
        carouselState[id] = { idx: 0, total: slides.length };
        if (dots) {
            dots.innerHTML = '';
            for (let i = 0; i < slides.length; i++) {
                const d = document.createElement('button'); d.classList.add('carousel-dot');
                if (i === 0) d.classList.add('active');
                d.addEventListener('click', () => goToSlide(id, i));
                dots.appendChild(d);
            }
        }
        setInterval(() => moveCarousel(id, 1), 4500 + Math.random() * 2000);
        let sx = 0, drag = false;
        carousel.addEventListener('touchstart', e => { sx = e.touches[0].clientX; drag = true; }, { passive: true });
        carousel.addEventListener('touchend', e => { if (!drag) return; const dx = sx - e.changedTouches[0].clientX; if (Math.abs(dx) > 50) moveCarousel(id, dx > 0 ? 1 : -1); drag = false; }, { passive: true });
    });
}
function moveCarousel(id, dir) {
    const s = carouselState[id]; if (!s) return;
    let n = s.idx + dir;
    if (n >= s.total) n = 0; if (n < 0) n = s.total - 1;
    goToSlide(id, n);
}
function goToSlide(id, idx) {
    const s = carouselState[id]; if (!s) return;
    s.idx = idx;
    const c = document.getElementById(id);
    c.querySelector('.carousel-track').style.transform = 'translateX(-' + (idx * 100) + '%)';
    c.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}
window.moveCarousel = moveCarousel;

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    animateCounters();
    initCarousels();
});
