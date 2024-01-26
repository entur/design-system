import React from 'react';
import { useDebounce } from '@entur/utils';
import {
  DropdownItemType,
  NormalizedDropdownItemType,
  useNormalizedItems,
} from './useNormalizedItems';

type AsyncDropdownItemType = (
  inputType: string,
  abortControllerRef: React.MutableRefObject<AbortController>,
) => Promise<DropdownItemType[]>;
type SyncDropdownItemType = (
  inputType: string,
  abortControllerRef: React.MutableRefObject<AbortController>,
) => DropdownItemType[];
export type PotentiallyAsyncDropdownItemType =
  | DropdownItemType[]
  | SyncDropdownItemType
  | AsyncDropdownItemType;

export const useResolvedItems = (
  /** The list of items, or an async function that resolves the list of items */
  itemsOrItemsResolver: PotentiallyAsyncDropdownItemType,
  /** The time to wait after the input changes to the fetchItems method is called */
  debounceTimeout = 250,
): {
  fetchItems: (query?: string) => void;
  loading: boolean;
  items: NormalizedDropdownItemType[];
} => {
  const itemsIsAFunction = typeof itemsOrItemsResolver === 'function';

  const [items, setItems] = React.useState<DropdownItemType[]>(
    itemsIsAFunction ? [] : itemsOrItemsResolver,
  );
  const [loading, setLoading] = React.useState(false);

  const abortControllerRef = React.useRef<AbortController>(
    new AbortController(),
  );

  // We normalize the itemsResolver argument to an async function, so we
  // can use it without thinking about the differences later
  const itemsResolver = React.useMemo(() => {
    if (itemsIsAFunction) return itemsOrItemsResolver as AsyncDropdownItemType;
    return () => Promise.resolve(itemsOrItemsResolver as DropdownItemType[]);
  }, [itemsOrItemsResolver, itemsIsAFunction]);

  // This should be called whenever the input value changes
  const updateItems = async (inputValue?: string) => {
    // The abortController handles cleanup of the previous request and unmounting
    if (abortControllerRef?.current) abortControllerRef?.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);

    try {
      const resolvedItems = await itemsResolver(
        inputValue ?? '',
        abortControllerRef,
      );

      if (abortControllerRef?.current?.signal?.aborted) {
        console.warn(
          'Avbryt den asynkrone funksjonen din med signalet fra AbortController-en for å for å unngå minnelekkasje.',
          'Funksjonen bør kaste en DOMException med navnet "AbortError" når den avbrytes.',
          '',
          '\n\nSe eksempel her: https://design.entur.no/komponenter/skjemaelementer/dropdown#s%C3%B8kbar-dropdown-med-valg-fra-nettverkskall-bassert-p%C3%A5-tekstinput',
          '\nLes mer om AbortController her: https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
        );
        return;
      }

      setLoading(false);
      setItems(resolvedItems);
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
    }
  };

  const debouncedFetchItems = useDebounce(updateItems, debounceTimeout);
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
