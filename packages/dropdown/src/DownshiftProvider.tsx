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
  initialSelectedItem?: NormalizedDropdownItemType;
  [key: string]: any;
};
export const DownshiftProvider: React.FC<DownshiftProviderProps> = ({
  children,
  ...rest
}) => {
  return (
    <Downshift itemToString={item => (item ? item.label : '')} {...rest}>
      {args => (
        <div className="eds-input-group">
          {/* Required by Downshift */}
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
