import React, { useRef } from 'react';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { BaseDropdown } from './BaseDropdown';
import { useDownshift } from './DownshiftProvider';
import './SearchableDropdown.scss';

type SearchableDropdownProps = {
  className?: string;
  disabled?: boolean;
  items: NormalizedDropdownItemType[];
  loading?: boolean;
  loadingText?: string;
  placeholder?: string;
  prepend?: React.ReactNode;
  readOnly?: boolean;
  selectOnTab?: boolean;
  openOnFocus?: boolean;
  listStyle?: { [key: string]: any };
  clearable: boolean;
  itemFilter?: (item: NormalizedDropdownItemType) => boolean;
  disableLabelAnimation?: boolean;
  [key: string]: any;
};

function LowerCaseFilterTest(
  item: NormalizedDropdownItemType,
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

export const SearchableDropdown: React.FC<SearchableDropdownProps> =
  React.forwardRef<HTMLInputElement, SearchableDropdownProps>(
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
          item: NormalizedDropdownItemType,
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
        selectedItem,
      } = useDownshift();

      const inputRef = useRef<HTMLInputElement>(null);

      const filteredItems = React.useMemo(() => {
        return items.filter(item => itemFilter(item, inputValue));
      }, [inputValue, items, itemFilter]);

      return (
        <BaseDropdown
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
          {selectedItem && !inputValue && (
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
                if (selectOnTab && e.key === 'Tab') {
                  selectHighlightedItem();
                }
              },
              onFocus: () => {
                if (openOnFocus) {
                  !isOpen && openMenu();
                }
              },
              placeholder: selectedItem ? undefined : placeholder,
              ...rest,
            })}
            ref={mergeRefs<HTMLInputElement>(ref, inputRef)}
          />
        </BaseDropdown>
      );
    },
  );

const mergeRefs = <T extends HTMLElement>(
  ...refs: React.MutableRefObject<T>[] | React.ForwardedRef<T>[]
) => {
  return (node: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) ref.current = node;
    }
  };
};
