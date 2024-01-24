import { useEffect, useRef } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callBack: T,
  debounceTime: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedFunc = (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callBack(...args);
    }, debounceTime);
  };

  return debouncedFunc as T;
}
