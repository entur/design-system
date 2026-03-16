import { useState, useEffect } from 'react';
export type UseControllablePropType<T> = {
  prop?: T;
  updater?: (value?: T) => void;
  defaultValue: T;
};
export function useControllableProp<T>({
  prop,
  updater = () => undefined,
  defaultValue,
}: UseControllablePropType<T>): [T, (arg: T) => void] {
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
