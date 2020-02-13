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
  [key: string]: any;
};
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
  autoHighlightFirstItem = false,
  ...rest
}) => {
  const {
    getInputProps,
    inputValue,
    selectHighlightedItem,
    openMenu,
  } = useDownshift();

  const filteredItems = React.useMemo(() => {
    if (!inputValue) {
      return items;
    }
    const inputRegex = new RegExp(inputValue, 'i');
    return items.filter(item => inputRegex.test(item.label));
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
