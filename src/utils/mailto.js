export const CONTACT_EMAIL = 'bikashdhakal546@gmail.com';

const gmailComposeUrl = (email) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;

/**
 * Open Gmail compose immediately (synchronously inside the click, so pop-up
 * blockers allow it). No mailto: round-trip, no delays.
 */
export function openMail(email = CONTACT_EMAIL) {
  if (typeof window === 'undefined') return;
  const win = window.open(gmailComposeUrl(email), '_blank');
  if (win) {
    win.opener = null;
    return;
  }
  // Pop-up blocked: navigate the current tab as a last resort.
  window.location.href = gmailComposeUrl(email);
}

/** onClick handler for <a href="mailto:..."> elements. */
export function handleMailClick(event, email = CONTACT_EMAIL) {
  event.preventDefault();
  openMail(email);
}
