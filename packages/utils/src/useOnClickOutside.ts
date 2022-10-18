import React, { useEffect } from 'react';

export const useOnClickOutside = (
  refs: React.RefObject<HTMLDivElement>[],
  handler: () => void,
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      // If the ref contains the clicked element, then the click is not outside
      if (refs.some(ref => elementContainsEventTarget(ref.current, event))) {
        return;
      }

      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [refs, handler]);
};

const elementContainsEventTarget = (
  element: HTMLElement | null,
  event: Event,
) => {
  if (!element) {
    return false;
  }

  if (element.contains(event.target as Node)) {
    return true;
  }

  // For elements inside a Shadow DOM we need to check the composedPath
  if (event.composed && event.composedPath) {
    const contains = event.composedPath().find(target => {
      if (target === window) {
        return false;
      }
      return element.contains(target as Node);
    });
    return contains ? true : false;
  }

  return false;
};
