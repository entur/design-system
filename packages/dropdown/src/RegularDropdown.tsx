import React from 'react';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { useDownshift } from './DownshiftProvider';
import { BaseDropdown } from './BaseDropdown';

type RegularDropdownProps = {
  items: NormalizedDropdownItemType[];
  disabled?: boolean;
  placeholder?: string;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  selectOnTab?: boolean;
};
export const RegularDropdown: React.FC<RegularDropdownProps> = ({
  disabled,
  placeholder = 'Vennligst velg',
  selectOnTab = false,
  ...rest
}) => {
  const {
    getToggleButtonProps,
    selectedItem,
    selectHighlightedItem,
  } = useDownshift();
  return (
    <BaseDropdown disabled={disabled} {...rest}>
      <button
        {...getToggleButtonProps({
          className: 'eds-form-control',
          style: { textAlign: 'left' },
          disabled,
          type: 'button',
          onKeyDown: e => {
            if (selectOnTab && e.key === 'Tab') {
              selectHighlightedItem();
            }
          },
        })}
      >
        {selectedItem ? selectedItem.label : placeholder}
      </button>
    </BaseDropdown>
  );
};
