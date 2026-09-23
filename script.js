document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- THEME TOGGLE (light / dark) ---------- */
(function initThemeToggle(){
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const THEME_BG = { dark: '#050507', light: '#f7f6fb' };

  function updateLabel(theme){
    toggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  }

  function applyTheme(next){
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduce && typeof document.startViewTransition === 'function') {
      document.startViewTransition(() => {
        root.setAttribute('data-theme', next);
      });
      return;
    }

    document.querySelectorAll('.theme-wipe').forEach(w => w.remove());

    if (reduce || typeof Element.prototype.animate !== 'function') {
      root.setAttribute('data-theme', next);
      return;
    }

    const wipe = document.createElement('div');
    wipe.className = 'theme-wipe';
    wipe.style.backgroundColor = THEME_BG[next] || THEME_BG.dark;
    wipe.style.clipPath = 'circle(0% at 100% 0%)';
    document.body.appendChild(wipe);

    const expand = wipe.animate(
      [
        { clipPath: 'circle(0% at 100% 0%)' },
        { clipPath: 'circle(150% at 100% 0%)' }
      ],
      { duration: 650, easing: 'cubic-bezier(.7,0,.3,1)', fill: 'forwards' }
    );

    expand.onfinish = () => {
      root.setAttribute('data-theme', next);
      wipe.remove();
    };
  }

  updateLabel(root.getAttribute('data-theme') || 'dark');

  toggle.addEventListener('click', (e) => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    updateLabel(next);
    try { localStorage.setItem('theme', next); } catch (err) { /* private mode */ }

    toggle.classList.remove('theme-changed');
    void toggle.offsetWidth;
    toggle.classList.add('theme-changed');

    if (e.detail > 0) toggle.blur();
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
      try { localStorage.setItem('intensity', percent); } catch (err) { /* private mode */ }
    }
  }

  let savedPercent = 100;
  try {
    const saved = localStorage.getItem('intensity');
    if (saved) savedPercent = parseInt(saved, 10);
  } catch (err) { /* private mode */ }
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

if (hasGSAP && typeof ScrollTrigger !== 'undefined' && document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
let lenis = null;

function initLenis(){
  if (lenis) return;
  if (typeof Lenis === 'undefined') return;
  if (prefersReducedMotion) return;

  lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false
  });

  if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  } else {
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  if (document.body.classList.contains('is-preloading')) {
    lenis.stop();
    const obs = new MutationObserver(() => {
      if (!document.body.classList.contains('is-preloading')) {
        obs.disconnect();
        lenis.start();
        if (hasGSAP && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }
}

initLenis();

/* ---------- SCROLL PROGRESS BAR ---------- */
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
  if (progressBar) progressBar.style.transform = 'scaleX(' + pct + ')';
}

/* ---------- EDGE BOUNCE ---------- */
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
    const threshold = lenis ? 18 : 6;
    if (isAtTop() && delta < -threshold) {
      triggerBounce('top');
    } else if (isAtBottom() && delta > threshold) {
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

  if (lenis) {
    lenis.scrollTo(targetY, {
      duration: durationSeconds,
      easing: t => 1 - Math.pow(1 - t, 3),
      lock: true,
      force: true
    });
    return;
  }

  if (hasGSAP && typeof ScrollToPlugin !== 'undefined') {
    gsap.to(window, {
      duration: durationSeconds,
      scrollTo: { y: targetY, autoKill: true },
      ease: 'power2.out'
    });
    return;
  }

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

    if (link.classList.contains('nav-link')) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l === link));
      updateNavPill();
    }
  });
});

/* ---------- HEADER STATE + SCROLL TICKS ---------- */
const siteHeader = document.getElementById('siteHeader');
let ticking = false;

function handleHeaderState(){
  if (!siteHeader) return;
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

/* ---------- NAV PILL ---------- */
const navPillEl = document.querySelector('.nav-pill');
let lastPillTarget = { left: -1, width: -1 };

function wobbleNavPill(){
  if (!navPillEl || prefersReducedMotion) return;
  navPillEl.classList.remove('is-wobbling');
  void navPillEl.offsetWidth;
  navPillEl.classList.add('is-wobbling');
}
if (navPillEl) {
  navPillEl.addEventListener('animationend', () => navPillEl.classList.remove('is-wobbling'));
}

function updateNavPill(){
  if (!navPillEl) return;
  const nav = navPillEl.parentElement;
  if (!nav) return;
  if (window.innerWidth <= 700) return;

  const active = nav.querySelector('.nav-link.active');
  if (!active) return;

  const navStyle   = getComputedStyle(nav);
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
    navPillEl.style.transition = 'none';
    navPillEl.style.left   = targetLeft   + 'px';
    navPillEl.style.top    = targetTop    + 'px';
    navPillEl.style.width  = targetWidth  + 'px';
    navPillEl.style.height = targetHeight + 'px';
    void navPillEl.getBoundingClientRect();
    nav.classList.add('is-ready');
    navPillEl.style.transition = '';
    lastPillTarget = { left: targetLeft, width: targetWidth };
    return;
  }

  const moved =
    Math.abs(targetLeft  - lastPillTarget.left)  > 1 ||
    Math.abs(targetWidth - lastPillTarget.width) > 1;
  lastPillTarget = { left: targetLeft, width: targetWidth };

  navPillEl.style.left   = targetLeft   + 'px';
  navPillEl.style.top    = targetTop    + 'px';
  navPillEl.style.width  = targetWidth  + 'px';
  navPillEl.style.height = targetHeight + 'px';

  if (moved) wobbleNavPill();
}

/* ---------- NAV DROPLET / WATER EFFECT ---------- */
(function initNavDroplets(){
  const nav = document.querySelector('.top-nav');
  if (!nav || prefersReducedMotion) return;

  const links = nav.querySelectorAll('.nav-link');
  if (!links.length) return;

  function spawnDroplet(host, x, y){
    const drop = document.createElement('span');
    drop.className = 'nav-droplet';
    drop.style.left = x + 'px';
    drop.style.top  = y + 'px';
    host.appendChild(drop);

    const anim = drop.animate([
      { transform:'translate(-50%,-50%) scale(0.15,0.15)', opacity:0.95, offset:0    },
      { transform:'translate(-50%,-50%) scale(0.72,0.56)', opacity:0.90, offset:0.28 },
      { transform:'translate(-50%,-50%) scale(1.15,0.86)', opacity:0.78, offset:0.50 },
      { transform:'translate(-50%,-50%) scale(0.90,1.06)', opacity:0.58, offset:0.70 },
      { transform:'translate(-50%,-50%) scale(1.52,0.72)', opacity:0.24, offset:0.86 },
      { transform:'translate(-50%,-50%) scale(1.90,0.40)', opacity:0,    offset:1    }
    ], { duration: 680, easing: 'cubic-bezier(.22,1,.36,1)' });
    anim.onfinish = () => drop.remove();

    const ring = document.createElement('span');
    ring.className = 'nav-ripple';
    ring.style.left = x + 'px';
    ring.style.top  = y + 'px';
    host.appendChild(ring);

    const r = ring.animate([
      { transform:'translate(-50%,-50%) scale(0.25)', opacity:0.75 },
      { transform:'translate(-50%,-50%) scale(1.00)', opacity:0.35, offset:0.55 },
      { transform:'translate(-50%,-50%) scale(1.90)', opacity:0    }
    ], { duration: 720, easing: 'cubic-bezier(.22,1,.36,1)' });
    r.onfinish = () => ring.remove();
  }

  links.forEach(link => {
    link.addEventListener('pointerdown', (e) => {
      const rect = link.getBoundingClientRect();
      spawnDroplet(link, e.clientX - rect.left, e.clientY - rect.top);
    });
    link.addEventListener('click', () => wobbleNavPill());
  });
})();

/* ---------- ACTIVE SECTION TRACKING ---------- */
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const contentPages = document.querySelectorAll('.content-page');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    const match = Array.from(navLinks).find(l => l.getAttribute('href') === `#${id}`);
    if (!match) return;
    navLinks.forEach(l => l.classList.toggle('active', l === match));
    updateNavPill();
  });
}, {
  rootMargin: '-45% 0px -50% 0px',
  threshold: 0
});

sections.forEach(section => sectionObserver.observe(section));

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

/* ============================================================
   AMBIENT BACKGROUND — GSAP-scrubbed parallax + section colours
   ============================================================ */
(function initBackgroundScene(){
  const scene = document.querySelector('.bg-scene');
  if (!scene) return;
  if (!hasGSAP || typeof ScrollTrigger === 'undefined') return;
  if (prefersReducedMotion) return;

  const orb1 = scene.querySelector('.bg-orb-1');
  const orb2 = scene.querySelector('.bg-orb-2');
  const orb3 = scene.querySelector('.bg-orb-3');
  if (!orb1 || !orb2) return;

  const isMobile = window.matchMedia('(max-width:700px)').matches;

  function getOrbOpacity(){
    const v = getComputedStyle(document.documentElement).getPropertyValue('--orb-opacity').trim();
    return parseFloat(v) || 1;
  }

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2
    }
  });

  scrollTl
    .to(orb1, { x:'8vw',  y:'35vh', scale:1.2,  ease:'none' }, 0)
    .to(orb2, { x:'-10vw', y:'-30vh', scale:1.15, ease:'none' }, 0)
    .fromTo(orb1, { opacity: 0.35 * getOrbOpacity() }, { opacity: 0.55 * getOrbOpacity(), ease:'sine.inOut' }, 0)
    .fromTo(orb2, { opacity: 0.22 * getOrbOpacity() }, { opacity: 0.4  * getOrbOpacity(), ease:'sine.inOut' }, 0);

  if (orb3 && !isMobile){
    scrollTl.to(orb3, { x:'-6vw', y:'20vh', rotate:45, scale:1.1, ease:'none' }, 0);
    scrollTl.fromTo(orb3, { opacity: 0.25 * getOrbOpacity() }, { opacity: 0.4 * getOrbOpacity(), ease:'sine.inOut' }, 0);
  }

  const palette = {
    home:       { a:'#8b5cf6', b:'#22d3ee', c:'#6d28d9' },
    about:      { a:'#6d28d9', b:'#8b5cf6', c:'#22d3ee' },
    experience: { a:'#8b5cf6', b:'#22d3ee', c:'#6d28d9' },
    education:  { a:'#22d3ee', b:'#6d28d9', c:'#8b5cf6' },
    skills:     { a:'#6d28d9', b:'#8b5cf6', c:'#22d3ee' },
    deliver:    { a:'#8b5cf6', b:'#6d28d9', c:'#22d3ee' },
    contact:    { a:'#22d3ee', b:'#8b5cf6', c:'#6d28d9' },
    'main-content': { a:'#8b5cf6', b:'#22d3ee', c:'#6d28d9' }
  };

  function hexToRgb(hex){
    if (!hex) return null;
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (hex.length !== 6) return null;
    return {
      r: parseInt(hex.slice(0,2), 16),
      g: parseInt(hex.slice(2,4), 16),
      b: parseInt(hex.slice(4,6), 16)
    };
  }

  function tweenOrbVar(varName, hexTo){
    const current = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    const from = hexToRgb(current) || hexToRgb(hexTo);
    const to   = hexToRgb(hexTo);
    if (!from || !to) return;
    const proxy = { r: from.r, g: from.g, b: from.b };
    gsap.to(proxy, {
      r: to.r, g: to.g, b: to.b,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate(){
        document.documentElement.style.setProperty(
          varName,
          `rgb(${proxy.r|0}, ${proxy.g|0}, ${proxy.b|0})`
        );
      }
    });
  }

  document.querySelectorAll('.section[id]').forEach(sec => {
    const p = palette[sec.id];
    if (!p) return;
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 60%',
      end: 'bottom 40%',
      onToggle: self => {
        if (!self.isActive) return;
        tweenOrbVar('--accent-orb',      p.a);
        tweenOrbVar('--accent-2-orb',    p.b);
        tweenOrbVar('--accent-soft-orb', p.c);
      }
    });
  });

  if (hasFinePointer && !isMobile){
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let rafId = null;

    window.addEventListener('mousemove', (e) => {
      const w = window.innerWidth, h = window.innerHeight;
      tx = ((e.clientX / w) - 0.5) * 40;
      ty = ((e.clientY / h) - 0.5) * 40;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }, { passive: true });

    function tick(){
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      orb1.style.setProperty('--mx', cx + 'px');
      orb1.style.setProperty('--my', cy + 'px');
      orb2.style.setProperty('--mx', (-cx * 0.6) + 'px');
      orb2.style.setProperty('--my', (-cy * 0.6) + 'px');
      const settled = Math.abs(tx - cx) < 0.1 && Math.abs(ty - cy) < 0.1;
      rafId = settled ? null : requestAnimationFrame(tick);
    }
  }
})();

/* ============================================================
   SCROLL-TEXT — per-word reveal, scrubbed to scroll
   ============================================================ */
(function initScrollText(){
  const SCROLL_TEXT_SELECTORS = [
    '.page-title-desc',
    '.about-lead',
    '.deliver-text',
    '.fact-value',
    '.edu-body h3',
    '.edu-body p',
    '.skill-summary',
    '.highlight-item p',
    '.contact-value',
    '.experience-status-card h3',
    '.experience-status-card > p',
    '.project-pitch',
    '.project-body p'
  ];

  const els = document.querySelectorAll(SCROLL_TEXT_SELECTORS.join(','));
  if (!els.length) return;

  function splitIntoWords(el){
    if (el.dataset.wordsplit === 'true') return [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) textNodes.push(n);

    const spans = [];
    textNodes.forEach(node => {
      const parts = node.nodeValue.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'sw';
          span.textContent = part;
          frag.appendChild(span);
          spans.push(span);
        }
      });
      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    });

    el.dataset.wordsplit = 'true';
    return spans;
  }

  els.forEach(el => el.classList.add('scroll-text'));

  if (prefersReducedMotion) {
    els.forEach(el => {
      el.classList.add('is-lit');
      const words = splitIntoWords(el);
      words.forEach(w => { w.style.opacity = '1'; });
    });
    return;
  }

  if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
    els.forEach(el => {
      const words = splitIntoWords(el);
      if (!words.length) { el.classList.add('is-lit'); return; }

      gsap.set(words, { opacity: 0.1 });

      gsap.to(words, {
        opacity: 1,
        ease: 'power1.inOut',
        stagger: { each: 0.045, from: 'start' },
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 32%',
          scrub: 1.1,
          onEnter:     () => el.classList.add('is-lit'),
          onEnterBack: () => el.classList.add('is-lit')
        }
      });
    });
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-lit');
          const words = splitIntoWords(entry.target);
          words.forEach(w => { w.style.opacity = '1'; });
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });

    els.forEach(el => io.observe(el));
  }
})();

/* ---------- PARALLAX ---------- */
const scrubValue = window.innerWidth <= 700 ? true : 0.4;

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
          scrub: scrubValue
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

/* ============================================================
   BUILD-ON-SCROLL
   ============================================================ */
(function initBuildCards(){
  const GRID_SELECTOR = [
    '.about-facts-grid',
    '.deliver-grid',
    '.skills-grid',
    '.contact-grid',
    '.edu-timeline',
    '.experience-highlights',
    '.simple-projects-grid',
    '.showcase-group'
  ].join(',');

  const CARD_SELECTOR = [
    '.fact-card',
    '.deliver-card',
    '.skill-card',
    '.contact-card',
    '.edu-item',
    '.highlight-item',
    '.simple-project-card',
    '.main-project-card'
  ].join(',');

  const isMobile = window.matchMedia('(max-width: 700px)').matches;
  const ROTATE   = isMobile ? 0 : -12;

  const grids = document.querySelectorAll(GRID_SELECTOR);

  grids.forEach(grid => {
    const cards = Array.from(grid.children).filter(el => el.matches(CARD_SELECTOR));
    if (!cards.length) return;

    cards.forEach(card => {
      card.classList.remove('reveal');
      card.classList.add('build-card');
    });

    if (prefersReducedMotion) return;

    if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
      gsap.set(cards, {
        opacity: 0,
        y: isMobile ? 34 : 54,
        scale: isMobile ? 0.97 : 0.93,
        rotateX: ROTATE,
        transformPerspective: 900,
        transformOrigin: '50% 100%',
        force3D: true
      });

      ScrollTrigger.batch(cards, {
        start: 'top 90%',
        once: true,
        batchMax: 6,
        onEnter: batch => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.95,
            ease: 'power3.out',
            stagger: 0.10,
            force3D: true,
            onStart(){
              batch.forEach(card => card.classList.add('is-building'));
            },
            onComplete(){
              batch.forEach(card => card.classList.remove('is-building'));
              gsap.set(batch, { clearProps: 'all' });
            }
          });
        }
      });
    } else {
      cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(38px)';
        card.style.transition = 'opacity .85s cubic-bezier(.16,1,.3,1), transform .85s cubic-bezier(.16,1,.3,1)';
      });

      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          obs.unobserve(el);
          window.setTimeout(() => {
            el.classList.add('is-building');
            el.style.opacity = '1';
            el.style.transform = 'none';
            window.setTimeout(() => {
              el.classList.remove('is-building');
              el.style.transition = '';
              el.style.transform = '';
              el.style.opacity = '';
            }, 900);
          }, i * 90);
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

      cards.forEach(card => io.observe(card));
    }
  });

  const containerPages = document.querySelectorAll('.content-page');
  if (!containerPages.length || prefersReducedMotion) return;

  containerPages.forEach(p => p.classList.add('build-card'));

  if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
    gsap.set(containerPages, {
      opacity: 0,
      y: isMobile ? 30 : 52,
      scale: isMobile ? 0.985 : 0.955,
      transformPerspective: 1200,
      transformOrigin: '50% 0%',
      force3D: true
    });

    ScrollTrigger.batch(containerPages, {
      start: 'top 92%',
      once: true,
      onEnter: batch => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: 'power3.out',
          stagger: 0.08,
          force3D: true,
          onStart(){
            batch.forEach(p => p.classList.add('is-building'));
          },
          onComplete(){
            batch.forEach(p => p.classList.remove('is-building'));
            gsap.set(batch, { clearProps: 'all' });
          }
        });
      }
    });
  } else {
    containerPages.forEach(p => {
      p.style.opacity = '0';
      p.style.transform = 'translateY(36px) scale(0.96)';
      p.style.transition = 'opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)';
    });

    const pageIO = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        obs.unobserve(el);
        el.classList.add('is-building');
        el.style.opacity = '1';
        el.style.transform = 'none';
        window.setTimeout(() => {
          el.classList.remove('is-building');
          el.style.transition = '';
          el.style.transform = '';
          el.style.opacity = '';
        }, 950);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.03 });

    containerPages.forEach(p => pageIO.observe(p));
  }
})();

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
          scrub: scrubValue
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

/* ---------- TITLE MERGE ---------- */
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
      stagger: { each: 0.035, from: 'start' }
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
      { scale: 1, opacity: 1, filter: 'blur(0px)', ease: 'power2.out' },
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

/* ============================================================
   HERO CARD 3D TILT + POINTER-FOLLOWING GLARE
   ============================================================ */
(function initHeroTilt(){
  const card  = document.getElementById('heroInner');
  const glare = card ? card.querySelector('.hero-glare') : null;
  if (!card) return;
  if (!hasFinePointer || prefersReducedMotion) return;

  const MAX_TILT = 5;
  const LERP     = 0.10;

  let targetRX = 0, targetRY = 0;
  let currentRX = 0, currentRY = 0;
  let targetGX = 50, targetGY = 50;
  let currentGX = 50, currentGY = 50;
  let rafPending = false;

  function tick(){
    currentRX += (targetRX - currentRX) * LERP;
    currentRY += (targetRY - currentRY) * LERP;
    currentGX += (targetGX - currentGX) * LERP;
    currentGY += (targetGY - currentGY) * LERP;

    card.style.setProperty('--tilt-x', currentRX.toFixed(3) + 'deg');
    card.style.setProperty('--tilt-y', currentRY.toFixed(3) + 'deg');
    if (glare) {
      glare.style.setProperty('--glare-x', currentGX.toFixed(2) + '%');
      glare.style.setProperty('--glare-y', currentGY.toFixed(2) + '%');
    }

    const settled =
      Math.abs(currentRX - targetRX) < 0.01 &&
      Math.abs(currentRY - targetRY) < 0.01 &&
      Math.abs(currentGX - targetGX) < 0.05 &&
      Math.abs(currentGY - targetGY) < 0.05;

    if (!settled) {
      requestAnimationFrame(tick);
    } else {
      rafPending = false;
      card.style.willChange = 'auto';
    }
  }

  function kick(){
    if (!rafPending) {
      card.style.willChange = 'transform';
      rafPending = true;
      requestAnimationFrame(tick);
    }
  }

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top)  / rect.height;

    targetRY = (px - 0.5) * 2 * MAX_TILT;
    targetRX = -(py - 0.5) * 2 * MAX_TILT;

    targetGX = px * 100;
    targetGY = py * 100;
    kick();
  });

  card.addEventListener('mouseleave', () => {
    targetRX = 0;
    targetRY = 0;
    targetGX = 50;
    targetGY = 50;
    kick();
  });
})();

/* ============================================================
   HERO NAME — balloon float + per-letter mouse repulsion
   ============================================================ */
(function initHeroNameBalloon(){
  const heroName = document.getElementById('heroName');
  const heroCard = document.getElementById('heroInner');
  if (!heroName || !heroCard) return;

  const lines = heroName.querySelectorAll('.reveal-line');
  const outerLetters = [];
  const innerLetters = [];

  lines.forEach(line => {
    const text = line.textContent;
    line.textContent = '';
    Array.from(text).forEach(ch => {
      const outer = document.createElement('span');
      outer.className = 'hero-name-letter';
      const inner = document.createElement('span');
      inner.className = 'hero-name-letter-inner';
      inner.textContent = ch === ' ' ? '\u00A0' : ch;
      outer.appendChild(inner);
      line.appendChild(outer);
      outerLetters.push(outer);
      innerLetters.push(inner);
    });
  });

  if (prefersReducedMotion || !hasGSAP) return;

  outerLetters.forEach((letter, i) => {
    const drift = gsap.utils.random(5, 9);
    const durY  = gsap.utils.random(3.8, 5.2);
    const phase = (i % 6) * 0.22;

    gsap.fromTo(letter,
      { y: -drift },
      {
        y: drift,
        duration: durY,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: phase
      }
    );
  });

  const REPEL_RADIUS = 190;
  const MAX_PUSH     = 48;
  const FOLLOW_DUR   = 0.4;
  const RETURN_DUR   = 1.0;

  let mouseX = 0, mouseY = 0;
  let repelRaf = null;

  function applyRepel(){
    repelRaf = null;

    const rects = outerLetters.map(el => el.getBoundingClientRect());

    for (let i = 0; i < innerLetters.length; i++){
      const inner = innerLetters[i];
      const r = rects[i];
      const cx = r.left + r.width  * 0.5;
      const cy = r.top  + r.height * 0.5;
      const dx = cx - mouseX;
      const dy = cy - mouseY;
      const dist = Math.hypot(dx, dy) || 0.0001;

      let tx = 0, ty = 0;

      if (dist < REPEL_RADIUS){
        const t = 1 - dist / REPEL_RADIUS;
        const force = t * t * MAX_PUSH;
        const angle = Math.atan2(dy, dx);
        tx = Math.cos(angle) * force;
        ty = Math.sin(angle) * force;
      }

      const returning = (tx === 0 && ty === 0);

      gsap.to(inner, {
        x: tx,
        y: ty,
        duration: returning ? RETURN_DUR : FOLLOW_DUR,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }

  function scheduleRepel(){
    if (!repelRaf) repelRaf = requestAnimationFrame(applyRepel);
  }

  if (hasFinePointer){
    heroCard.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      scheduleRepel();
    });

    heroCard.addEventListener('mouseleave', () => {
      innerLetters.forEach((inner, i) => {
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: 1.4,
          ease: 'elastic.out(1, 0.55)',
          overwrite: 'auto',
          delay: i * 0.018
        });
      });
    });
  }
})();

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
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeMenu(){
    topNav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
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

/* ---------- PROJECT CAROUSEL (index only) ---------- */
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
  if (!toTopBtn) return;
  if (window.scrollY > 600) {
    toTopBtn.classList.add('visible');
  } else {
    toTopBtn.classList.remove('visible');
  }
}
if (toTopBtn) {
  toTopBtn.addEventListener('click', () => {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      smoothScrollTo(0, 1.25);
    }
  });
}

/* ============================================================
   SWIPE NAVIGATION — home ⇄ projects
   ============================================================
   • On the home page, swipe right→left to open projects.html
   • On the projects page, swipe left→right to return to index.html */
(function initSwipeNavigation(){
  const isHomePage     = !!document.getElementById('heroName');
  const isProjectsPage = !!document.querySelector('.projects-showcase');
  if (!isHomePage && !isProjectsPage) return;

  const TARGET_URL = isHomePage ? 'projects.html' : 'index.html';
  const ALLOW_DIR  = isHomePage ? 'left' : 'right';
  const FROM       = isHomePage ? 'right' : 'left';

  const DIST_THRESHOLD  = 90;
  const VELOCITY_MIN    = 0.45;
  const AXIS_SLOP       = 1.4;
  const MAX_DURATION_MS = 900;
  const DRAG_SPAN       = 0.75;

  let startX = 0, startY = 0, startT = 0;
  let tracking = false;
  let axis = null;
  let veil = null;
  let navigated = false;
  let suppressClickUntil = 0;

  function isBlocked(target){
    if (document.body.classList.contains('menu-open')) return true;
    const modal = document.getElementById('projectModal');
    if (modal && modal.classList.contains('is-open')) return true;
    return !!target.closest(
      '.project-modal, .project-carousel, .modal-gallery-thumbs, ' +
      '.intensity-panel, input[type="range"], [data-lenis-prevent]'
    );
  }

  function showVeil(){
    if (veil) return veil;
    veil = document.createElement('div');
    veil.className = 'swipe-veil swipe-veil--from-' + FROM;
    document.body.style.perspective = '1200px';
    document.body.appendChild(veil);
    return veil;
  }

  function hideVeil(){
    if (!veil) return;
    const el = veil;
    veil = null;
    el.style.transition = 'transform .34s cubic-bezier(.4,0,1,1)';
    el.style.transform  = FROM === 'right' ? 'translateX(100%) rotateY(0deg)' : 'translateX(-100%) rotateY(0deg)';
    el.addEventListener('transitionend', () => el.remove(), { once:true });
    window.setTimeout(() => el.remove(), 600);
  }

  function finish(){
    if (navigated) return;
    navigated = true;

    let gone = false;
    const go = () => {
      if (gone) return;
      gone = true;
      window.location.href = TARGET_URL;
    };

    if (!veil){ go(); return; }

    const el = veil;
    el.classList.add('flip-complete');
    el.style.transition = 'transform .42s cubic-bezier(.7,0,.3,1)';
    el.style.transform  = FROM === 'right'
      ? 'translateX(0) rotateY(-90deg)'
      : 'translateX(0) rotateY(90deg)';
    el.addEventListener('transitionend', go, { once:true });
    window.setTimeout(go, 640);
  }

  document.addEventListener('touchstart', (e) => {
    if (navigated) return;
    if (e.touches.length !== 1){ tracking = false; return; }
    if (isBlocked(e.target)){ tracking = false; return; }

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startT = performance.now();
    axis = null;
    tracking = true;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!tracking || navigated) return;

    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    const dx = x - startX;
    const dy = y - startY;

    if (!axis){
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      axis = Math.abs(dx) > Math.abs(dy) * AXIS_SLOP ? 'x' : 'y';
      if (axis === 'y'){ tracking = false; return; }
    }
    if (axis !== 'x') return;

    const dir = dx < 0 ? 'left' : 'right';
    if (dir !== ALLOW_DIR){ hideVeil(); return; }

    showVeil();
    veil.classList.add('is-flipping');

    const span     = window.innerWidth * DRAG_SPAN;
    const progress = Math.min(Math.abs(dx) / span, 1);

    /* Paper flip rotation: 0deg (hidden) → 85deg (fully flipped) */
    const rotation = progress * 85;
    const translatePercent = 100 - (progress * 100);

    veil.style.transition = 'none';

    if (FROM === 'right') {
      veil.style.transform = `translateX(${translatePercent}%) rotateY(-${rotation}deg)`;
    } else {
      veil.style.transform = `translateX(${-translatePercent}%) rotateY(${rotation}deg)`;
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!tracking || navigated) return;
    tracking = false;

    const t  = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    const dt = Math.max(performance.now() - startT, 1);

    const dist        = Math.abs(dx);
    const velocity    = dist / dt;
    const correctDir  = ALLOW_DIR === 'left' ? dx < 0 : dx > 0;
    const horizontal  = Math.abs(dx) > Math.abs(dy) * 1.2;
    const notTooLong  = dt < MAX_DURATION_MS;

    const shouldNavigate =
      axis === 'x' &&
      correctDir &&
      horizontal &&
      notTooLong &&
      Math.abs(dy) < 90 &&
      (dist > DIST_THRESHOLD || (velocity > VELOCITY_MIN && dist > 40));

    if (shouldNavigate){
      suppressClickUntil = performance.now() + 400;
      finish();
    } else {
      if (axis === 'x') suppressClickUntil = performance.now() + 350;
      hideVeil();
    }
    axis = null;
  }, { passive: true });

  document.addEventListener('touchcancel', () => {
    tracking = false;
    axis = null;
    hideVeil();
  }, { passive: true });

  document.addEventListener('click', (e) => {
    if (performance.now() < suppressClickUntil){
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);
})();