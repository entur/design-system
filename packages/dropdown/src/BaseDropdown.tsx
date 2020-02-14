import React from 'react';
import { BaseFormControl } from '@entur/form';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { DropdownList } from './DropdownList';
import { DropdownToggleButton } from './DropdownToggleButton';
import { InlineSpinner } from './InlineSpinner';
import './BaseDropdown.scss';

type BaseDropdownProps = {
  className?: string;
  disabled?: boolean;
  items: NormalizedDropdownItemType[];
  loading?: boolean;
  loadingText?: string;
  placeholder?: string;
  style?: { [key: string]: any };
  listStyle?: { [key: string]: any };
  [key: string]: any;
};
export const BaseDropdown: React.FC<BaseDropdownProps> = ({
  children,
  className,
  items,
  loading,
  loadingText = 'Loading...',
  placeholder,
  style,
  listStyle,
  ...rest
}) => {
  return (
    <div className="eds-dropdown-wrapper">
      <BaseFormControl
        append={
          loading ? (
            <InlineSpinner>{loadingText}</InlineSpinner>
          ) : (
            !rest.readOnly && <DropdownToggleButton />
          )
        }
        className={className}
        dark
        {...rest}
      >
        {children}
      </BaseFormControl>
      <DropdownList
        items={items}
        style={{ position: 'absolute', top: '100%', ...listStyle }}
        {...rest}
      />
    </div>
  );
};
