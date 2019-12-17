import React from 'react';
import Downshift, { ControllerStateAndHelpers } from 'downshift';
import { NormalizedDropdownItemType } from './useNormalizedItems';

const DownshiftContext = React.createContext<ControllerStateAndHelpers<
  NormalizedDropdownItemType
> | null>(null);

export type DownshiftProviderProps = {
  onChange?: (
    selectedItem: NormalizedDropdownItemType,
    stateAndHelpers: ControllerStateAndHelpers<NormalizedDropdownItemType>,
  ) => void;
  onInputValueChange?: (value: string) => void;
  inputValue?: string;
  initialSelectedItem?: NormalizedDropdownItemType;
  [key: string]: any;
};
export const DownshiftProvider: React.FC<DownshiftProviderProps> = ({
  children,
  onChange = () => {},
  onInputValueChange = () => {},
  ...rest
}) => {
  const handleStateChange = (
    changes: any,
    stateAndHelpers: ControllerStateAndHelpers<NormalizedDropdownItemType>,
  ) => {
    if ('selectedItem' in changes) {
      onChange(changes.selectedItem, stateAndHelpers);
    } else if ('inputValue' in changes) {
      onInputValueChange(changes.inputValue);
    }
  };
  return (
    <Downshift
      itemToString={item => (item ? item.label : '')}
      onStateChange={handleStateChange}
      {...rest}
    >
      {args => (
        <div className="eds-input-group">
          {/* This div is required by Downshift */}
          <DownshiftContext.Provider value={args}>
            {children}
          </DownshiftContext.Provider>
        </div>
      )}
    </Downshift>
  );
};

export const useDownshift = () => {
  const context = React.useContext(DownshiftContext);
  if (!context) {
    throw new Error('You need to wrap your component in a DownshiftProvider');
  }
  return context;
};
