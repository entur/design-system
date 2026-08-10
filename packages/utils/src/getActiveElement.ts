/**
 * Returns the active element, drilling into shadow roots.
 * `document.activeElement` stops at the shadow host — this
 * follows the chain into nested shadow roots.
 *
 * Use this instead of `document.activeElement` whenever the result is
 * compared to an element that may live inside a shadow root.
 */
export function getActiveElement(
  root: Document | ShadowRoot = document,
): Element | null {
  const active = root.activeElement;
  if (active?.shadowRoot) {
    return getActiveElement(active.shadowRoot);
  }
  return active;
}
