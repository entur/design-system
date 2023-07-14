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

import { NormalizedDropdownItemType } from '../useNormalizedItems';

import './FieldComponents.scss';

export const SelectedItemTag = ({
  ariaLabelRemoveSelected,
  ariaLabelChosen = 'valgt',
  disabled,
  getSelectedItemProps,
  index,
  readOnly,
  removeSelectedItem,
  selectedItem,
}: {
  ariaLabelRemoveSelected: string;
  ariaLabelChosen?: string;
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
      closeButtonAriaLabel={`${selectedItem.label} ${ariaLabelChosen}, ${ariaLabelRemoveSelected} `}
      key={selectedItem.value}
      aria-live="polite"
    >
      <span aria-hidden="true">{selectedItem.label}</span>
    </TagChip>
  );
};

export const FieldAppend: React.FC<{
  ariaHiddenToggleButton?: boolean;
  ariaLabelCloseList?: string;
  ariaLabelOpenList?: string;
  clearable?: boolean;
  labelClearSelectedItems?: string;
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
  ariaHiddenToggleButton = false,
  ariaLabelCloseList,
  ariaLabelOpenList,
  clearable = false,
  labelClearSelectedItems,
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
    <div className="eds-dropdown-appendix">
      {clearable && selectedItems?.length > 0 && selectedItems[0] !== null && (
        <>
          <ClearableButton
            onClear={onClear}
            focusable={true}
            labelClearSelectedItems={labelClearSelectedItems}
          />
          <div className="eds-dropdown-appendix__divider" />
        </>
      )}
      <ToggleButton
        aria-hidden={ariaHiddenToggleButton}
        ariaLabelCloseList={ariaLabelCloseList}
        ariaLabelOpenList={ariaLabelOpenList}
        getToggleButtonProps={getToggleButtonProps}
        isOpen={isOpen}
        focusable={focusable}
      />
    </div>
  );
};

const ClearableButton = ({
  onClear,
  labelClearSelectedItems = 'Fjern valgte',
  focusable = false,
}: {
  onClear: () => void;
  labelClearSelectedItems?: string;
  focusable?: boolean;
  ariaLabelClearItems?: string;
}) => {
  return (
    <Tooltip
      aria-hidden="true"
      placement="right"
      content={labelClearSelectedItems}
    >
      <IconButton
        className="eds-dropdown-appendix__clear-button"
        type="button"
        tabIndex={focusable ? 0 : 1}
        onClick={onClear}
        aria-label={labelClearSelectedItems}
      >
        <CloseSmallIcon aria-hidden="true" />
      </IconButton>
    </Tooltip>
  );
};

const ToggleButton = ({
  getToggleButtonProps,
  isOpen,
  'aria-hidden': ariaHidden = false,
  ariaLabelCloseList = 'Lukk liste med valg',
  ariaLabelOpenList = 'Åpne liste med valg',
  focusable = false,
}: {
  getToggleButtonProps: (
    options?: UseComboboxGetToggleButtonPropsOptions | undefined,
  ) => any;
  isOpen: boolean;
  'aria-hidden'?: boolean;
  ariaLabelCloseList?: string;
  ariaLabelOpenList?: string;
  focusable?: boolean;
}) => {
  return (
    <IconButton
      {...getToggleButtonProps({
        className: classNames('eds-dropdown-appendix__toggle-button', {
          'eds-dropdown-appendix__toggle-button--open': isOpen,
        }),
        'aria-labelledby': undefined,
      })}
      aria-hidden={ariaHidden}
      aria-label={
        ariaHidden ? undefined : isOpen ? ariaLabelCloseList : ariaLabelOpenList
      }
      tabIndex={focusable ? 0 : -1}
      type="button"
    >
      <DownArrowIcon aria-hidden="true" />
    </IconButton>
  );
};
