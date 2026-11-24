import './section-focus.css';

// Order must match the order on the page. Missing ids are skipped automatically.
export const SECTION_NAV = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'deliver', label: 'Deliver' },
  { id: 'contact', label: 'Contact' },
];

export function useSectionFocus() {}

export function ScrollProgress() {
  return null;
}