import { useEffect, useState } from 'react';

export const useShowDelayedLabel = (isCollapsed: boolean): [boolean] => {
  const [showLabel, setShowLabel] = useState(true);
  const hideDelay = 50;
  const showDelay = 200;
  useEffect(() => {
    if (isCollapsed) {
      setTimeout(() => {
        setShowLabel(false);
      }, hideDelay);
    }
    if (!isCollapsed) {
      setTimeout(() => {
        setShowLabel(true);
      }, showDelay);
    }
    return () => undefined;
  }, [isCollapsed]);
  return [showLabel];
};
