import { RefObject, useMemo } from 'react';
import type { Environment } from 'downshift';

import { getActiveElement } from '@entur/utils';

/**
 * Creates a downshift `environment` that works inside shadow DOM.
 *
 * Downshift attaches mouse/touch listeners on `window` by default.
 * In shadow DOM, events that cross the shadow boundary have their
 * `event.target` retargeted to the shadow host, which makes
 * downshift's outside-click detection misfire and close the dropdown
 * before selections register.
 *
 * This adapter redirects downshift's event listeners to the shadow
 * root (where targets are not retargeted) and proxies
 * `document.activeElement` so it drills into shadow roots instead of
 * stopping at the shadow host.
 *
 * Outside shadow DOM this returns `undefined`, letting downshift
 * use its default `window` environment.
 *
 * @see https://github.com/downshift-js/downshift/issues/1622
 */
function createShadowEnvironment(shadowRoot: ShadowRoot): Environment {
  return {
    addEventListener: shadowRoot.addEventListener.bind(shadowRoot),
    removeEventListener: shadowRoot.removeEventListener.bind(shadowRoot),
    Node: window.Node,
    document: new Proxy(document, {
      get(target, prop) {
        if (prop === 'activeElement') {
          return getActiveElement();
        }
        // Read with `target` as the receiver, not the proxy: accessors on
        // Document.prototype (`body`, `head`, …) are branded and throw
        // "Illegal invocation" when invoked with anything else as `this`.
        const value = Reflect.get(target, prop);
        return typeof value === 'function' ? value.bind(target) : value;
      },
    }),
  };
}

/**
 * Hook that returns a downshift `environment` prop value.
 * Returns a shadow-DOM-aware environment when the ref element
 * lives inside a shadow root, or `undefined` otherwise.
 *
 * Must be passed to every downshift hook (`useSelect`, `useCombobox`,
 * `useMultipleSelection`) used by the component.
 *
 * @param ref – ref to any element inside the dropdown component
 */
export function useShadowDomEnvironment(
  ref: RefObject<HTMLElement | null>,
): Environment | undefined {
  return useMemo(() => {
    const el = ref.current;
    if (!el) return undefined;

    const root = el.getRootNode();
    if (!(root instanceof ShadowRoot)) return undefined;

    return createShadowEnvironment(root);
    // ref.current changes from null to the DOM element after mount,
    // which triggers recomputation. This is intentional despite being
    // a ref — we need the environment to be created once the element
    // is available.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current]);
}
