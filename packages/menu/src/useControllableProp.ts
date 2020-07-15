import { useState, useEffect } from 'react';
export type UseControllablePropType<T> = {
  prop?: T;
  updater?: (value?: T) => void;
  defaultValue: T;
};
export function useControllableProp<T>({
  prop,
  updater = () => {},
  defaultValue,
}: UseControllablePropType<T>): [T, Function] {
  const [internalState, setInternalState] = useState<T>(defaultValue);
  useEffect(() => {
    if (prop !== undefined) {
      setInternalState(prop);
    }
  }, [prop]);
  return prop === undefined
    ? [internalState, setInternalState]
    : [prop, updater];
}
