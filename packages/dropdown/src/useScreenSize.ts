import React from 'react';
import { breakpoints } from '@entur/tokens';

export type ScreenSize = 'unknown' | 'small' | 'large';

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = React.useState<ScreenSize>('unknown');
  React.useEffect(() => {
    const mediaQuery = window.matchMedia(
      `screen and (min-width: ${breakpoints.large / 16}rem)`,
    );

    function updateSize(e: MediaQueryListEvent | MediaQueryList) {
      setScreenSize(e.matches ? 'large' : 'small');
    }

    updateSize(mediaQuery);
    mediaQuery.addListener(updateSize);
    return () => mediaQuery.removeListener(updateSize);
  }, []);

  return screenSize;
};
