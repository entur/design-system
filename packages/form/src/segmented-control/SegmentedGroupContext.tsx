import React from 'react';
import { useRandomId } from '@entur/utils';

export type SelectedValues = { [key: string]: boolean };
export type SelectedValue = string | null;
export type SegmentedGroupContextProps =
  | {
      name: string;
      onChange: (value: SelectedValues) => void;
      selectedValue: SelectedValues;
      multiple: true;
    }
  | {
      name: string;
      onChange: (value: SelectedValue) => void;
      selectedValue: SelectedValue;
      multiple: false;
    };

const SegmentedGroupContext = React.createContext<SegmentedGroupContextProps | null>(
  null,
);

export type SegmentedGroupProviderProps =
  | {
      name?: string;
      onChange?: (value: SelectedValues) => void;
      selectedValue: SelectedValues;
      multiple: true;
    }
  | {
      name?: string;
      onChange?: (value: SelectedValue) => void;
      selectedValue: SelectedValue;
      multiple: false;
    };

export const SegmentedGroupProvider: React.FC<SegmentedGroupProviderProps> = ({
  name,
  onChange = () => {},
  selectedValue,
  multiple,
  ...rest
}) => {
  const generatedName = useRandomId('eds-segmented-group');
  const contextValue = React.useMemo(
    () => ({
      name: name || generatedName,
      onChange,
      multiple,
      selectedValue,
    }),
    [generatedName, multiple, name, onChange, selectedValue],
  ) as SegmentedGroupContextProps;
  return <SegmentedGroupContext.Provider value={contextValue} {...rest} />;
};

export const useSegmentedGroup = () => {
  const context = React.useContext(SegmentedGroupContext);
  if (!context) {
    throw new Error(
      'Did you mean to use SegmentedControl without a SegmentedGroup?',
    );
  }
  return context;
};
