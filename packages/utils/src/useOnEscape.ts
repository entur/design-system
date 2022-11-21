import React, { useEffect } from 'react';

export const useOnEscape = (
  ref: React.RefObject<HTMLDivElement>,
  handler: () => void,
) => {
  useEffect(() => {
    const runIfKeyIsEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handler();
    };

    ref.current?.addEventListener('keydown', runIfKeyIsEscape);

    return () => ref.current?.removeEventListener('keydown', runIfKeyIsEscape);
  }, [ref, handler]);
};
