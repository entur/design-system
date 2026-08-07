const SCROLL_OFFSET_REM = 5.5;

export const getNavbarHeightPx = () => {
  if (typeof window === 'undefined') return SCROLL_OFFSET_REM * 16;
  const val = getComputedStyle(document.documentElement)
    .getPropertyValue('--navbar-height')
    .trim();
  const height = parseFloat(val);
  if (isNaN(height)) return SCROLL_OFFSET_REM * 16;
  return (height + 1.5) * 16;
};

export const scrollToElement = (elementId: string, offset?: number) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const scrollOffset = offset !== undefined ? offset * 16 : getNavbarHeightPx();
  const top =
    element.getBoundingClientRect().top + window.scrollY - scrollOffset;

  window.scrollTo({ top, behavior: 'smooth' });
};

export const handleHashLinkClick = (
  event: React.MouseEvent<HTMLAnchorElement>,
) => {
  const href = event.currentTarget.getAttribute('href');
  if (!href?.startsWith('#')) return;

  event.preventDefault();
  const elementId = href.substring(1);
  history.replaceState(null, '', href);
  scrollToElement(elementId);
};

export const scrollToHashOnLoad = () => {
  if (typeof window === 'undefined') return;

  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      const elementId = hash.substring(1);
      scrollToElement(elementId);
    }, 100);
  }
};
