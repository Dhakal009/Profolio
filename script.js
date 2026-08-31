document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- SCROLL PROGRESS BAR ---------- */
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

/* ---------- SMOOTH ANCHOR SCROLL (custom easing) ---------- */
const HEADER_OFFSET = 90;

function easeInOutCubic(t){
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothScrollTo(targetY, duration = 900){
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now){
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId.length < 2) return;
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

    if (prefersReducedMotion) {
      window.scrollTo(0, targetY);
    } else {
      smoothScrollTo(Math.max(targetY, 0));
    }
    history.pushState(null, '', targetId);
  });
});

/* ---------- HEADER: solid background once page is scrolled ---------- */
const siteHeader = document.getElementById('siteHeader');
let ticking = false;

function handleHeaderState(){
  siteHeader.classList.toggle('scrolled', window.scrollY > 40);
}

function onScroll(){
  if (!ticking) {
    requestAnimationFrame(() => {
      handleHeaderState();
      updateProgress();
      toggleBackToTop();
      ticking = false;
    });
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
updateProgress();

/* ---------- ACTIVE SECTION TRACKING (top navbar) ---------- */
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => sectionObserver.observe(section));

/* ---------- PARALLAX EFFECT ---------- */
const parallaxEls = document.querySelectorAll('[data-parallax]');

function updateParallax(){
  const viewportH = window.innerHeight;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
    const rect = el.getBoundingClientRect();
    const centerOffset = rect.top + rect.height / 2 - viewportH / 2;
    const translate = centerOffset * speed * -0.15;
    const distance = Math.min(Math.abs(centerOffset) / viewportH, 1);
    const opacity = 1 - distance * 0.6;

    el.style.transform = `translateY(${translate}px)`;
    el.style.opacity = Math.max(0.4, opacity);
  });
}

if (!prefersReducedMotion) {
  window.addEventListener('scroll', () => requestAnimationFrame(updateParallax), { passive: true });
  updateParallax();
}

/* ---------- REVEAL ON SCROLL (staggered) ---------- */
// assign a stagger index per parent container so siblings fade in one after another
const parentCounters = new Map();
document.querySelectorAll('.reveal').forEach(el => {
  const parent = el.parentElement;
  const count = parentCounters.get(parent) || 0;
  el.style.setProperty('--stagger', count);
  parentCounters.set(parent, count + 1);
});

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- STAT COUNTERS ---------- */
const statNumbers = document.querySelectorAll('.stat-number');

function animateCount(el){
  const target = parseInt(el.getAttribute('data-target'), 10) || 0;
  const duration = 1400;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));

/* ---------- HERO GLOW FOLLOWS POINTER ---------- */
const heroGlow = document.getElementById('heroGlow');
const heroSection = document.getElementById('home');
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

if (heroGlow && heroSection && hasFinePointer && !prefersReducedMotion) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroGlow.style.setProperty('--x', `${x}px`);
    heroGlow.style.setProperty('--y', `${y}px`);
  });
}

/* ---------- MAGNETIC BUTTONS ---------- */
if (hasFinePointer && !prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

/* ---------- MOBILE MENU TOGGLE ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const topNav = document.querySelector('.top-nav');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    topNav.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  topNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      topNav.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  });
}

/* ---------- PROJECT CAROUSEL ---------- */
const projectCarousel = document.getElementById('projectCarousel');
const projectTrack = document.getElementById('projectTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const projectCurrentEl = document.getElementById('projectCurrent');
const projectTotalEl = document.getElementById('projectTotal');

if (projectCarousel && projectTrack) {
  const cards = projectTrack.querySelectorAll('.project-card');
  const total = cards.length;
  let current = 0;

  if (projectTotalEl) projectTotalEl.textContent = String(total).padStart(2, '0');

  function renderSlide(){
    projectTrack.style.transform = `translateX(-${current * 100}%)`;
    if (projectCurrentEl) projectCurrentEl.textContent = String(current + 1).padStart(2, '0');
    cards.forEach((card, i) => card.classList.toggle('active', i === current));
  }

  function goPrev(){
    current = (current - 1 + total) % total;
    renderSlide();
  }
  function goNext(){
    current = (current + 1) % total;
    renderSlide();
  }

  prevBtn.addEventListener('click', goPrev);
  nextBtn.addEventListener('click', goNext);
  renderSlide();

  // reveal prev/next buttons only when the pointer is near that edge
  const EDGE_ZONE = 0.28; // fraction of carousel width counted as "edge"

  projectCarousel.addEventListener('mousemove', (e) => {
    const rect = projectCarousel.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left) / rect.width;

    prevBtn.classList.toggle('visible', relativeX < EDGE_ZONE);
    nextBtn.classList.toggle('visible', relativeX > 1 - EDGE_ZONE);
  });

  projectCarousel.addEventListener('mouseleave', () => {
    prevBtn.classList.remove('visible');
    nextBtn.classList.remove('visible');
  });

  // keyboard support when the carousel has focus
  projectCarousel.setAttribute('tabindex', '0');
  projectCarousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  });

  // basic touch swipe support
  let touchStartX = 0;
  projectTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  projectTrack.addEventListener('touchend', (e) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) {
      deltaX > 0 ? goPrev() : goNext();
    }
  }, { passive: true });
}

/* ---------- BACK TO TOP ---------- */
const toTopBtn = document.getElementById('toTop');
function toggleBackToTop(){
  if (window.scrollY > 600) {
    toTopBtn.classList.add('visible');
  } else {
    toTopBtn.classList.remove('visible');
  }
}
toTopBtn.addEventListener('click', () => {
  if (prefersReducedMotion) {
    window.scrollTo(0, 0);
  } else {
    smoothScrollTo(0, 1000);
  }
});