import React from 'react';
import { BaseFormControl } from '@entur/form';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { DropdownList } from './DropdownList';
import { DropdownToggleButton } from './DropdownToggleButton';
import { InlineSpinner } from './InlineSpinner';
import { CloseIcon } from '@entur/icons';
import './BaseDropdown.scss';
import { useDownshift } from './DownshiftProvider';

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
  loading = false,
  loadingText = 'Loading...',
  placeholder,
  style,
  listStyle,
  clearable,
  ...rest
}) => {
  return (
    <div className="eds-dropdown-wrapper">
      <BaseFormControl
        append={
          <Appendix
            clearable={clearable}
            loading={loading}
            loadingText={loadingText}
            readOnly={...rest.readOnly}
          />
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

const ClearButton: React.FC<{ [key: string]: any }> = ({ ...props }) => {
  const { clearSelection, selectedItem } = useDownshift();
  return (
    <>
      {selectedItem && (
        <button
          className="eds-dropdown__clear-button"
          type="button"
          tabIndex={-1}
          onClick={() => clearSelection()}
          {...props}
        >
          <CloseIcon />
        </button>
      )}
      {selectedItem && <div className="eds-dropdown__divider"></div>}
    </>
  );
};

const Appendix: React.FC<{
  clearable: boolean;
  loading: boolean;
  loadingText: string;
  readOnly: boolean;
}> = ({ clearable, loading, loadingText, readOnly }) => {
  if (loading) {
    return <InlineSpinner>{loadingText}</InlineSpinner>;
  }
  if (readOnly) {
    return null;
  }
  return clearable ? (
    <>
      <ClearButton></ClearButton> <DropdownToggleButton />
    </>
  ) : (
    <DropdownToggleButton />
  );
};
