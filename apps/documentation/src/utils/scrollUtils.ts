const SCROLL_OFFSET_REM = 5.5;

const CONSENT_BANNER_SELECTOR = '.consent-banner';

/** An unanswered consent banner sits at the top of the page and has to stay visible, so
 *  it takes precedence over restoring scroll position or jumping to a hash. */
export const isConsentBannerVisible = () =>
  typeof document !== 'undefined' &&
  document.querySelector(CONSENT_BANNER_SELECTOR) !== null;

export const scrollConsentBannerIntoView = () => {
  if (typeof document === 'undefined') return false;
  const banner = document.querySelector(CONSENT_BANNER_SELECTOR);
  if (!banner) return false;
  banner.scrollIntoView({ block: 'start' });
  return true;
};

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
      if (scrollConsentBannerIntoView()) return;
      const elementId = hash.substring(1);
      scrollToElement(elementId);
    }, 100);
  }
};
