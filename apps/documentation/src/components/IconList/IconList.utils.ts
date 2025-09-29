import React from 'react';

export interface URLParams {
  search: string;
  category: { label: string; value: string } | null;
}

/**
 * Parse URL search parameters to get initial filter values
 * Only runs once on mount for performance
 */
export const getInitialURLParams = (): URLParams => {
  if (typeof window === 'undefined') {
    return { search: '', category: null };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get('search') || '';
  const category = urlParams.get('category');

  return {
    search,
    category: category ? { label: category, value: category } : null,
  };
};

/**
 * Update URL search parameters without page reload
 * Only updates if values have actually changed
 */
export const updateURLParams = (
  search: string,
  category: string | null,
): void => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);

  // Only update if values actually changed
  const currentSearch = url.searchParams.get('search') || '';
  const currentCategory = url.searchParams.get('category');

  if (currentSearch !== search || currentCategory !== category) {
    if (search) {
      url.searchParams.set('search', search);
    } else {
      url.searchParams.delete('search');
    }

    if (category) {
      url.searchParams.set('category', category);
    } else {
      url.searchParams.delete('category');
    }

    window.history.replaceState({}, '', url.toString());
  }
};

/**
 * Create a debounced URL update function to avoid excessive history entries
 * @param updateFn - The function to debounce
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 */
export const createDebouncedURLUpdater = (
  updateFn: (search: string, category: string | null) => void,
  delay: number = 300,
) => {
  let timeoutId: NodeJS.Timeout;

  return (search: string, category: string | null) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => updateFn(search, category), delay);
  };
};

/**
 * Clear all URL search parameters
 */
export const clearURLParams = (): void => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('search');
  url.searchParams.delete('category');
  window.history.replaceState({}, '', url.toString());
};

/**
 * Custom hook for managing URL search parameters with debounced updates
 */
export const useURLSearchParams = () => {
  const initialParams = React.useMemo(() => getInitialURLParams(), []);

  const updateURL = React.useCallback(updateURLParams, []);

  const debouncedUpdateURL = React.useMemo(
    () => createDebouncedURLUpdater(updateURL),
    [updateURL],
  );

  return {
    initialParams,
    updateURL,
    debouncedUpdateURL,
    clearURLParams,
  };
};
