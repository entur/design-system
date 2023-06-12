import { NormalizedDropdownItemType } from '../useNormalizedItems';

export function lowerCaseFilterTest(
  item: NormalizedDropdownItemType,
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

export const itemToString = (item: NormalizedDropdownItemType | null) =>
  item ? item.label : '';

type useMultiselectUtilsType = {
  selectedItems: NormalizedDropdownItemType[];
  listItems: NormalizedDropdownItemType[];
  selectAllValue: string;
};

export const useMultiselectUtils = ({
  listItems,
  selectedItems,
  selectAllValue,
}: useMultiselectUtilsType) => {
  const hasSelectedItems = selectedItems.length > 0;

  const listItemsWithoutSelectAll = listItems.filter(
    item => item.value !== selectAllValue,
  );

  const allListItemsAreSelected =
    listItemsWithoutSelectAll.filter(item => !selectedItems.includes(item))
      .length === 0;

  const someListItemsAreSelected = listItemsWithoutSelectAll.some(item =>
    selectedItems.includes(item),
  );

  const addClickedItemToSelectedItems = (
    clickedItem: NormalizedDropdownItemType,
    onChange: (value: NormalizedDropdownItemType[]) => void,
  ) => onChange([...selectedItems, clickedItem]);

  const clickedItemIsInSelectedItems = (
    clickedItem: NormalizedDropdownItemType,
  ) =>
    selectedItems.some(
      selectedItem => selectedItem.value === clickedItem.value,
    );

  const clickedItemIsSelectAll = (clickedItem: NormalizedDropdownItemType) =>
    clickedItem.value === selectAllValue;

  const removeClickedItemFromSelectedItems = (
    clickedItem: NormalizedDropdownItemType,
    onChange: (value: NormalizedDropdownItemType[]) => void,
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
    onChange: (value: NormalizedDropdownItemType[]) => void,
  ) => {
    onChange([
      ...selectedItems,
      ...listItemsWithoutSelectAll.filter(
        item => !selectedItems.includes(item),
      ),
    ]);
  };

  const unselectAllListItems = (
    onChange: (value: NormalizedDropdownItemType[]) => void,
  ) => {
    onChange(
      selectedItems.filter(item => !listItemsWithoutSelectAll.includes(item)),
    );
  };

  return {
    addClickedItemToSelectedItems,
    allListItemsAreSelected,
    clickedItemIsInSelectedItems,
    clickedItemIsSelectAll,
    hasSelectedItems,
    listItemsWithoutSelectAll,
    removeClickedItemFromSelectedItems,
    selectAllCheckboxState,
    selectAllUnselectedItemsInListItems,
    someListItemsAreSelected,
    unselectAllListItems,
  };
};
