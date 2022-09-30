import React, { useRef, useState } from 'react';
import { useCombobox, UseComboboxGetToggleButtonPropsOptions } from 'downshift';
import classNames from 'classnames';

import { CheckIcon, CloseSmallIcon, DownArrowIcon } from '@entur/icons';
import { BaseFormControl, VariantType } from '@entur/form';

import { NormalizedDropdownItemType } from '../useNormalizedItems';

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
  /** Tilgjengelige valg i dropdown-en */
  items: NormalizedDropdownItemType[];
  /** Valgt element. Bruk null for ingen verdi. */
  selectedItem: NormalizedDropdownItemType | null;
  /** Callback for når brukeren endrer valg */
  onChange: (value: NormalizedDropdownItemType | null) => void;
  /** Beskrivende tekst som forklarer feltet */
  label: string;
  /** Placeholder-tekst når ingenting er satt */
  placeholder?: string;
  /** Vis knapp for å nullstille Dropdown-en skal vises
   * @default false
   */
  clearable?: boolean;
  /** Vis listen med valg skal vises på fokus av inputfeltet
   * @default false
   */
  openOnFocus?: boolean;
  /**  Gjør dropdown-en til å kun kunne leses */
  readonly?: boolean;
  feedback?: string;
  variant?: VariantType;
  className?: string;
  style?: { [key: string]: any };
  listStyle?: { [key: string]: any };
  [key: string]: any;
};

// TODO Husk å @deprecate searchable-prop-en til Dropdown når denne komponenten skal ha official release
export const SearchableDropdownBeta = ({
  items,
  selectedItem: value,
  onChange,
  label,
  placeholder,
  clearable = false,
  openOnFocus = false,
  readonly = false,
  feedback,
  variant = 'info',
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
          // reset input value to show placeholder on focus
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
      onChange(newSelectedItem ?? null),
    ...rest,
  });

  // TODO Husk å generelt legge inn støtte for typeof value === string

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
            readOnly={readonly}
            onChange={onChange}
            getToggleButtonProps={getToggleButtonProps}
          />
        }
        className={classNames('eds-searchable-dropdown', className)}
        label={label}
        isFilled={selectedItem ? true : false}
        feedback={feedback}
        variant={variant}
        readOnly={readonly}
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
                    selectedItem?.value === item.value,
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
                {selectedItem?.value === item.value && <CheckIcon />}
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
  onChange: (value: NormalizedDropdownItemType | null) => void;
  getToggleButtonProps: (
    options?: UseComboboxGetToggleButtonPropsOptions | undefined,
  ) => any;
}> = ({
  clearable,
  readOnly,
  getToggleButtonProps,
  selectedItem,
  isOpen,
  onChange,
}) => {
  // TODO implement loading / async
  // if (loading) {
  //   return <DropdownLoadingDots>{loadingText}</DropdownLoadingDots>;
  // }
  if (readOnly) {
    return null;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {clearable && selectedItem && (
        <>
          <button
            className="eds-searchable-dropdown-appendix__clear-button"
            type="button"
            tabIndex={-1}
            onClick={() => onChange(null)}
          >
            <CloseSmallIcon />
          </button>
          <div className="eds-searchable-dropdown-appendix__divider" />
        </>
      )}
      <button
        {...getToggleButtonProps({
          className: classNames(
            'eds-searchable-dropdown-appendix__toggle-button',
            {
              'eds-searchable-dropdown-appendix__toggle-button--open': isOpen,
            },
          ),
        })}
        tabIndex="-1"
        type="button"
      >
        <DownArrowIcon />
      </button>
    </div>
  );
};
