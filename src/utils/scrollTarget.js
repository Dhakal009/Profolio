// Sticky stack sections report their pinned visual position, not their flow
// position. Walk offset parents so navigation can target their real document Y.
export function getScrollTarget(element) {
  const stackSection = element.closest('.stack-section');
  if (!stackSection) return element;

  const stackRoot = stackSection.closest('.stack-root');
  if (!stackRoot) return element;

  let top = stackRoot.getBoundingClientRect().top + window.scrollY;
  let current = stackRoot.firstElementChild;
  while (current && current !== stackSection) {
    top += current.offsetHeight;
    current = current.nextElementSibling;
  }

  return top;
}
