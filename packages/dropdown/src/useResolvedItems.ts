import React from 'react';
import { DropdownItemType, useNormalizedItems } from './useNormalizedItems';
import debounce from './debounce';

const useIsMounted = () => {
  const isMountedRef = React.useRef(true);
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  return isMountedRef.current;
};

type AsyncDropdownItemType = (inputType: string) => Promise<DropdownItemType[]>;
type SyncDropdownItemType = (inputType: string) => DropdownItemType[];
export type PotentiallyAsyncDropdownItemType =
  | DropdownItemType[]
  | SyncDropdownItemType
  | AsyncDropdownItemType;

type ResolverState = {
  items: DropdownItemType[];
  loading: boolean;
};

type ResolverAction =
  | {
      type: 'request results';
    }
  | {
      type: 'received results';
      payload: DropdownItemType[];
    };

const reducer = (_state: ResolverState, action: ResolverAction) => {
  switch (action.type) {
    case 'request results':
      return { items: [], loading: true };
    case 'received results':
      return { items: action.payload, loading: false };
  }
};

export const useResolvedItems = (
  /** The list of items, or an async function that resolves the list of items */
  itemsOrItemsResolver: PotentiallyAsyncDropdownItemType,
  /** If true, the items resolver function will be called initially */
  fetchInitially?: boolean,
  /** The time to wait after the input changes to the fetchItems method is called */
  debounceTimeout: number = 250,
) => {
  const isItemsFunction = typeof itemsOrItemsResolver === 'function';

  // Here, we normalize the itemsResolver argument to an async function, so we
  // can use it without thinking about the differences later
  const itemsResolver = React.useMemo(
    () =>
      isItemsFunction
        ? (itemsOrItemsResolver as AsyncDropdownItemType)
        : () => Promise.resolve(itemsOrItemsResolver as DropdownItemType[]),
    [itemsOrItemsResolver, isItemsFunction],
  );

  const [{ items, loading }, dispatch] = React.useReducer(reducer, {
    items: isItemsFunction ? [] : (itemsOrItemsResolver as DropdownItemType[]),
    loading: false,
  });

  // This is a way to check whether or not the dropdown is still in the
  // document. We use it below to make sure we're not updating the state of
  // an unmounted component.
  const isMounted = useIsMounted();

  // Next, let's create the fetching function. This should be called whenever
  // the input value changes
  const fetchItems = React.useCallback(
    async (inputValue: string) => {
      dispatch({ type: 'request results' });
      const resolvedItems = await itemsResolver(inputValue);
      if (isMounted) {
        dispatch({ type: 'received results', payload: resolvedItems });
      }
    },
    [itemsResolver],
  );

  const normalizedItems = useNormalizedItems(items);
  React.useEffect(() => {
    // Let's fetch the list initially if it's specified
    if (fetchInitially && isItemsFunction) {
      fetchItems('');
    }
  }, [fetchInitially, isItemsFunction]);

  return {
    items: normalizedItems,
    loading: isItemsFunction ? loading : false,
    fetchItems: debounce(fetchItems, debounceTimeout),
  };
};
