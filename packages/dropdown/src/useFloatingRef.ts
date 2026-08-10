import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * Wraps floating-ui's `setReference` / `setFloating` in a stable ref callback
 * that ignores detach calls, so the menu cannot get stuck in a render loop.
 *
 * The loop, step by step:
 *
 * 1. downshift's prop getters build a new ref callback on every render.
 * 2. When a callback ref changes identity, React detaches the old one
 *    (`ref(null)`) and attaches the new one (`ref(node)`).
 * 3. `setReference` and `setFloating` are state setters, so those two calls
 *    trigger two renders — which build a new ref callback again.
 *
 * While the menu is open that never settles and React throws
 * "Maximum update depth exceeded".
 *
 * Skipping the `null` call breaks the loop: floating-ui's own identity check
 * then bails on the re-attach, so no state is set and no render follows.
 * Skipping it is safe because these elements stay mounted and are hidden with
 * `display: none` — a detach here never means the element is gone.
 *
 * The returned callback keeps one identity for the component's lifetime, so it
 * cannot become the churn it prevents. `setElement` is read through a ref to
 * keep that true even when a caller passes a new function each render; the
 * trade-off is that a new `setElement` takes effect on the next attach rather
 * than immediately.
 */
export function useFloatingRef<ElementType extends HTMLElement>(
  setElement: (node: ElementType | null) => void,
): (node: ElementType | null) => void {
  const latestSetElement = useRef(setElement);

  useLayoutEffect(() => {
    latestSetElement.current = setElement;
  }, [setElement]);

  return useCallback((node: ElementType | null) => {
    if (node !== null) latestSetElement.current(node);
  }, []);
}
