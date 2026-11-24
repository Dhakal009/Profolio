/**
 * Device / network profile used to scale the site down gracefully.
 *  - lite:   data-saver, 2g/3g-ish connection, or a low-end device
 *  - no3d:   skip the WebGL tunnel entirely (data-saver / very slow network)
 */
const conn = () =>
  typeof navigator === 'undefined'
    ? null
    : navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;

export function getPerfProfile() {
  if (typeof navigator === 'undefined') return { lite: false, no3d: false };
  const c = conn();
  const type = c?.effectiveType || '';
  const saveData = !!c?.saveData;
  const slowNet = type === 'slow-2g' || type === '2g';
  const midNet = type === '3g';
  const lowMem = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 2;
  const lowCpu = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2;
  return {
    lite: saveData || slowNet || midNet || lowMem || lowCpu,
    no3d: saveData || slowNet || lowMem,
  };
}

/** Adds html.perf-lite (disables expensive blur/backdrop effects via CSS). */
export function applyPerfProfile() {
  if (typeof document === 'undefined') return;
  const { lite } = getPerfProfile();
  document.documentElement.classList.toggle('perf-lite', lite);
  const c = conn();
  if (c?.addEventListener && !applyPerfProfile.bound) {
    applyPerfProfile.bound = true;
    c.addEventListener('change', applyPerfProfile);
  }
}
