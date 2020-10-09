import React from 'react';

export function useOnMount(callback: () => void): void {
  const hasRun = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      callback();
    }
  }, [callback]);
}
