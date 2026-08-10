/**
 * Returns the active element, drilling into shadow roots.
 * `document.activeElement` stops at the shadow host — this
 * follows the chain into nested shadow roots.
 *
 * Use this instead of `document.activeElement` whenever the result is
 * compared to an element that may live inside a shadow root.
 *
 * Returns `null` when there is no DOM, so it is safe to call during
 * server rendering.
 */
export function getActiveElement(root?: Document | ShadowRoot): Element | null {
  const target =
    root ?? (typeof document === 'undefined' ? undefined : document);
  const active = target?.activeElement ?? null;
  if (active?.shadowRoot) {
    return getActiveElement(active.shadowRoot);
  }
  return active;
}
