import React from 'react';
import { useRandomId } from '@entur/utils';

export type SelectedValues = { [key: string]: boolean };
export type SelectedValue = string | null;
export type SegmentedContextProps =
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

const SegmentedContext = React.createContext<SegmentedContextProps | null>(
  null,
);

export type SegmentedProviderProps =
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

export const SegmentedProvider: React.FC<SegmentedProviderProps> = ({
  name,
  onChange = () => {},
  selectedValue,
  multiple,
  ...rest
}) => {
  const generatedName = useRandomId('eds-segmented-control');
  const contextValue = React.useMemo(
    () => ({
      name: name || generatedName,
      onChange,
      multiple,
      selectedValue,
    }),
    [generatedName, multiple, name, onChange, selectedValue],
  ) as SegmentedContextProps;
  return <SegmentedContext.Provider value={contextValue} {...rest} />;
};

export const useSegmentedContext = () => {
  const context = React.useContext(SegmentedContext);
  if (!context) {
    throw new Error(
      'You need to wrap your SegmentedChoice in a SegmentedControl component',
    );
  }
  return context;
};
