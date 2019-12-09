import React from 'react';
import { BaseFormControl } from '@entur/form';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { DropdownList } from './DropdownList';
import { DropdownToggleButton } from './DropdownToggleButton';
import './BaseDropdown.scss';

type BaseDropdownProps = {
  items: NormalizedDropdownItemType[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  style?: { [key: string]: any };
  [key: string]: any;
};
export const BaseDropdown: React.FC<BaseDropdownProps> = ({
  children,
  className,
  items,
  placeholder,
  style,
  ...rest
}) => {
  return (
    <div className="eds-dropdown-wrapper">
      <BaseFormControl
        append={<DropdownToggleButton />}
        className={className}
        dark
        {...rest}
      >
        {children}
      </BaseFormControl>
      <DropdownList
        items={items}
        style={{ position: 'absolute', top: '100%', ...style }}
        {...rest}
      />
    </div>
  );
};
