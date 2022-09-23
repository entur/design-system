import React, { useEffect, useRef, useState } from 'react';
import { useCombobox, UseComboboxGetToggleButtonPropsOptions } from 'downshift';
import { NormalizedDropdownItemType } from '../useNormalizedItems';
import { CheckIcon, CloseSmallIcon, DownArrowIcon } from '@entur/icons';
import classNames from 'classnames';

import { BaseFormControl } from '@entur/form';
import { DropdownLoadingDots } from '../DropdownLoadingDots';

import './dropdown.scss';

function lowerCaseFilterTest(
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

export type SearchableDropdownProps = {
  items: NormalizedDropdownItemType[];
  selectedItem: NormalizedDropdownItemType | null;
  onChange: (value: NormalizedDropdownItemType | undefined | null) => void;
  label: string;
  placeholder?: string;
  clearable?: boolean;
  openOnFocus?: boolean;
  className?: string;
  style?: { [key: string]: any };
  listStyle?: { [key: string]: any };
};

// TODO Husk å @deprecate searchable-prop-en til Dropdown når denne komponenten skal ha official release
export const SearchableDropdownBeta = ({
  items,
  selectedItem: value,
  onChange,
  label = '!MANGLER LABEL!',
  placeholder,
  clearable = false,
  openOnFocus = false,
  className,
  listStyle,
  ...rest
}: SearchableDropdownProps) => {
  const [filteredItems, setFilteredItems] = React.useState(items);
  const [hideSelectedItem, setHideSelectedItem] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const stateReducer = React.useCallback((_, actionAndChanges) => {
    const { type, changes } = actionAndChanges;

    switch (type) {
      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
      case useCombobox.stateChangeTypes.InputBlur:
      case useCombobox.stateChangeTypes.ControlledPropUpdatedSelectedItem:
        return {
          ...changes,
          // reset input field to show placeholder on selection
          ...(changes.selectedItem && {
            inputValue: '',
          }),
        };
      default:
        return changes;
    }
  }, []);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    openMenu,
    inputValue,
    setInputValue,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setFilteredItems(
        items.filter(item => lowerCaseFilterTest(item, inputValue)),
      );
    },
    items: filteredItems,
    itemToString(item) {
      if (item) return item.value;
      return '';
    },
    stateReducer,

    selectedItem: value,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) =>
      onChange(newSelectedItem),
    ...rest,
  });

  // TODO Husk å generelt legge inn støtte for typeof value === string
  useEffect(() => {
    if (
      inputValue.toLowerCase() === value?.label.toLowerCase() ||
      inputValue.toLowerCase() === value?.value.toLowerCase()
    )
      setInputValue('');
  }, [value]);

  return (
    <div className="eds-searchable-dropdown__wrapper">
      <BaseFormControl
        append={
          <Appendix
            selectedItem={selectedItem}
            isOpen={isOpen}
            clearable={clearable}
            loading={false}
            loadingText={''}
            readOnly={false}
            onChange={onChange}
            getToggleButtonProps={getToggleButtonProps}
          />
        }
        className={classNames('eds-searchable-dropdown', className)}
        label={label}
        isFilled={selectedItem ? true : false}
        labelProps={getLabelProps()}
        {...getComboboxProps()}
        {...rest}
      >
        {!hideSelectedItem && selectedItem && !inputValue && (
          <span className="eds-searchable-dropdown__selected-item__wrapper">
            <span
              className="eds-searchable-dropdown__selected-item"
              onClick={() => inputRef.current?.focus()}
            >
              {selectedItem.label}
            </span>
          </span>
        )}
        <input
          placeholder={selectedItem?.label ?? placeholder}
          className="eds-searchable-dropdown__input eds-form-control"
          {...getInputProps({
            onFocus: () => {
              if (!isOpen && openOnFocus) openMenu();
              setHideSelectedItem(true);
            },
            onBlur: () => {
              setHideSelectedItem(false);
            },
            ref: inputRef,
          })}
        />
      </BaseFormControl>

      <ul
        className={classNames('eds-searchable-dropdown__list', {
          'eds-searchable-dropdown__list--open': isOpen,
        })}
        {...getMenuProps()}
        style={{ ...rest.style, ...listStyle }}
      >
        {isOpen
          ? filteredItems.map((item, index) => (
              // eslint-disable-next-line react/jsx-key
              <li
                className={classNames('eds-searchable-dropdown__list__item', {
                  'eds-searchable-dropdown__list__item--highlighted':
                    highlightedIndex === index,
                  'eds-searchable-dropdown__list__item--selected':
                    selectedItem === item,
                })}
                {...getItemProps({ key: `${index}${item.value}`, item, index })}
              >
                <span>{item.label}</span>
                {item.icons && (
                  <span>
                    {item.icons.map((Icon, index) => (
                      <Icon
                        key={index}
                        inline
                        className="eds-searchable-dropdown__list__item-icon"
                      />
                    ))}
                  </span>
                )}
                {selectedItem === item && <CheckIcon />}
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

const Appendix: React.FC<{
  selectedItem: NormalizedDropdownItemType | null;
  isOpen: boolean;
  clearable: boolean;
  loading: boolean;
  loadingText: string;
  readOnly: boolean;
  onChange: (value: NormalizedDropdownItemType | undefined | null) => void;
  getToggleButtonProps: (
    options?: UseComboboxGetToggleButtonPropsOptions | undefined,
  ) => any;
}> = ({
  clearable,
  loading,
  loadingText,
  readOnly,
  getToggleButtonProps,
  selectedItem,
  isOpen,
  onChange,
}) => {
  if (loading) {
    return <DropdownLoadingDots>{loadingText}</DropdownLoadingDots>;
  }
  if (readOnly) {
    return null;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {clearable && selectedItem && (
        <>
          <button
            className="eds-searchable-dropdown__clear-button"
            type="button"
            tabIndex={-1}
            onClick={() => onChange(null)}
          >
            <CloseSmallIcon />
          </button>
          <div className="eds-searchable-dropdown__divider" />
        </>
      )}
      <button
        {...getToggleButtonProps({
          className: classNames('eds-searchable-dropdown__toggle-button', {
            'eds-searchable-dropdown__toggle-button--open': isOpen,
          }),
        })}
        tabIndex="-1"
        type="button"
      >
        <DownArrowIcon />
      </button>
    </div>
  );
};
