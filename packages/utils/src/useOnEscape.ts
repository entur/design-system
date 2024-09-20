import React, { useEffect } from 'react';

export const useOnEscape = (
  ref: React.RefObject<any> | React.MutableRefObject<any>,
  handler: () => void,
) => {
  useEffect(() => {
    const runIfKeyIsEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handler();
    };

    const currentRef = ref.current;
    currentRef?.addEventListener('keydown', runIfKeyIsEscape);

    return () => currentRef?.removeEventListener('keydown', runIfKeyIsEscape);
  }, [ref, handler]);
};
