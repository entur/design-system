import { IconButton } from '@entur/button';
import { TagChip } from '@entur/chip';
import { CloseSmallIcon, DownArrowIcon } from '@entur/icons';
import { Tooltip } from '@entur/tooltip';
import classNames from 'classnames';
import {
  UseComboboxGetToggleButtonPropsOptions,
  UseMultipleSelectionGetSelectedItemPropsOptions,
} from 'downshift';
import { DropdownLoadingDots } from '../../DropdownLoadingDots';
import { NormalizedDropdownItemType } from '../../useNormalizedItems';
import React from 'react';

import './FieldComponents.scss';

export const SelectedElementsTag = ({
  getSelectedItemProps,
  removeSelectedItem,
  selectedItem,
  index,
  ariaLabelRemoveSelected,
}: {
  getSelectedItemProps: (
    options: UseMultipleSelectionGetSelectedItemPropsOptions<NormalizedDropdownItemType>,
  ) => any;
  removeSelectedItem: (item: NormalizedDropdownItemType) => void;
  selectedItem: NormalizedDropdownItemType;
  index: number;
  ariaLabelRemoveSelected: string;
}) => {
  const { tabIndex: _, ...selectedItemProps } = getSelectedItemProps({
    selectedItem,
    index,
  });
  return (
    <TagChip
      className={classNames('eds-dropdown__selected-element-tag')}
      {...selectedItemProps}
      onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        removeSelectedItem(selectedItem);
      }}
      closeButtonAriaLabel={`${selectedItem.label}, ${ariaLabelRemoveSelected} `}
      key={selectedItem.value}
    >
      <span aria-hidden="true">{selectedItem.label}</span>
    </TagChip>
  );
};

export const FieldAppend: React.FC<{
  selectedItems: (NormalizedDropdownItemType | null)[];
  isOpen: boolean;
  clearable: boolean;
  loading?: boolean;
  loadingText?: string;
  ariaLabelClearItems?: string;
  clearSelectedItemsLabel?: string;
  readOnly: boolean;
  focusable?: boolean;
  onClear: () => void;
  getToggleButtonProps: (
    options?: UseComboboxGetToggleButtonPropsOptions | undefined,
  ) => any;
}> = ({
  clearable,
  readOnly,
  getToggleButtonProps,
  selectedItems,
  loading = false,
  loadingText = 'Laster resultater …',
  ariaLabelClearItems,
  clearSelectedItemsLabel,
  isOpen,
  onClear,
  focusable = false,
}) => {
  if (loading) {
    return <DropdownLoadingDots>{loadingText}</DropdownLoadingDots>;
  }
  if (readOnly) {
    return null;
  }
  return (
    <div className="eds-dropdown-appendix">
      {clearable && selectedItems?.length > 0 && selectedItems[0] !== null && (
        <>
          <ClearableButton
            onClear={onClear}
            focusable={focusable}
            clearSelectedItemsLabel={clearSelectedItemsLabel}
            ariaLabelClearItems={ariaLabelClearItems}
          />
          <div className="eds-dropdown-appendix__divider" />
        </>
      )}
      <ToggleButton
        getToggleButtonProps={getToggleButtonProps}
        isOpen={isOpen}
        focusable={focusable}
      />
    </div>
  );
};

const ClearableButton = ({
  onClear,
  clearSelectedItemsLabel = 'Fjern valgte',
  ariaLabelClearItems = 'Fjern valgte',
  focusable = false,
}: {
  onClear: () => void;
  clearSelectedItemsLabel?: string;
  focusable?: boolean;
  ariaLabelClearItems?: string;
}) => {
  return (
    <Tooltip
      aria-hidden="true"
      placement="right"
      content={clearSelectedItemsLabel}
    >
      <IconButton
        className="eds-dropdown-appendix__clear-button"
        type="button"
        tabIndex={focusable ? 0 : 1}
        onClick={onClear}
        aria-label={ariaLabelClearItems}
      >
        <CloseSmallIcon aria-hidden="true" />
      </IconButton>
    </Tooltip>
  );
};

const ToggleButton = ({
  getToggleButtonProps,
  isOpen,
  closeAriaLabel = 'Lukk liste med valg',
  openAriaLabel = 'Åpne liste med valg',
  focusable = false,
}: {
  getToggleButtonProps: (
    options?: UseComboboxGetToggleButtonPropsOptions | undefined,
  ) => any;
  isOpen: boolean;
  closeAriaLabel?: string;
  openAriaLabel?: string;
  focusable?: boolean;
}) => {
  return (
    <IconButton
      {...getToggleButtonProps({
        className: classNames('eds-dropdown-appendix__toggle-button', {
          'eds-dropdown-appendix__toggle-button--open': isOpen,
        }),
      })}
      aria-label={isOpen ? closeAriaLabel : openAriaLabel}
      tabIndex={focusable ? 0 : 1}
      type="button"
    >
      <DownArrowIcon aria-hidden="true" />
    </IconButton>
  );
};
