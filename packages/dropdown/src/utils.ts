import { A11yRemovalMessage, A11yStatusMessageOptions } from 'downshift';
import { NormalizedDropdownItemType } from './types';
import React from 'react';

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
    setLastRemovedItem,
  }: {
    clickedItem: NormalizedDropdownItemType<any>;
    onChange: (value: NormalizedDropdownItemType<ValueType>[]) => void;
    setLastRemovedItem: any;
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
type getA11yStatusMessageType<Item> = A11yStatusMessageOptions<Item> & {
  selectAllItemIncluded?: boolean;
  ariaLabelNoResults?: string;
};

export function getA11yStatusMessage<Item>(
  options: getA11yStatusMessageType<Item>,
): string {
  const {
    isOpen,
    resultCount,
    previousResultCount,
    selectAllItemIncluded = false,
    ariaLabelNoResults = 'Ingen resultater',
  } = options;

  if (!isOpen) {
    return '';
  }

  const resultCountWithoutSelectAll = selectAllItemIncluded
    ? resultCount - 1
    : resultCount;

  if (resultCountWithoutSelectAll === 0) {
    return ariaLabelNoResults;
  }

  if (resultCount !== previousResultCount) {
    return `${resultCountWithoutSelectAll} resultat${
      resultCountWithoutSelectAll === 1 ? '' : 'er'
    } tilgjengelig, naviger med pil opp eller ned, velg elementer med enter.`;
  }

  return '';
}

type getA11ySelectionMessageType<Item> = A11yStatusMessageOptions<Item> & {
  selectAllItem?: NormalizedDropdownItemType<string>;
};

export function getA11ySelectionMessage(
  options: getA11ySelectionMessageType<NormalizedDropdownItemType<any>>,
) {
  const {
    selectedItem,
    itemToString: itemToStringLocal,
    selectAllItem,
  } = options;

  if (selectedItem?.value === selectAllItem?.value)
    return 'Alle elementer i listen valgt.';

  return selectedItem ? `${itemToStringLocal(selectedItem)} er valgt.` : '';
}

type getA11yRemovalMessageType<Item> = A11yRemovalMessage<Item> & {
  selectAllItem?: NormalizedDropdownItemType<string>;
  removedItem?: NormalizedDropdownItemType<any>;
};

export function getA11yRemovalMessage(
  options: getA11yRemovalMessageType<NormalizedDropdownItemType<any>>,
) {
  const { itemToString, selectAllItem, removedItem } = options;
  if (removedItem === undefined) return '';
  if (removedItem.value === selectAllItem?.value)
    return 'Alle elementer i listen fjernet fra valgte.';

  return `${itemToString(removedItem)} fjernet fra valgte.`;
}

/**A VoiceOver click is always preformed in the center of the clicked element.
   This functions expolits that to check if the performed click likely is 
   made by VoiceOver. */
export const isVoiceOverClick = (clickEvent: React.MouseEvent) => {
  const targetElementRect = clickEvent.currentTarget.getBoundingClientRect();
  const targetElementMiddleX = Math.floor(
    targetElementRect.x + targetElementRect.width / 2,
  );
  const targetElementMiddleY = Math.floor(
    targetElementRect.y + targetElementRect.height / 2,
  );

  const clickPositionX = clickEvent.clientX;
  const clickPositionY = clickEvent.clientY;

  return (
    Math.abs(targetElementMiddleX - clickPositionX) <= 1 &&
    Math.abs(targetElementMiddleY - clickPositionY) <= 1
  );
};
/* end a11y utils */
