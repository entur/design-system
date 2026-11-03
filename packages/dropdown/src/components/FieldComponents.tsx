import React, { forwardRef } from 'react';
import classNames from 'classnames';
import {
  UseComboboxGetToggleButtonPropsReturnValue,
  UseMultipleSelectionGetSelectedItemPropsOptions,
} from 'downshift';

import { IconButton } from '@entur/button';
import { TagChip } from '@entur/chip';
import { CloseSmallIcon, DownArrowIcon } from '@entur/icons';
import { LoadingDots } from '@entur/loader';
import { Tooltip } from '@entur/tooltip';

import { NormalizedDropdownItemType } from '../types';

import './FieldComponents.scss';

export const SelectedItemTag = <ValueType extends NonNullable<any>>({
  ariaLabelRemoveSelected,
  ariaLabelChosen = 'valgt',
  closeButtonRef,
  disabled,
  getSelectedItemProps,
  index,
  onKeyDown,
  readOnly,
  removeSelectedItem,
  selectedItem,
}: {
  ariaLabelRemoveSelected: string;
  ariaLabelChosen?: string;
  closeButtonRef?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
  getSelectedItemProps?: (
    options: UseMultipleSelectionGetSelectedItemPropsOptions<
      NormalizedDropdownItemType<ValueType>
    >,
  ) => any;
  index?: number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  readOnly?: boolean;
  removeSelectedItem: (item: NormalizedDropdownItemType<ValueType>) => void;
  selectedItem: NormalizedDropdownItemType<ValueType>;
}) => {
  if (!selectedItem) return null;

  // An onClick on the chip makes Safari's VoiceOver stop on it as a
  // clickable element, out of step with keyboard focus on the close button
  const {
    tabIndex: _tabIndex,
    onClick: _onClick,
    ...selectedItemProps
  } = getSelectedItemProps?.({
    selectedItem,
    index,
  }) ?? {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // WebKit can treat Backspace as "go back" when the key isn't consumed
    if (e.key === 'Backspace' || e.key === 'Delete') e.preventDefault();
    selectedItemProps.onKeyDown?.(e);
    onKeyDown?.(e);
  };

  return (
    <TagChip
      size="small"
      className={classNames('eds-dropdown__selected-item-tag', {
        'eds-dropdown__selected-item-tag--readonly': readOnly,
        'eds-dropdown__selected-item-tag--disabled': disabled,
      })}
      ref={closeButtonRef}
      {...selectedItemProps}
      onKeyDown={handleKeyDown}
      onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        removeSelectedItem(selectedItem);
      }}
      closeButtonAriaLabel={`${selectedItem.label} ${ariaLabelChosen}, ${ariaLabelRemoveSelected} `}
      closeButtonTabIndex={-1}
    >
      <span
        aria-hidden={disabled || readOnly ? undefined : true}
        className="eds-dropdown__selected-item-tag__text"
      >
        {selectedItem.label}
      </span>
    </TagChip>
  );
};

type FieldAppendProps = Partial<UseComboboxGetToggleButtonPropsReturnValue> & {
  ariaLabelCloseList: string;
  ariaLabelOpenList: string;
  clearable?: boolean;
  labelClearSelected: string;
  disabled?: boolean;
  focusable?: boolean;
  isOpen: boolean;
  loading: boolean;
  loadingText: string | undefined;
  onClear: () => void;
  itemIsSelected: boolean;
};

export const DropdownFieldAppendix = forwardRef(
  (
    {
      ariaLabelCloseList,
      ariaLabelOpenList,
      clearable = false,
      labelClearSelected,
      focusable = false,
      disabled,
      isOpen,
      loading = false,
      loadingText,
      onClear,
      itemIsSelected,
      ...rest
    }: FieldAppendProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) => {
    function getToggleAriaLabel() {
      if (loading) return loadingText;
      if (isOpen) return ariaLabelCloseList;
      return ariaLabelOpenList;
    }

    return (
      <>
        {!disabled && (
          <div className="eds-dropdown__appendix">
            {clearable && itemIsSelected && (
              <ClearableButton
                onClear={onClear}
                focusable={true}
                labelClearSelectedItems={labelClearSelected}
              />
            )}

            <IconButton
              className={classNames('eds-dropdown__appendix__toggle-button', {
                'eds-dropdown__appendix__toggle-button--open': isOpen,
                'eds-dropdown__appendix__toggle-button--loading': loading,
              })}
              ref={ref}
              aria-label={getToggleAriaLabel()}
              {...rest}
              type="button"
              tabIndex={focusable ? 0 : -1}
            >
              {!loading ? (
                <DownArrowIcon aria-hidden="true" />
              ) : (
                <LoadingDots aria-hidden="true" />
              )}
            </IconButton>
          </div>
        )}
      </>
    );
  },
);

export const ClearableButton = ({
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
    <>
      <Tooltip
        aria-hidden="true"
        placement="top"
        content={labelClearSelectedItems}
        className="eds-dropdown__appendix__clear-button__tooltip"
      >
        <IconButton
          className="eds-dropdown__appendix__clear-button"
          type="button"
          tabIndex={focusable ? 0 : -1}
          // These events bubble up to the Dropdown container and trigger openMenu.
          // To avoid this, stopPropagation and preventDefault are added.
          onClick={e => {
            e.stopPropagation();
            onClear();
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            }
          }}
          aria-label={labelClearSelectedItems}
        >
          <CloseSmallIcon aria-hidden="true" />
        </IconButton>
      </Tooltip>
      <div className="eds-dropdown__appendix__divider" />
    </>
  );
};
