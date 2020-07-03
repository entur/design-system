import React from 'react';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { BaseDropdown } from './BaseDropdown';
import { useDownshift } from './DownshiftProvider';

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
  [key: string]: any;
};

function escapeRegex(item: NormalizedDropdownItemType, input: string | null) {
  if (!input) {
    return true;
  }
  const sanitizedEscapeCharacters = input.replace(
    /[-\/\\^$*+?.()|[\]{}]/g,
    '\\$&',
  );
  const inputRegex = new RegExp(sanitizedEscapeCharacters, 'i');
  return inputRegex.test(item.label);
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
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
  itemFilter = (item: NormalizedDropdownItemType, inputValue: string | null) =>
    escapeRegex(item, inputValue),
  ...rest
}) => {
  const {
    getInputProps,
    inputValue,
    selectHighlightedItem,
    openMenu,
  } = useDownshift();

  const filteredItems = React.useMemo(() => {
    return items.filter(item => itemFilter(item, inputValue));
  }, [inputValue, items]);

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
    >
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
              openMenu();
            }
          },
          ...rest,
        })}
      />
    </BaseDropdown>
  );
};
