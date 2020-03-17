import React from 'react';
import { RadioGroupContextProvider } from './RadioGroupContext';
import { Fieldset } from './Fieldset';

export type RadioGroupProps = {
  /** Navnet til radiogruppen. */
  name: string;
  /** Overskrift over radiogruppen */
  label?: string;
  /** Verdien til den valgte radioknappen */
  value: string;
  /** Radioknappene sendes inn som children */
  children: React.ReactNode;
  /** En callback som blir kalles hver gang en radioknapp klikkes på  */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  children,
  onChange,
  ...rest
}) => {
  const contextValue = React.useMemo(() => ({ name, value, onChange }), [
    name,
    value,
    onChange,
  ]);
  return (
    <RadioGroupContextProvider value={contextValue}>
      <Fieldset {...rest}>{children}</Fieldset>
    </RadioGroupContextProvider>
  );
};
