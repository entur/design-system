import React, { useEffect } from 'react';

export type UseOnEscapeOptions = {
  /** Set to false while there is nothing to close. Esc then passes through, e.g. to a surrounding modal.
   * @default true
   */
  enabled?: boolean;
};

export const useOnEscape = (
  ref: React.RefObject<any> | React.MutableRefObject<any>,
  handler: () => void,
  { enabled = true }: UseOnEscapeOptions = {},
) => {
  useEffect(() => {
    if (!enabled) return;
    const runIfKeyIsEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      // Stops a surrounding <dialog> from closing on the same keypress
      event.preventDefault();
      handler();
    };

    const currentRef = ref.current;
    currentRef?.addEventListener('keydown', runIfKeyIsEscape);

    return () => currentRef?.removeEventListener('keydown', runIfKeyIsEscape);
  }, [ref, handler, enabled]);
};
