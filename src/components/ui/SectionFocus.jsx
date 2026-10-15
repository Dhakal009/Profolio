import { useEffect, useState } from 'react';
import './section-focus.css';

// Order must match the order on the page. Missing ids are skipped automatically.
export const SECTION_NAV = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'deliver', label: 'Deliver' },
  { id: 'contact', label: 'Contact' },
];

/**
 * Tracks which section crosses the vertical centre of the viewport and tags every
 * section with data-state="past" | "active" | "upcoming". CSS does the visuals.
 * Uses data attributes (not classes) so React re-renders never overwrite them.
 */
export function useSectionFocus(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return undefined;

    const order = els.map((el) => el.id);
    document.documentElement.classList.add('has-section-focus');

    const crossing = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        });

        // Between sections nothing may cross the centre line: keep the previous one.
        const current = order.find((id) => crossing.has(id));
        if (!current) return;

        const ci = order.indexOf(current);
        els.forEach((el, i) => {
          el.dataset.state = i < ci ? 'past' : i === ci ? 'active' : 'upcoming';
        });
        setActive(current);
      },
      // A 10%-tall band at the centre of the viewport
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );

    els.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      document.documentElement.classList.remove('has-section-focus');
      els.forEach((el) => delete el.dataset.state);
    };
  }, [ids]);

  return { active };
}

export function ScrollProgress() {
  return null;
}