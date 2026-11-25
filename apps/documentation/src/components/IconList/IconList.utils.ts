import React from 'react';

export interface URLParams {
  search: string;
  category: { label: string; value: string } | null;
  style: string | null;
}

/**
 * Parse URL search parameters to get initial filter values
 * Only runs once on mount for performance
 */
export const getInitialURLParams = (): URLParams => {
  if (typeof window === 'undefined') {
    return { search: '', category: null, style: null };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get('search') || '';
  const category = urlParams.get('category');

  return {
    search,
    category: category ? { label: category, value: category } : null,
    style: urlParams.get('style'),
  };
};

const setOrDelete = (url: URL, key: string, value: string | null) => {
  if (value) url.searchParams.set(key, value);
  else url.searchParams.delete(key);
};

/**
 * Update URL search parameters without page reload
 * Only updates if values have actually changed
 */
export const updateURLParams = (
  search: string,
  category: string | null,
  style: string | null = null,
): void => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  const before = url.toString();

  setOrDelete(url, 'search', search);
  setOrDelete(url, 'category', category);
  setOrDelete(url, 'style', style);

  if (url.toString() !== before) {
    window.history.replaceState({}, '', url.toString());
  }
};

/**
 * Create a debounced URL update function to avoid excessive history entries
 * @param updateFn - The function to debounce
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 */
export const createDebouncedURLUpdater = (
  updateFn: typeof updateURLParams,
  delay: number = 300,
) => {
  let timeoutId: NodeJS.Timeout;

  return (search: string, category: string | null, style?: string | null) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => updateFn(search, category, style), delay);
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
  url.searchParams.delete('style');
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
