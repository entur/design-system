import React from 'react';
import { BaseFormControl } from '@entur/form';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { DropdownList } from './DropdownList';
import { DropdownToggleButton } from './DropdownToggleButton';
import { DropdownLoadingDots } from './DropdownLoadingDots';
import { CloseIcon } from '@entur/icons';
import './BaseDropdown.scss';
import { useDownshift } from './DownshiftProvider';
import { space } from '@entur/tokens';

type BaseDropdownProps = {
  className?: string;
  disabled?: boolean;
  items: NormalizedDropdownItemType[];
  loading?: boolean;
  loadingText?: string;
  placeholder?: string;
  style?: { [key: string]: any };
  listStyle?: { [key: string]: any };
  isFilled?: boolean;
  disableLabelAnimation?: boolean;
  [key: string]: any;
};
export const BaseDropdown: React.FC<BaseDropdownProps> = ({
  children,
  className,
  items,
  loading = false,
  loadingText = 'Loading...',
  //eslint-disable-next-line
  placeholder,
  style,
  listStyle,
  clearable,
  label,
  isFilled = false,
  disableLabelAnimation,
  ...rest
}) => {
  const { getLabelProps } = useDownshift();
  return (
    <div className="eds-dropdown-wrapper" style={style}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
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
        label={label}
        isFilled={isFilled}
        labelProps={getLabelProps()}
        disableLabelAnimation={disableLabelAnimation}
        {...rest}
      >
        {children}
      </BaseFormControl>
      <DropdownList
        items={items}
        style={{
          position: 'absolute',
          top: `${space.extraLarge3 + space.extraSmall}px`,
          ...listStyle,
        }}
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
    return <DropdownLoadingDots>{loadingText}</DropdownLoadingDots>;
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
