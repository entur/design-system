import { UseComboboxState } from 'downshift';
import { NormalizedDropdownItemType } from './types';

/* start general utils */
export const EMPTY_INPUT = '';

export function lowerCaseFilterTest(
  item: NormalizedDropdownItemType<any>,
  input: string | undefined,
) {
  if (!input) {
    return true;
  }
  const sanitizeEscapeCharacters = input.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    '\\$&',
  );
  const inputRegex = new RegExp(sanitizeEscapeCharacters, 'i');
  return inputRegex.test(item.label);
}

export function noFilter<ValueType>(
  //@ts-expect-error only here to comply with dropdown filter API
  item: NormalizedDropdownItemType<ValueType>,
  //@ts-expect-error only here to comply with dropdown filter API
  input: string | undefined,
) {
  return true;
}

export const itemToString = (item: NormalizedDropdownItemType<any> | null) =>
  item ? item.label : '';

export const itemToKey = (item: NormalizedDropdownItemType<any> | null) =>
  item?.label + item?.value;

export const isFunctionWithQueryArgument = (object: any) =>
  typeof object === 'function' && object.length > 0;

/* end general utils */
/* start multiselect utils */

type useMultiselectUtilsType<ValueType> = {
  selectedItems: NormalizedDropdownItemType<ValueType>[];
  listItems: NormalizedDropdownItemType<ValueType | string>[];
  selectAll: NormalizedDropdownItemType<string>;
};

export const useMultiselectUtils = <ValueType>({
  listItems,
  selectedItems,
  selectAll,
}: useMultiselectUtilsType<ValueType>) => {
  const hasSelectedItems = selectedItems.length > 0;

  const listItemsWithoutSelectAll = listItems.filter(
    item => item.value !== selectAll.value,
  ) as NormalizedDropdownItemType<ValueType>[];

  const unselectedItemsInListItems = listItemsWithoutSelectAll.filter(
    listItem =>
      !selectedItems.some(
        selectedItem => selectedItem.value === listItem.value,
      ),
  );

  const allListItemsAreSelected = !listItemsWithoutSelectAll.some(
    listItem =>
      !selectedItems.some(
        selectedItem => selectedItem.value === listItem.value,
      ),
  );

  const someListItemsAreSelected = listItemsWithoutSelectAll.some(listItem =>
    selectedItems.some(selectedItem => selectedItem.value === listItem.value),
  );

  const addClickedItemToSelectedItems = (
    clickedItem: NormalizedDropdownItemType<ValueType>,
    onChange: (value: NormalizedDropdownItemType<ValueType>[]) => void,
  ) => onChange([...selectedItems, clickedItem]);

  const clickedItemIsInSelectedItems = (
    clickedItem: NormalizedDropdownItemType<ValueType>,
  ) =>
    selectedItems.some(
      selectedItem => selectedItem.value === clickedItem.value,
    );

  const clickedItemIsSelectAll = (
    clickedItem: NormalizedDropdownItemType<string | ValueType>,
  ) => clickedItem.value === selectAll.value;

  const handleListItemClicked = ({
    clickedItem,
    onChange,
    setLastClickedItem: setLastRemovedItem,
  }: {
    clickedItem: NormalizedDropdownItemType<any>;
    onChange: (value: NormalizedDropdownItemType<ValueType>[]) => void;
    setLastClickedItem: any;
  }) => {
    if (clickedItemIsSelectAll(clickedItem)) {
      if (allListItemsAreSelected) {
        setLastRemovedItem(selectAll);
        return unselectAllListItems(onChange);
      }
      return selectAllUnselectedItemsInListItems(onChange);
    }

    if (clickedItemIsInSelectedItems(clickedItem)) {
      setLastRemovedItem(clickedItem);
      return removeClickedItemFromSelectedItems(clickedItem, onChange);
    }
    addClickedItemToSelectedItems(clickedItem, onChange);
  };

  const removeClickedItemFromSelectedItems = (
    clickedItem: NormalizedDropdownItemType<ValueType>,
    onChange: (value: NormalizedDropdownItemType<ValueType>[]) => void,
  ) =>
    onChange(
      selectedItems.filter(
        selectedItem => selectedItem.value !== clickedItem.value,
      ),
    );

  const selectAllCheckboxState = () => {
    if (allListItemsAreSelected) return true;
    if (someListItemsAreSelected) return 'indeterminate';
    return false;
  };

  const selectAllUnselectedItemsInListItems = (
    onChange: (value: NormalizedDropdownItemType<ValueType>[]) => void,
  ) => {
    onChange([...selectedItems, ...unselectedItemsInListItems]);
  };

  const unselectAllListItems = (
    onChange: (value: NormalizedDropdownItemType<ValueType>[]) => void,
  ) => {
    const selectedItemsWithoutItemsInListItems = selectedItems.filter(
      selectedItem =>
        !listItemsWithoutSelectAll.some(
          listItem => listItem.value === selectedItem.value,
        ),
    );
    onChange(selectedItemsWithoutItemsInListItems);
  };

  return {
    addClickedItemToSelectedItems,
    allListItemsAreSelected,
    clickedItemIsInSelectedItems,
    clickedItemIsSelectAll,
    handleListItemClicked,
    hasSelectedItems,
    listItemsWithoutSelectAll,
    removeClickedItemFromSelectedItems,
    selectAllCheckboxState,
    selectAllUnselectedItemsInListItems,
    someListItemsAreSelected,
    unselectAllListItems,
  };
};

/* end multiselect utils */
/* start a11y utils */

// called when the state changes:
// selectedItem, highlightedIndex, inputValue or isOpen.
export function getA11yStatusMessage<ValueType>(
  options: UseComboboxState<NormalizedDropdownItemType<ValueType>> & {
    selectAllItemIncluded?: boolean;
    resultCount: number;
  },
): string {
  const { isOpen, selectAllItemIncluded = false, resultCount } = options;

  if (!isOpen) {
    return '';
  }

  const resultCountWithoutSelectAll = selectAllItemIncluded
    ? resultCount - 1
    : resultCount;

  if (resultCountWithoutSelectAll === 0) {
    return 'Ingen resultater';
  }

  return `${resultCountWithoutSelectAll} resultat${
    resultCountWithoutSelectAll === 1 ? '' : 'er'
  } tilgjengelig, naviger med pil opp eller ned, velg elementer med Enter.`;
}
/* end a11y utils */
