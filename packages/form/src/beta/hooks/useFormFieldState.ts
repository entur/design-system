import { useState, useCallback } from 'react';

/**
 * Hook for managing form field state (filled, focused, etc.)
 * Following patterns from Material-UI and Ant Design
 */
export const useFormFieldState = (initialValue?: string | number) => {
  const [isFilled, setIsFilled] = useState<boolean>(() => {
    return Boolean(initialValue && String(initialValue).trim().length > 0);
  });

  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const updateFilledState = useCallback(
    (value: string | number | undefined) => {
      const filled = Boolean(value && String(value).trim().length > 0);
      setIsFilled(filled);
    },
    [],
  );

  return {
    isFilled,
    isFocused,
    isHovered,
    setIsFilled,
    setIsFocused,
    setIsHovered,
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    updateFilledState,
  };
};
