import { useSyncExternalStore } from 'react';

type WindowDimensions = {
  width: number | undefined;
  height: number | undefined;
};

const subscribe = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

let cachedSnapshot: WindowDimensions = { width: undefined, height: undefined };

const getSnapshot = (): WindowDimensions => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (cachedSnapshot.width !== width || cachedSnapshot.height !== height) {
    cachedSnapshot = { width, height };
  }
  return cachedSnapshot;
};

const serverSnapshot: WindowDimensions = {
  width: undefined,
  height: undefined,
};
const getServerSnapshot = () => serverSnapshot;

export const useWindowDimensions = (): WindowDimensions => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
