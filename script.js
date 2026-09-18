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
    document.body.classList.add('no-preloader', 'site-open');
    if (preloader) preloader.remove();
    if (heroInner) heroInner.classList.add('is-revealed');
    return;
  }

  // Split each line of the preloader name into individual letter spans so each
  // one can arrive on its own beat. The delay is the letter's index within its
  // OWN line — since both lines have the same length, letter N of "Bikash" and
  // letter N of "DHAKAL" land together, so the two words are typed in sync
  // rather than one after the other.
  const LETTER_STAGGER = 0.06; // seconds between successive letters
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
    // Drives the staggered header/nav entrance in the motion layer of style.css,
    // which is timed to land just after the hero card has settled.
    document.body.classList.add('site-open');
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
    window.setTimeout(() => preloader.remove(), 1400); // safety net
  }

  // Timed against the preloader's own CSS sequence, which is now a real
  // presentation rather than a flash: line one lands at ~1.5s, line two at
  // ~1.8s, and the hairline beneath finishes drawing at ~2.45s. Handing off at
  // 2.5s means the name is fully set and held for a beat before it dissolves
  // into the hero heading — long enough to register, short enough not to stall.
  const openDelay = prefersReducedMotion ? 150 : 1500;
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
   Keep the Projects CTA visible in the navbar at all times and highlight it on the
   dedicated projects page. */
(function initProjectsNavCta(){
  const cta = document.getElementById('navProjectsCta');
  if (!cta) return;

  const isProjectsPage = window.location.pathname.endsWith('projects.html') || !!document.getElementById('main-content');
  cta.classList.add('is-visible');
  cta.classList.toggle('is-active', isProjectsPage);
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

/* ---------- PAGE TITLE CARDS: OPENING ANIMATION + SCROLL PARALLAX ----------
   Each page opens with its name on its own full-viewport stage. Two effects
   run on that element:

     1. OPENING ANIMATION — an IntersectionObserver adds `.is-entering` every
        time the card scrolls into view, which triggers the CSS keyframe
        sequence (rise + unblur + letters settling). The class is removed once
        the animation ends, so scrolling back up and returning to a section
        replays the entrance rather than showing it only once.

     2. PARALLAX — a scrubbed `y` runs from +56 to −36 across the card's
        full pass through the viewport, so the name drifts on its own plane
        while the content card below scrolls at normal speed. That mismatch
        is what makes one page hand off to the next. */
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
  // Fallback: manual rAF parallax if GSAP failed to load.
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

/* ---------- TITLE CARD OPENING ANIMATION (replays on re-entry) ---------- */
(function initTitleCardEntrance(){
  const cards = document.querySelectorAll('.page-title-card');
  if (!cards.length || prefersReducedMotion) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      if (entry.isIntersecting) {
        // Restart the animation cleanly: remove first, force a reflow, then
        // re-add so the browser treats it as a fresh keyframe run each time.
        card.classList.remove('is-entering');
        void card.offsetWidth;
        card.classList.add('is-entering');
      } else {
        // Leaving the viewport clears the class so the next entry replays.
        card.classList.remove('is-entering');
      }
    });
  }, {
    // Fire when ~35% of the card is on screen — late enough that the animation
    // isn't already half-finished by the time the card is centered, early
    // enough that it feels like it responds to your arrival.
    threshold: 0.35
  });

  cards.forEach(card => observer.observe(card));
})();

/* ---------- TITLE MERGE (page title → content title) ----------
   As a content card rises into view, the big transparent page title above it
   DISSOLVES — split into individual letters, each of which blurs out, drifts
   upward and fades in sequence. Simultaneously the smaller heading at the top
   of the content card lands from oversized-blurred into its resting state, so
   at the crossover point the two titles occupy the same visual size and the
   eye reads the whole thing as one title dissolving INTO its destination
   rather than two elements cross-fading.

   The letter split is done here rather than in the HTML so the markup stays
   clean and the effect gracefully falls back to a plain fade on browsers
   without GSAP. */

/* Wrap each non-space character of a title in its own span so it can dissolve
   independently. Runs once per title and caches via a data attribute. */
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
        // start: content card's top enters from the bottom of the viewport.
        // end:   content card's top has climbed to 25% from the viewport top —
        //        by which point the small title is well into the reader's view
        //        and the merge is fully resolved.
        start: 'top bottom',
        end: 'top 25%',
        scrub: 0.5
      }
    });

    // 1) LETTER DISSOLVE — each character blurs out and drifts upward in
    //    sequence from left to right. The stagger is what sells the dissolve:
    //    a simultaneous fade reads as "the title disappeared", a staggered one
    //    reads as "the title came apart". Slight scale-up makes the letters
    //    feel like they're expanding into the air rather than shrinking away.
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

    // 2) DESCRIPTION — fades with the title it belongs to, so the whole page
    //    card is emptied of content by the time the content card lands.
    if (bigDesc) {
      tl.to(bigDesc, {
        opacity: 0,
        y: -14,
        filter: 'blur(6px)',
        ease: 'power1.in'
      }, 0.05);
    }

    // 3) SMALL TITLE LANDS — starts oversized and blurred, settles into its
    //    resting size and sharpens. The 0.18 lag lets the dissolve lead the
    //    motion so the eye tracks "big title going away" before "small title
    //    arriving" — the right order for a merge handoff.
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
  // No GSAP: skip both the split and the merge, just show the content titles
  // at rest so the page reads normally.
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

  }

  heroSection.addEventListener('mousemove', (e) => {
    pendingEvent = e;
    if (!rafScheduled) {
      rafScheduled = true;
      requestAnimationFrame(applyHeroPointerEffect);
    }
  }, { passive: true });

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
        // Gentler than before: the hero buttons are physically larger now, and
        // the same multipliers on a bigger target read as wobble rather than pull.
        xTo(x * 0.14);
        yTo(y * 0.18);
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