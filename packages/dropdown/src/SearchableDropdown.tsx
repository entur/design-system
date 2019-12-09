import React from 'react';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { BaseDropdown } from './BaseDropdown';
import { useDownshift } from './DownshiftProvider';

type SearchableDropdownProps = {
  items: NormalizedDropdownItemType[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
};
export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  items,
  disabled = false,
  className,
  readOnly = false,
  ...rest
}) => {
  const { getInputProps, inputValue } = useDownshift();
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
    >
      <input
        {...getInputProps({
          disabled,
          readOnly,
          className: 'eds-form-control',
          ...rest,
        })}
      />
    </BaseDropdown>
  );
};
