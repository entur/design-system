import React from 'react';
import { Fieldset } from '../Fieldset';

type SegmentedGroupContextProps = {
  name: string;
  onChange: (e: React.ChangeEvent) => void;
  value: string;
  multiple: boolean;
};

const SegmentedGroupContext = React.createContext<SegmentedGroupContextProps | null>(
  null,
);

const SegmentedGroupContextProvider = SegmentedGroupContext.Provider;

export const useSegmentedGroupContext = () => {
  const context = React.useContext(SegmentedGroupContext);
  if (!context) {
    throw new Error(
      'You need to wrap your SegmentedControl components in a SegmentedGroup component',
    );
  }
  return context;
};

export type SegmentedGroupProps = {
  name: string;
  label?: string;
  value: string;
  multiple: boolean;
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent) => void;
  [key: string]: any;
};

export const SegmentedGroup: React.FC<SegmentedGroupProps> = ({
  name,
  label,
  value,
  children,
  onChange,
  multiple,
  ...rest
}) => {
  const contextValue = React.useMemo(
    () => ({ name, value, onChange, multiple }),
    [name, value, onChange, multiple],
  );
  return (
    <SegmentedGroupContextProvider value={contextValue}>
      <Fieldset className="eds-segmented-group" {...rest}>
        {children}
      </Fieldset>
    </SegmentedGroupContextProvider>
  );
};
