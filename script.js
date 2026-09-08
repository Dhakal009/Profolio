document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- THEME TOGGLE (light / dark) ---------- */
(function initThemeToggle(){
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  function updateLabel(theme){
    toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  }

  // the inline script in <head> already set data-theme before first paint;
  // just make sure the button's label matches whatever theme is active.
  updateLabel(root.getAttribute('data-theme') || 'dark');

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    updateLabel(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode, etc. */ }

    // Retrigger the CSS bounce/pulse animation on every switch.
    toggle.classList.remove('theme-changed');
    void toggle.offsetWidth; // force reflow so the class can be re-added cleanly
    toggle.classList.add('theme-changed');
  });

  toggle.addEventListener('animationend', () => {
    toggle.classList.remove('theme-changed');
  });
})();

/* ---------- DISPLAY INTENSITY (brightness of the active light/dark theme) ---------- */
(function initIntensityControl(){
  const root = document.documentElement;
  const panel = document.getElementById('intensityPanel');
  const slider = document.getElementById('intensitySlider');
  const valueLabel = document.getElementById('intensityValue');
  if (!panel || !slider) return;

  function applyIntensity(percent, persist){
    root.style.setProperty('--intensity', percent / 100);
    slider.value = percent;
    slider.setAttribute('aria-valuenow', percent);
    if (valueLabel) valueLabel.textContent = percent + '%';
    if (persist) {
      try { localStorage.setItem('intensity', percent); } catch (e) { /* private mode, etc. */ }
    }
  }

  // Pick up whatever the pre-paint inline script already applied (or default 100).
  let savedPercent = 100;
  try {
    const saved = localStorage.getItem('intensity');
    if (saved) savedPercent = parseInt(saved, 10);
  } catch (e) { /* private mode, etc. */ }
  applyIntensity(savedPercent, false);

  slider.addEventListener('input', () => {
    applyIntensity(parseInt(slider.value, 10), true);
  });
})();

/* ---------- PRELOADER → HERO NAME MERGE ----------
   The preloader opens with the name pinned to the EXACT spot the real hero heading
   occupies on screen (see positionPreloaderName() below) — not just centered in the
   viewport. After a short beat, it softly dissolves — fades and loses focus right
   where it already sits — while the real hero heading (identical font, size, text,
   and now identical position) comes into focus in that same spot at the same
   moment. No movement, no scaling, nothing flying across the screen: just a quick,
   minimal cross-fade so the two hand off as one continuous name sitting in one
   continuous place, rather than feeling like two separate animations. */
(function initPreloaderMerge(){
  const preloader = document.getElementById('preloader');
  const preloaderName = document.getElementById('preloaderName');
  const heroName = document.getElementById('heroName');
  const heroInner = document.getElementById('heroInner');

  if (!preloader || !preloaderName || !heroName) {
    document.body.classList.remove('is-preloading');
    if (preloader) preloader.remove();
    if (heroInner) heroInner.classList.add('is-revealed');
    return;
  }

  let merged = false;

  // Point the preloader name at the hero heading's exact center. Centering both
  // elements on the same point makes their (identical) text land in the same place
  // even though their boxes are different widths (hero heading spans the full card;
  // this one shrink-wraps to the text) — text-align:center does the rest.
  function positionPreloaderName(){
    if (merged) return;
    const heroRect = heroName.getBoundingClientRect();
    preloaderName.style.left = (heroRect.left + heroRect.width / 2) + 'px';
    preloaderName.style.top = (heroRect.top + heroRect.height / 2) + 'px';
  }

  positionPreloaderName();
  preloaderName.classList.add('is-ready'); // now safe to fade in — it's in the right spot
  window.addEventListener('resize', positionPreloaderName);
  // Re-confirm once webfonts are actually loaded, in case the very first measurement
  // was taken against a fallback font with slightly different metrics.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(positionPreloaderName);
  }

  function reveal(){
    merged = true;
    window.removeEventListener('resize', positionPreloaderName);
    document.body.classList.remove('is-preloading');
    heroName.classList.add('is-merging');
    if (heroInner) {
      heroInner.classList.add('is-revealed');
      // Gentle, one-time landing bounce on the whole hero card as the page opens.
      // Removed again once it finishes so it never lingers over the pointer-tilt
      // effect, which also animates `transform` (via inline styles) on this element.
      heroInner.classList.add('is-bouncing');
      heroInner.addEventListener('animationend', function onBounceEnd(e){
        if (e.animationName !== 'heroInnerBounce') return;
        heroInner.classList.remove('is-bouncing');
        heroInner.removeEventListener('animationend', onBounceEnd);
      });
    }
    preloader.classList.add('is-hidden');
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    window.setTimeout(() => preloader.remove(), 1000); // safety net
  }

  // Let the preloader's own opening animation finish, plus a short beat so the name
  // is actually readable, before the minimal merge/cross-fade kicks in.
  const openDelay = prefersReducedMotion ? 150 : 1000;
  window.setTimeout(reveal, openDelay);
})();

/* ---------- GSAP SETUP ---------- */
const hasGSAP = typeof gsap !== 'undefined';
if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (hasGSAP && typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);
if (hasGSAP && prefersReducedMotion) gsap.globalTimeline.timeScale(20); // near-instant, but still resolves promises/callbacks correctly
if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
  // Mobile browsers fire resize repeatedly as the address bar shows/hides while scrolling;
  // without this, ScrollTrigger recalculates every trigger position on each one of those,
  // which is a common source of scroll jank on phones.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/* ---------- SCROLL PROGRESS BAR ---------- */
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

/* ---------- EDGE BOUNCE (top / bottom of page) ---------- */
const pageMain = document.getElementById('pageMain');
let bounceCooldown = false;

function isAtTop(){
  return window.scrollY <= 0;
}
function isAtBottom(){
  return window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
}
function triggerBounce(direction){
  if (!pageMain || bounceCooldown || prefersReducedMotion) return;
  bounceCooldown = true;
  const className = direction === 'top' ? 'bounce-top' : 'bounce-bottom';
  pageMain.style.willChange = 'transform';
  pageMain.classList.add(className);
  pageMain.addEventListener('animationend', function handler(){
    pageMain.classList.remove(className);
    pageMain.style.willChange = 'auto';
    pageMain.removeEventListener('animationend', handler);
    bounceCooldown = false;
  });
}

if (pageMain) {
  window.addEventListener('wheel', (e) => {
    if (isAtTop() && e.deltaY < 0) {
      triggerBounce('top');
    } else if (isAtBottom() && e.deltaY > 0) {
      triggerBounce('bottom');
    }
  }, { passive: true });

  let edgeTouchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    edgeTouchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    const delta = edgeTouchStartY - currentY; // positive = finger moving up (scrolling down)
    if (isAtTop() && delta < -6) {
      triggerBounce('top');
    } else if (isAtBottom() && delta > 6) {
      triggerBounce('bottom');
    }
  }, { passive: true });
}

/* ---------- SMOOTH ANCHOR SCROLL (GSAP-powered) ---------- */
const HEADER_OFFSET = 90;

function smoothScrollTo(targetY, durationSeconds = 0.85){
  if (prefersReducedMotion) {
    window.scrollTo(0, targetY);
    return;
  }
  if (hasGSAP && typeof ScrollToPlugin !== 'undefined') {
    gsap.to(window, {
      duration: durationSeconds,
      scrollTo: { y: targetY, autoKill: true },
      ease: 'power2.out'
    });
  } else {
    // fallback: plain eased scroll if the CDN failed to load
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();
    const dur = durationSeconds * 1000;
    function step(now){
      const progress = Math.min((now - startTime) / dur, 1);
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (targetId.length < 2) return;
    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    // scale duration to distance so short hops feel snappy and long jumps
    // (e.g. Projects -> Contact) don't drag on — capped at 0.85s either way
    const distance = Math.abs(targetY - window.scrollY);
    const duration = Math.min(0.85, Math.max(0.45, distance / 2200));
    smoothScrollTo(Math.max(targetY, 0), duration);
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

/* ---------- NAV "Projects" BUTTON ----------
   Hidden while the hero is on screen (the hero's own CTA already says "Projects"),
   fades in once you scroll past the homepage. On the Projects page there's no hero
   to scroll past — it IS the projects section — so it's shown right away and marked
   "active" (solid purple) to flag where you currently are. */
(function initProjectsNavCta(){
  const cta = document.getElementById('navProjectsCta');
  if (!cta) return;
  const hero = document.getElementById('home');

  if (!hero) {
    cta.classList.add('is-visible', 'is-active');
    return;
  }

  function toggleProjectsCta(){
    cta.classList.toggle('is-visible', window.scrollY > hero.offsetHeight - 140);
  }
  window.addEventListener('scroll', toggleProjectsCta, { passive: true });
  toggleProjectsCta();
})();

/* ---------- ACTIVE SECTION TRACKING (top navbar) ---------- */
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const contentPages = document.querySelectorAll('.content-page');

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

/* ---------- CONTENT PAGE ACTIVE TRANSITION ---------- */
if (contentPages.length) {
  const pageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        contentPages.forEach(page => page.classList.remove('is-current'));
        entry.target.classList.add('is-current');
      }
    });
  }, { threshold: 0.45, rootMargin: '-10% 0px -20% 0px' });

  contentPages.forEach(page => pageObserver.observe(page));
}

/* ---------- PARALLAX EFFECT (GSAP ScrollTrigger scrub) ---------- */
if (hasGSAP && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
  gsap.utils.toArray('[data-parallax]').forEach(el => {
    const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
    gsap.fromTo(el,
      { y: 40 * speed, opacity: 1 },
      {
        y: -40 * speed,
        opacity: 0.55,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.4
        }
      }
    );
  });
} else if (!prefersReducedMotion) {
  // fallback: manual rAF parallax if the GSAP CDN failed to load
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  function updateParallax(){
    const viewportH = window.innerHeight;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
      const rect = el.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - viewportH / 2;
      const translate = centerOffset * speed * -0.15;
      const distance = Math.min(Math.abs(centerOffset) / viewportH, 1);
      el.style.transform = `translateY(${translate}px)`;
      el.style.opacity = Math.max(0.4, 1 - distance * 0.6);
    });
  }
  window.addEventListener('scroll', () => requestAnimationFrame(updateParallax), { passive: true });
  updateParallax();
}

/* ---------- REVEAL ON SCROLL (GSAP ScrollTrigger.batch, staggered) ---------- */
if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
  gsap.set('.reveal', { opacity: 0, y: 28 });

  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: 'power2.out',
      stagger: 0.12
    })
  });
} else {
  // fallback: IntersectionObserver + CSS transition if the GSAP CDN failed to load
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
}

/* ---------- PAGE TITLE CARD MERGE (GSAP ScrollTrigger) ---------- */
if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
  gsap.utils.toArray('.page-title-card').forEach(card => {
    gsap.fromTo(card,
      { y: 22, opacity: 0.75 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

/* ---------- HERO GLOW + TILT FOLLOWS POINTER ---------- */
const heroGlow = document.getElementById('heroGlow');
const heroSection = document.getElementById('home');
const heroInner = document.getElementById('heroInner');
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- PAUSE HERO DECORATIVE ANIMATIONS WHEN OFF-SCREEN ---------- */
if (heroSection) {
  const heroVisibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      heroSection.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.05 });
  heroVisibilityObserver.observe(heroSection);
}

if (heroSection && hasFinePointer && !prefersReducedMotion) {
  let pendingEvent = null;
  let rafScheduled = false;

  function applyHeroPointerEffect(){
    rafScheduled = false;
    if (!pendingEvent) return;
    const { clientX, clientY } = pendingEvent;
    pendingEvent = null;

    const rect = heroSection.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (heroGlow) {
      // Offsets from the glow's default anchor (50%/30% of the section), so the
      // element only ever animates via `transform` — never `left`/`top`.
      heroGlow.style.setProperty('--gx', `${x - rect.width / 2}px`);
      heroGlow.style.setProperty('--gy', `${y - rect.height * 0.3}px`);
    }

    if (heroInner) {
      const relX = (x / rect.width - 0.5) * 2;   // -1 to 1
      const relY = (y / rect.height - 0.5) * 2;  // -1 to 1
      const maxTilt = 4; // degrees
      heroInner.style.transform = `rotateY(${relX * maxTilt}deg) rotateX(${relY * -maxTilt}deg)`;
    }
  }

  heroSection.addEventListener('mousemove', (e) => {
    pendingEvent = e;
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(applyHeroPointerEffect);
    }
  }, { passive: true });

  heroSection.addEventListener('mouseenter', () => {
    if (heroInner) heroInner.style.willChange = 'transform';
  });

  heroSection.addEventListener('mouseleave', () => {
    if (heroInner) {
      heroInner.style.transform = 'rotateY(0deg) rotateX(0deg)';
      heroInner.style.willChange = 'auto';
    }
  });
}

/* ---------- MAGNETIC BUTTONS (GSAP quickTo) ---------- */
if (hasFinePointer && !prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    if (hasGSAP) {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.55, ease: 'power3' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.55, ease: 'power3' });

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        xTo(x * 0.12);
        yTo(y * 0.25);
      });
      btn.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    } else {
      // fallback: direct style assignment if the GSAP CDN failed to load
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    }
  });
}

/* ---------- MOBILE MENU TOGGLE ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const topNav = document.querySelector('.top-nav');
const navOverlay = document.getElementById('navOverlay');

if (menuToggle) {
  function openMenu(){
    topNav.classList.add('open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    if (navOverlay) navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu(){
    topNav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    if (topNav.classList.contains('open')) closeMenu(); else openMenu();
  });

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && topNav.classList.contains('open')) closeMenu();
  });

  topNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ---------- SKILL CARD DETAILS ---------- */
document.querySelectorAll('.skill-card').forEach(card => {
  const toggle = card.querySelector('.skill-toggle');
  if (!toggle) return;

  const details = card.querySelector('.skill-details');

  const syncDetailsHeight = () => {
    if (!details) return;
    const targetHeight = card.classList.contains('is-open') ? `${details.scrollHeight}px` : '0px';
    details.style.maxHeight = targetHeight;
  };

  const toggleCard = () => {
    const isOpen = card.classList.contains('is-open');

    document.querySelectorAll('.skill-card').forEach(item => {
      item.classList.remove('is-open');
      const itemDetails = item.querySelector('.skill-details');
      if (itemDetails) itemDetails.style.maxHeight = '0px';
      const itemToggle = item.querySelector('.skill-toggle');
      if (itemToggle) itemToggle.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      card.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    }

    syncDetailsHeight();
  };

  card.addEventListener('click', () => toggleCard());
  window.addEventListener('resize', syncDetailsHeight);
  syncDetailsHeight();
});

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
    if (hasGSAP) {
      gsap.to(projectTrack, {
        xPercent: -100 * current,
        duration: 0.85,
        ease: 'power4.inOut'
      });
    } else {
      projectTrack.style.transform = `translateX(-${current * 100}%)`;
    }
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
    smoothScrollTo(0, 1.25);
  }
});