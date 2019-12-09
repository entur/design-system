import React from 'react';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { useDownshift } from './DownshiftProvider';
import { BaseDropdown } from './BaseDropdown';

type RegularDropdownProps = {
  items: NormalizedDropdownItemType[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};
export const RegularDropdown: React.FC<RegularDropdownProps> = ({
  disabled,
  placeholder = 'Vennligst velg',
  ...rest
}) => {
  const { getToggleButtonProps, selectedItem } = useDownshift();
  return (
    <BaseDropdown disabled={disabled} {...rest}>
      <button
        {...getToggleButtonProps({
          className: 'eds-form-control',
          style: { textAlign: 'left' },
          disabled,
          type: 'button',
        })}
      >
        {selectedItem ? selectedItem.label : placeholder}
      </button>
    </BaseDropdown>
  );
};
