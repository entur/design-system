import React from 'react';
import { Label } from '@entur/typography';
import './SegmentedGroup.scss';

type SegmentedGroupContextProps = {
  name?: string;
  onChange?: (e: React.ChangeEvent) => void;
  value?: string;
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
      'Did you mean to use SegmentedControl without a SegmentedGroup?',
    );
  }
  return context;
};

export type SegmentedGroupProps = {
  /** Navn på gruppen brukes i forhold til radiogrupper */
  name?: string;
  /** Label som vises over SegmentedGroup */
  label?: string;
  /** Den valgte verdien */
  value: string;
  /** */
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
  ...rest
}) => {
  const contextValue = React.useMemo(
    () => ({ name, value, onChange, multiple: false }),
    [name, value, onChange],
  );

  return (
    <SegmentedGroupContextProvider value={contextValue}>
      <Label as="div">{label}</Label>
      <div className="eds-segmented-group" {...rest}>
        {children}
      </div>
    </SegmentedGroupContextProvider>
  );
};

export type SegmentedCheckboxGroupProps = {
  /** Labelenn for gruppen */
  label: string;
  /** SegmentedControl-komponentene */
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent) => void;
};

export const SegmentedCheckboxGroup: React.FC<SegmentedCheckboxGroupProps> = ({
  label,
  children,

  onChange,
  ...rest
}) => {
  const contextValue = {
    name: undefined,
    value: undefined,
    onChange: onChange,
    multiple: true,
  };
  return (
    <SegmentedGroupContextProvider value={contextValue}>
      <Label as="div">{label}</Label>
      <div className="eds-segmented-group" {...rest}>
        {children}
      </div>
    </SegmentedGroupContextProvider>
  );
};
