import React from 'react';
import { BaseFormControl } from '@entur/form';
import { DropdownListDeprecated } from './DropdownList';
import { DropdownDeprecatedToggleButton } from './DropdownToggleButton';
import { DropdownDeprecatedLoadingDots } from './DropdownLoadingDots';
import { CloseSmallIcon } from '@entur/icons';
import './BaseDropdown.scss';
import { useDownshift } from './DownshiftProvider';
import { space } from '@entur/tokens';
import { NormalizedDropdownItemDeprecatedType } from './types';

type BaseDropdownDeprecatedProps = {
  className?: string;
  disabled?: boolean;
  items: NormalizedDropdownItemDeprecatedType[];
  loading?: boolean;
  loadingText?: string;
  placeholder?: string;
  style?: { [key: string]: any };
  listStyle?: { [key: string]: any };
  isFilled?: boolean;
  disableLabelAnimation?: boolean;
  [key: string]: any;
};
export const BaseDropdownDeprecated: React.FC<BaseDropdownDeprecatedProps> = ({
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
      <DropdownListDeprecated
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
          aria-label="Trykk for å fjerne valg"
          {...props}
        >
          <CloseSmallIcon />
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
    return (
      <DropdownDeprecatedLoadingDots>
        {loadingText}
      </DropdownDeprecatedLoadingDots>
    );
  }
  if (readOnly) {
    return null;
  }
  return clearable ? (
    <>
      <ClearButton></ClearButton> <DropdownDeprecatedToggleButton />
    </>
  ) : (
    <DropdownDeprecatedToggleButton />
  );
};
