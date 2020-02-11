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
      size: 'medium' | 'large';
    }
  | {
      name: string;
      onChange: (value: SelectedValue) => void;
      selectedValue: SelectedValue;
      multiple: false;
      size: 'medium' | 'large';
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
      size: 'medium' | 'large';
    }
  | {
      name?: string;
      onChange?: (value: SelectedValue) => void;
      selectedValue: SelectedValue;
      multiple: false;
      size: 'medium' | 'large';
    };

export const SegmentedProvider: React.FC<SegmentedProviderProps> = ({
  name,
  onChange = () => {},
  selectedValue,
  multiple,
  size,
  ...rest
}) => {
  const generatedName = useRandomId('eds-segmented-control');
  const contextValue = React.useMemo(
    () => ({
      name: name || generatedName,
      onChange,
      multiple,
      selectedValue,
      size,
    }),
    [generatedName, multiple, name, onChange, selectedValue, size],
  ) as SegmentedContextProps;
  return <SegmentedContext.Provider value={contextValue} {...rest} />;
};

export const useSegmentedContext = () => {
  const context = React.useContext(SegmentedContext);
  if (!context) {
    throw new Error(
      'You need to wrap your SegmentedChoice in either SegmentedControl or MultipleSegmentedControl',
    );
  }
  return context;
};
