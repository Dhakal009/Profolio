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

  updateLabel(root.getAttribute('data-theme') || 'dark');

  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    updateLabel(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* private mode, etc. */ }

    toggle.classList.remove('theme-changed');
    void toggle.offsetWidth;
    toggle.classList.add('theme-changed');
  });

  toggle.addEventListener('animationend', () => {
    toggle.classList.remove('theme-changed');
  });
})();

/* ---------- DISPLAY INTENSITY ---------- */
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

/* ---------- PRELOADER → HERO NAME MERGE ---------- */
(function initPreloaderMerge(){
  const preloader = document.getElementById('preloader');
  const preloaderName = document.getElementById('preloaderName');
  const heroName = document.getElementById('heroName');
  const heroInner = document.getElementById('heroInner');

  if (!preloader || !preloaderName || !heroName) {
    document.body.classList.remove('is-preloading');
    document.body.classList.add('no-preloader', 'site-open');
    if (preloader) preloader.remove();
    if (heroInner) heroInner.classList.add('is-revealed');
    if (heroInner && heroInner.closest('.hero')) heroInner.closest('.hero').classList.add('is-revealed');
    return;
  }

  const LETTER_STAGGER = 0.06;
  preloaderName.querySelectorAll('.preloader-line').forEach(line => {
    const text = line.textContent;
    line.textContent = '';
    Array.from(text).forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'preloader-letter';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.setProperty('--d', (i * LETTER_STAGGER) + 's');
      line.appendChild(span);
    });
  });

  let merged = false;

  function positionPreloaderName(){
    if (merged) return;
    const heroRect = heroName.getBoundingClientRect();
    preloaderName.style.left = (heroRect.left + heroRect.width / 2) + 'px';
    preloaderName.style.top  = (heroRect.top + heroRect.height / 2) + 'px';
  }

  positionPreloaderName();
  preloaderName.classList.add('is-ready');
  window.addEventListener('resize', positionPreloaderName);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(positionPreloaderName);
  }

  function reveal(){
    merged = true;
    window.removeEventListener('resize', positionPreloaderName);
    document.body.classList.remove('is-preloading');
    document.body.classList.add('site-open');
    heroName.classList.add('is-merging');
    if (heroInner) {
      heroInner.classList.add('is-revealed');
      if (heroInner.closest('.hero')) heroInner.closest('.hero').classList.add('is-revealed');
      heroInner.classList.add('is-bouncing');
      heroInner.addEventListener('animationend', function onBounceEnd(e){
        if (e.animationName !== 'heroInnerBounce') return;
        heroInner.classList.remove('is-bouncing');
        heroInner.removeEventListener('animationend', onBounceEnd);
      });
    }
    preloader.classList.add('is-hidden');
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    window.setTimeout(() => preloader.remove(), 1400);
  }

  const openDelay = prefersReducedMotion ? 150 : 1500;
  window.setTimeout(reveal, openDelay);
})();

/* ---------- GSAP SETUP ---------- */
const hasGSAP = typeof gsap !== 'undefined';
if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
if (hasGSAP && typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);
if (hasGSAP && prefersReducedMotion) gsap.globalTimeline.timeScale(20);
if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
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
    const delta = edgeTouchStartY - currentY;
    if (isAtTop() && delta < -6) {
      triggerBounce('top');
    } else if (isAtBottom() && delta > 6) {
      triggerBounce('bottom');
    }
  }, { passive: true });
}

/* ---------- SMOOTH ANCHOR SCROLL ---------- */
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
    const distance = Math.abs(targetY - window.scrollY);
    const duration = Math.min(0.85, Math.max(0.45, distance / 2200));
    smoothScrollTo(Math.max(targetY, 0), duration);
    history.pushState(null, '', targetId);

    // Update the active link + liquid pill the moment it's clicked, so the
    // indicator starts flowing immediately rather than waiting for the
    // IntersectionObserver to catch up mid-scroll.
    if (link.classList.contains('nav-link')) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l === link));
      updateNavPill();
    }
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

/* ---------- NAV "Projects" BUTTON ---------- */
(function initProjectsNavCta(){
  const cta = document.getElementById('navProjectsCta');
  if (!cta) return;

  const isProjectsPage = window.location.pathname.endsWith('projects.html') || !!document.getElementById('main-content');
  cta.classList.add('is-visible');
  cta.classList.toggle('is-active', isProjectsPage);
})();

/* ---------- NAV PILL (liquid flowing indicator) ----------
   Positions a shared element behind whichever nav link is currently active.
   The liquid feel comes from the CSS transition's intentionally mismatched
   durations: `left` is slower than `width`, so mid-travel the pill briefly
   elongates in the direction of motion before contracting into the target
   link's shape. The heavy overshoot curve gives it the pourable weight. */
const navPillEl = document.querySelector('.nav-pill');

function updateNavPill(){
  if (!navPillEl) return;
  const nav = navPillEl.parentElement;
  if (!nav) return;
  if (window.innerWidth <= 700) return;

  const active = nav.querySelector('.nav-link.active');
  if (!active) return;

  const navStyle = getComputedStyle(nav);
  const borderLeft = parseFloat(navStyle.borderLeftWidth) || 0;
  const borderTop  = parseFloat(navStyle.borderTopWidth)  || 0;

  const navRect  = nav.getBoundingClientRect();
  const linkRect = active.getBoundingClientRect();

  const targetLeft   = linkRect.left - navRect.left - borderLeft;
  const targetTop    = linkRect.top  - navRect.top  - borderTop;
  const targetWidth  = linkRect.width;
  const targetHeight = linkRect.height;

  const isFirstPlace = !nav.classList.contains('is-ready');

  if (isFirstPlace){
    // First placement: no animation, snap into place, then mark ready so the
    // pill fades in (via CSS opacity) at the right spot.
    navPillEl.style.transition = 'none';
    navPillEl.style.left   = targetLeft   + 'px';
    navPillEl.style.top    = targetTop    + 'px';
    navPillEl.style.width  = targetWidth  + 'px';
    navPillEl.style.height = targetHeight + 'px';
    // Force a layout so the browser commits the un-animated values.
    void navPillEl.getBoundingClientRect();
    nav.classList.add('is-ready');
    // Restore the transition for all future moves.
    navPillEl.style.transition = '';
    return;
  }

  // Subsequent moves: let the CSS transition carry it, mismatch durations
  // and all — that's what produces the liquid stretch.
  navPillEl.style.left   = targetLeft   + 'px';
  navPillEl.style.top    = targetTop    + 'px';
  navPillEl.style.width  = targetWidth  + 'px';
  navPillEl.style.height = targetHeight + 'px';
}

/* ---------- ACTIVE SECTION TRACKING (top navbar) ----------
   The old implementation used threshold: 0.5, which only fires for sections
   that are at least half-visible in the viewport. Long sections like
   Experience (with the status card) never reach that, so their nav link never
   highlighted. The fix is to observe a thin horizontal band near the middle
   of the viewport (via rootMargin) rather than a percentage of the section —
   whichever section is passing through that band wins the active state, and
   sections with no matching nav link (like #deliver) simply don't clear the
   previous one. */
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const contentPages = document.querySelectorAll('.content-page');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    const match = Array.from(navLinks).find(l => l.getAttribute('href') === `#${id}`);
    if (!match) return;                 // sections without a nav counterpart (e.g. #deliver)
    navLinks.forEach(l => l.classList.toggle('active', l === match));
    updateNavPill();
  });
}, {
  // A ~5% tall trigger band centred slightly above the viewport middle.
  rootMargin: '-45% 0px -50% 0px',
  threshold: 0
});

sections.forEach(section => sectionObserver.observe(section));

// Position the pill once the DOM and fonts are ready, and on any resize
// (width of links changes with font and viewport width).
window.addEventListener('load', updateNavPill);
window.addEventListener('resize', updateNavPill);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateNavPill);
requestAnimationFrame(updateNavPill);

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

/* ---------- PARALLAX EFFECT ---------- */
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

/* ---------- REVEAL ON SCROLL ---------- */
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

/* ---------- PAGE TITLE CARDS: PARALLAX ---------- */
if (hasGSAP && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
  gsap.utils.toArray('.page-title-card').forEach(card => {
    gsap.fromTo(card,
      { y: 56 },
      {
        y: -36,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      }
    );
  });
} else if (!prefersReducedMotion) {
  const titleCards = document.querySelectorAll('.page-title-card');
  function updateTitleParallax(){
    const viewportH = window.innerHeight;
    titleCards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const progress = 1 - (rect.top + rect.height) / (viewportH + rect.height);
      const y = 56 - progress * 92;
      card.style.transform = `translateY(${y}px)`;
    });
  }
  window.addEventListener('scroll', () => requestAnimationFrame(updateTitleParallax), { passive: true });
  updateTitleParallax();
}

/* ---------- TITLE CARD OPENING ANIMATION ---------- */
(function initTitleCardEntrance(){
  const cards = document.querySelectorAll('.page-title-card');
  if (!cards.length || prefersReducedMotion) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      if (entry.isIntersecting) {
        card.classList.remove('is-entering');
        void card.offsetWidth;
        card.classList.add('is-entering');
      } else {
        card.classList.remove('is-entering');
      }
    });
  }, { threshold: 0.35 });

  cards.forEach(card => observer.observe(card));
})();

/* ---------- TITLE MERGE (page title → content title) ---------- */
function splitTitleChars(titleEl){
  if (titleEl.dataset.split === 'true') {
    return titleEl.querySelectorAll('.tc-char');
  }
  const text = titleEl.textContent;
  titleEl.textContent = '';
  const frag = document.createDocumentFragment();
  for (const ch of text){
    if (ch === ' ' || ch === '\u00A0'){
      const space = document.createElement('span');
      space.className = 'tc-space';
      space.textContent = '\u00A0';
      frag.appendChild(space);
    } else {
      const span = document.createElement('span');
      span.className = 'tc-char';
      span.textContent = ch;
      frag.appendChild(span);
    }
  }
  titleEl.appendChild(frag);
  titleEl.dataset.split = 'true';
  titleEl.classList.add('is-split');
  return titleEl.querySelectorAll('.tc-char');
}

if (hasGSAP && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
  gsap.utils.toArray('.section').forEach(section => {
    const bigTitle   = section.querySelector('.page-title-card .section-title');
    const bigDesc    = section.querySelector('.page-title-card .page-title-desc');
    const smallTitle = section.querySelector('.content-title');
    const contentPage = section.querySelector('.content-page');
    if (!bigTitle || !smallTitle || !contentPage) return;

    const chars = splitTitleChars(bigTitle);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: contentPage,
        start: 'top bottom',
        end: 'top 25%',
        scrub: 0.5
      }
    });

    tl.to(chars, {
      opacity: 0,
      filter: 'blur(14px)',
      y: -28,
      scale: 1.18,
      ease: 'power2.in',
      stagger: {
        each: 0.035,
        from: 'start'
      }
    }, 0);

    if (bigDesc) {
      tl.to(bigDesc, {
        opacity: 0,
        y: -14,
        filter: 'blur(6px)',
        ease: 'power1.in'
      }, 0.05);
    }

    tl.fromTo(smallTitle,
      { scale: 2.4, opacity: 0, filter: 'blur(10px)', y: 0 },
      {
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'power2.out'
      },
      0.18
    );
  });
} else if (!prefersReducedMotion) {
  document.querySelectorAll('.content-title').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.filter = 'none';
  });
}

/* ---------- HERO GLOW FOLLOWS POINTER ---------- */
const heroGlow = document.getElementById('heroGlow');
const heroSection = document.getElementById('home');
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

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
      heroGlow.style.setProperty('--gx', `${x - rect.width / 2}px`);
      heroGlow.style.setProperty('--gy', `${y - rect.height * 0.3}px`);
    }
  }

  heroSection.addEventListener('mousemove', (e) => {
    pendingEvent = e;
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(applyHeroPointerEffect);
    }
  }, { passive: true });
}

/* ---------- MAGNETIC BUTTONS ---------- */
if (hasFinePointer && !prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    if (hasGSAP) {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.55, ease: 'power3' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.55, ease: 'power3' });

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        xTo(x * 0.14);
        yTo(y * 0.18);
      });
      btn.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    } else {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.14}px, ${y * 0.18}px)`;
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

  const EDGE_ZONE = 0.28;

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

  projectCarousel.setAttribute('tabindex', '0');
  projectCarousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'ArrowRight') goNext();
  });

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