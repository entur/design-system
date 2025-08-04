/**
 * Smoothly scrolls to an element with proper offset for the fixed navbar
 * @param elementId - The ID of the element to scroll to
 * @param offset - Additional offset (defaults to navbar height + 1rem)
 */
export const scrollToElement = (elementId: string, offset?: number) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Calculate the offset (navbar height + 1rem by default)
  const defaultOffset = 2; // 5rem navbar + 1rem spacing
  const scrollOffset = offset ?? defaultOffset;

  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition - scrollOffset * 16; // Convert rem to px (16px = 1rem)

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

/**
 * Handles hash link clicks with proper scroll offset
 * @param event - The click event
 */
export const handleHashLinkClick = (
  event: React.MouseEvent<HTMLAnchorElement>,
) => {
  const href = event.currentTarget.getAttribute('href');
  if (!href?.startsWith('#')) return;

  event.preventDefault();
  const elementId = href.substring(1);
  scrollToElement(elementId);
};

/**
 * Scrolls to hash on page load if URL contains a hash
 */
export const scrollToHashOnLoad = () => {
  if (typeof window === 'undefined') return;

  const hash = window.location.hash;
  if (hash) {
    // Small delay to ensure the page is fully rendered
    setTimeout(() => {
      const elementId = hash.substring(1);
      scrollToElement(elementId);
    }, 100);
  }
};
