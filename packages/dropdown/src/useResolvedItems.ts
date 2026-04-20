import React from 'react';

import { useDebounce } from '@entur/utils';

import { useNormalizedItems } from './useNormalizedItems';

import {
  AsyncDropdownItemType,
  DropdownItemType,
  NormalizedDropdownItemType,
  PotentiallyAsyncDropdownItemType,
} from './types';

export const useResolvedItems = <ValueType extends NonNullable<any>>(
  /** The list of items, or an async function that resolves the list of items */
  itemsOrItemsResolver: PotentiallyAsyncDropdownItemType<ValueType>,
  /** The time to wait after the input changes to the fetchItems method is called */
  debounceTimeout = 250,
): {
  fetchItems: (query?: string) => void;
  loading: boolean;
  items: NormalizedDropdownItemType<ValueType>[];
} => {
  const itemsIsAFunction = typeof itemsOrItemsResolver === 'function';

  // Only maintain state for function-based items - static items are used directly
  const [resolvedItems, setResolvedItems] = React.useState<
    DropdownItemType<ValueType>[]
  >([]);
  const [loading, setLoading] = React.useState(false);

  const abortControllerRef = React.useRef<AbortController>(
    new AbortController(),
  );

  // Only create resolver for function-based items
  const itemsResolver = React.useMemo(() => {
    if (itemsIsAFunction) {
      return itemsOrItemsResolver as AsyncDropdownItemType<ValueType>;
    }
    return null;
  }, [itemsOrItemsResolver, itemsIsAFunction]);

  // This should be called whenever the input value changes (only for function-based items)
  const updateItems = async (inputValue?: string) => {
    if (!itemsResolver) return; // Only works with function-based items

    // The abortController handles cleanup of the previous request and unmounting
    if (abortControllerRef?.current) abortControllerRef?.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);

    try {
      const fetchedItems = await itemsResolver(
        inputValue ?? '',
        abortControllerRef,
      );

      if (abortControllerRef?.current?.signal?.aborted) {
        console.warn(
          'Avbryt den asynkrone funksjonen din med signalet fra AbortController-en for å for å unngå minnelekkasje.',
          'Funksjonen bør kaste en DOMException med navnet "AbortError" når den avbrytes.',
          '',
          '\n\nSe eksempel her: https://linje.entur.no/komponenter/skjemaelementer/dropdown#s%C3%B8kbar-dropdown-med-valg-fra-nettverkskall-bassert-p%C3%A5-tekstinput',
          '\nLes mer om AbortController her: https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
        );
        return;
      }

      setResolvedItems(fetchedItems);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'AbortError'
      ) {
        // Stop execution if the request was aborted
        return;
      }
      console.warn(
        'The following error was received but not handled inside Entur Designsystems useResolvedItems hook:',
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchItems = useDebounce(updateItems, debounceTimeout);

  // Use static items directly or resolved items from state
  const items = itemsIsAFunction
    ? resolvedItems
    : (itemsOrItemsResolver as DropdownItemType<ValueType>[]);
  const normalizedItems = useNormalizedItems(items);

  React.useEffect(() => {
    // send abort signal to previous request on unmount for cleanup
    return () => abortControllerRef?.current?.abort('Component unmounted');
  }, []);

  React.useEffect(() => {
    // Let's fetch the list initially if it's specified
    if (itemsIsAFunction) {
      debouncedFetchItems('');
    }
  }, [itemsIsAFunction, itemsResolver]);

  return {
    items: normalizedItems,
    loading: itemsIsAFunction ? loading : false,
    fetchItems: debouncedFetchItems,
  };
};
