/* ============================================================
   PROJECT DETAIL MODAL
   Powers both .main-project-card and .simple-project-card.
   Each card is a self-contained component: it carries its own
   title, tags and links right in the markup, plus a hidden
   <template class="project-detail-data"> with the extra content
   (screenshots, full description, "how it works" breakdown)
   that only appears once the card is opened. To add a project,
   duplicate a card block in projects.html and edit its content —
   no JS changes needed.
   ============================================================ */
(function projectModal(){
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  const hasGSAP = typeof gsap !== 'undefined';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const panel = modal.querySelector('.project-modal-panel');
  const backdrop = modal.querySelector('.project-modal-backdrop');
  const closeBtn = modal.querySelector('.project-modal-close');
  const galleryImg = document.getElementById('modalGalleryImg');
  const galleryPrev = modal.querySelector('[data-gallery-prev]');
  const galleryNext = modal.querySelector('[data-gallery-next]');
  const thumbsWrap = document.getElementById('modalThumbs');
  const badgeEl = document.getElementById('modalBadge');
  const titleEl = document.getElementById('modalTitle');
  const tagsEl = document.getElementById('modalTags');
  const descEl = document.getElementById('modalDesc');
  const structureEl = document.getElementById('modalStructure');
  const linksEl = document.getElementById('modalLinks');

  let gallery = [];
  let galleryIndex = 0;
  let lastFocused = null;

  function renderGalleryImage(){
    if (!gallery.length) return;
    const shot = gallery[galleryIndex];
    if (hasGSAP && !prefersReducedMotion){
      gsap.to(galleryImg, { opacity: 0, duration: 0.16, onComplete: () => {
        galleryImg.src = shot.src;
        galleryImg.alt = shot.alt || '';
        gsap.to(galleryImg, { opacity: 1, duration: 0.28 });
      }});
    } else {
      galleryImg.src = shot.src;
      galleryImg.alt = shot.alt || '';
    }
    thumbsWrap.querySelectorAll('img').forEach((t, i) => t.classList.toggle('is-active', i === galleryIndex));
  }

  function goGallery(step){
    if (!gallery.length) return;
    galleryIndex = (galleryIndex + step + gallery.length) % gallery.length;
    renderGalleryImage();
  }

  function buildLinkBtn(href, label, variant, iconPath){
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'hero-cta ' + variant;
    a.innerHTML = '<svg class="cta-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">' + iconPath + '</svg><span>' + label + '</span>';
    return a;
  }

  function openModal(card){
    lastFocused = document.activeElement;

    const titleNode = card.querySelector('h3, h4');
    const title = titleNode ? titleNode.textContent.trim() : 'Project';
    const badge = card.dataset.badge || '';
    const tags = Array.from(card.querySelectorAll('.tag-row span')).map(t => t.textContent.trim());
    const githubLink = card.querySelector('a[data-role="github"]');
    const demoLink = card.querySelector('a[data-role="demo"]');
    const dataTemplate = card.querySelector('template.project-detail-data');

    badgeEl.textContent = badge;
    badgeEl.style.display = badge ? '' : 'none';
    titleEl.textContent = title;
    tagsEl.innerHTML = tags.map(t => '<span>' + t + '</span>').join('');

    descEl.innerHTML = '';
    structureEl.innerHTML = '';
    gallery = [];

    if (dataTemplate){
      const frag = dataTemplate.content.cloneNode(true);
      const descNode = frag.querySelector('.detail-desc');
      if (descNode) descEl.innerHTML = descNode.innerHTML;
      const structureNode = frag.querySelector('.detail-structure');
      if (structureNode) structureEl.innerHTML = structureNode.innerHTML;
      gallery = Array.from(frag.querySelectorAll('.detail-gallery img')).map(img => ({ src: img.getAttribute('src'), alt: img.getAttribute('alt') }));
    }

    // fall back to the card's own cover image if no gallery shots were given
    if (!gallery.length){
      const coverImg = card.querySelector('.main-project-media img, .simple-project-media img');
      if (coverImg) gallery = [{ src: coverImg.getAttribute('src'), alt: coverImg.getAttribute('alt') }];
    }

    thumbsWrap.innerHTML = gallery.map(s => '<img src="' + s.src + '" alt="">').join('');
    thumbsWrap.querySelectorAll('img').forEach((thumb, i) => thumb.addEventListener('click', () => { galleryIndex = i; renderGalleryImage(); }));
    const hasMultipleShots = gallery.length > 1;
    galleryPrev.style.display = hasMultipleShots ? '' : 'none';
    galleryNext.style.display = hasMultipleShots ? '' : 'none';
    galleryIndex = 0;
    if (gallery.length){
      galleryImg.src = gallery[0].src;
      galleryImg.alt = gallery[0].alt || '';
      galleryImg.style.opacity = 1;
    }
    thumbsWrap.querySelectorAll('img').forEach((t, i) => t.classList.toggle('is-active', i === 0));

    linksEl.innerHTML = '';
    if (githubLink){
      linksEl.appendChild(buildLinkBtn(githubLink.href, 'View code', 'hero-cta--ghost',
        '<path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.22-3.37-1.22-.46-1.2-1.11-1.52-1.11-1.52-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 015 0c1.9-1.33 2.74-1.05 2.74-1.05.56 1.41.2 2.46.1 2.72.65.71 1.03 1.62 1.03 2.74 0 3.93-2.35 4.79-4.58 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.5A10.02 10.02 0 0022 12.2C22 6.58 17.52 2 12 2z" fill="currentColor" stroke="none"/>'));
    }
    if (demoLink){
      linksEl.appendChild(buildLinkBtn(demoLink.href, 'Live demo', 'hero-cta--primary',
        '<path d="M7 17L17 7M17 7H9M17 7v8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'));
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (hasGSAP){
      gsap.killTweensOf([backdrop, panel]);
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.to(backdrop, { opacity: 1, duration: prefersReducedMotion ? 0.01 : 0.3 })
        .to(panel, { opacity: 1, y: 0, scale: 1, duration: prefersReducedMotion ? 0.01 : 0.5 }, '<0.05')
        .fromTo([badgeEl, titleEl, tagsEl, descEl, structureEl, linksEl],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: prefersReducedMotion ? 0.01 : 0.45, stagger: prefersReducedMotion ? 0 : 0.06 }, '<0.1');
    } else {
      backdrop.style.opacity = 1;
      panel.style.opacity = 1;
      panel.style.transform = 'none';
    }

    closeBtn.focus();
  }

  function closeModal(){
    if (!modal.classList.contains('is-open')) return;

    const finish = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    };

    if (hasGSAP && !prefersReducedMotion){
      gsap.timeline({ onComplete: finish })
        .to(panel, { opacity: 0, y: 16, scale: 0.97, duration: 0.28, ease: 'power2.in' })
        .to(backdrop, { opacity: 0, duration: 0.22 }, '<');
    } else {
      finish();
    }
  }

  document.querySelectorAll('.main-project-card, .simple-project-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View project details');

    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; // let GitHub / live-demo links navigate normally
      openModal(card);
    });
    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')){
        e.preventDefault();
        openModal(card);
      }
    });
  });

  modal.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', closeModal));
  closeBtn.addEventListener('click', closeModal);
  galleryPrev.addEventListener('click', () => goGallery(-1));
  galleryNext.addEventListener('click', () => goGallery(1));
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') goGallery(1);
    if (e.key === 'ArrowLeft') goGallery(-1);
  });
})();
