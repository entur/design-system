import React from 'react';
import classNames from 'classnames';
import {
  UseComboboxGetToggleButtonPropsOptions,
  UseMultipleSelectionGetSelectedItemPropsOptions,
} from 'downshift';

import { IconButton } from '@entur/button';
import { TagChip } from '@entur/chip';
import { CloseSmallIcon, DownArrowIcon } from '@entur/icons';
import { LoadingDots } from '@entur/loader';
import { Tooltip } from '@entur/tooltip';

import { DropdownLoadingDots } from '../../DropdownLoadingDots';
import { NormalizedDropdownItemType } from '../useNormalizedItems';

import './FieldComponents.scss';

export const SelectedItemTag = ({
  ariaLabelRemoveSelected,
  disabled,
  getSelectedItemProps,
  index,
  readOnly,
  removeSelectedItem,
  selectedItem,
}: {
  ariaLabelRemoveSelected: string;
  disabled?: boolean;
  getSelectedItemProps?: (
    options: UseMultipleSelectionGetSelectedItemPropsOptions<NormalizedDropdownItemType>,
  ) => any;
  index?: number;
  readOnly?: boolean;
  removeSelectedItem: (item: NormalizedDropdownItemType) => void;
  selectedItem: NormalizedDropdownItemType;
}) => {
  const { tabIndex: _, ...selectedItemProps } =
    getSelectedItemProps?.({
      selectedItem,
      index,
    }) ?? {};
  return (
    <TagChip
      className={classNames('eds-dropdown__selected-item-tag', {
        'eds-dropdown__selected-item-tag--readonly': readOnly,
        'eds-dropdown__selected-item-tag--disabled': disabled,
      })}
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
  clearable?: boolean;
  clearSelectedItemsLabel?: string;
  disabled?: boolean;
  focusable?: boolean;
  getToggleButtonProps: (
    options?: UseComboboxGetToggleButtonPropsOptions | undefined,
  ) => any;
  isOpen: boolean;
  loading?: boolean;
  loadingText?: string;
  onClear: () => void;
  selectedItems: (NormalizedDropdownItemType | null)[];
}> = ({
  clearable = false,
  clearSelectedItemsLabel,
  disabled = false,
  focusable = false,
  getToggleButtonProps,
  isOpen,
  loading = false,
  loadingText = 'Laster resultater …',
  onClear,
  selectedItems,
}) => {
  if (loading) {
    return (
      <div className={'eds-dropdown-appendix__toggle-button--loading-dots'}>
        <LoadingDots aria-label={loadingText} />
      </div>
    );
  }
  if (disabled) {
    return null;
  }
  return (
    // to have a natural tab order, these elements are ordered opposite of how they are displayed
    <div className="eds-dropdown-appendix">
      <ToggleButton
        getToggleButtonProps={getToggleButtonProps}
        isOpen={isOpen}
        focusable={focusable}
      />
      {clearable && selectedItems?.length > 0 && selectedItems[0] !== null && (
        <>
          <div className="eds-dropdown-appendix__divider" />
          <ClearableButton
            onClear={onClear}
            focusable={true}
            clearSelectedItemsLabel={clearSelectedItemsLabel}
          />
        </>
      )}
    </div>
  );
};

const ClearableButton = ({
  onClear,
  clearSelectedItemsLabel = 'Fjern valgte',
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
        aria-label={clearSelectedItemsLabel}
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
      tabIndex={focusable ? 0 : -1}
      type="button"
    >
      <DownArrowIcon aria-hidden="true" />
    </IconButton>
  );
};

export type DropdownLoadingDots = {
  /** Ekstra klassenavn */
  className?: string;
  /** Tekst for skjermlesere */
  children: string;
  [key: string]: any;
};
