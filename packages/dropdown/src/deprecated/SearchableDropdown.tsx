import React, { useRef, useState } from 'react';
import { mergeRefs } from '@entur/utils';
import { BaseDropdownDeprecated } from './BaseDropdown';
import { useDownshift } from './DownshiftProvider';
import { NormalizedDropdownItemDeprecatedType } from './types';
import './SearchableDropdown.scss';

type SearchableDropdownDeprecatedProps = {
  className?: string;
  disabled?: boolean;
  items: NormalizedDropdownItemDeprecatedType[];
  loading?: boolean;
  loadingText?: string;
  placeholder?: string;
  prepend?: React.ReactNode;
  readOnly?: boolean;
  selectOnTab?: boolean;
  openOnFocus?: boolean;
  listStyle?: { [key: string]: any };
  clearable: boolean;
  itemFilter?: (item: NormalizedDropdownItemDeprecatedType) => boolean;
  disableLabelAnimation?: boolean;
  [key: string]: any;
};

function LowerCaseFilterTest(
  item: NormalizedDropdownItemDeprecatedType,
  input: string | null,
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

/**
 * @deprecated
 * New SearchableDropdown available
 *
 * migration guide to new dropdown:
 * - change import from 'DropdownDeprecated' to 'Dropdown'
 * - change from 'value' to 'selectedItem'
 *  + type of 'selectedItem' is 'NormalizedDropdownType' and does not include 'string'
 * - 'onChange' must update value of 'selectedItem'
 */
export const SearchableDropdownDeprecated: React.FC<SearchableDropdownDeprecatedProps> =
  React.forwardRef<HTMLInputElement, SearchableDropdownDeprecatedProps>(
    (
      {
        disabled = false,
        className,
        items,
        loading,
        loadingText,
        readOnly = false,
        prepend,
        selectOnTab = false,
        openOnFocus = false,
        listStyle,
        clearable,
        itemFilter = (
          item: NormalizedDropdownItemDeprecatedType,
          inputValue: string | null,
        ) => LowerCaseFilterTest(item, inputValue),
        label,
        disableLabelAnimation,
        placeholder,
        ...rest
      },
      ref,
    ) => {
      const {
        getInputProps,
        inputValue,
        selectHighlightedItem,
        isOpen,
        openMenu,
        closeMenu,
        selectedItem,
      } = useDownshift();

      const [hideSelectedItem, setHideSelectedItem] = useState(false);
      const inputRef = useRef<HTMLInputElement>(null);

      const filteredItems = React.useMemo(() => {
        return items.filter(item => itemFilter(item, inputValue));
      }, [inputValue, items, itemFilter]);

      return (
        <BaseDropdownDeprecated
          items={filteredItems}
          disabled={disabled}
          readOnly={readOnly}
          className={className}
          loading={loading}
          loadingText={loadingText}
          prepend={prepend}
          listStyle={listStyle}
          clearable={clearable}
          label={label}
          isFilled={selectedItem ? true : false}
          disableLabelAnimation={disableLabelAnimation}
        >
          {!hideSelectedItem && selectedItem && !inputValue && (
            <span className="eds-dropdown__searchable-selected-item__wrapper">
              <span
                className="eds-dropdown__searchable-selected-item"
                onClick={() => inputRef.current?.focus()}
              >
                {selectedItem.label}
              </span>
            </span>
          )}
          <input
            {...getInputProps({
              disabled,
              readOnly,
              className: 'eds-form-control eds-dropdown__input',
              onKeyDown: e => {
                if (selectOnTab && e.key === 'Tab') selectHighlightedItem();
              },
              onFocus: () => {
                if (!isOpen && openOnFocus) openMenu();
                setHideSelectedItem(true);
              },
              placeholder: selectedItem ? selectedItem.label : placeholder,
              ...rest,
            })}
            onBlur={() => {
              setHideSelectedItem(false);
              closeMenu();
            }}
            ref={mergeRefs<HTMLInputElement>(ref, inputRef)}
          />
        </BaseDropdownDeprecated>
      );
    },
  );
