import React from 'react';
import { RadioGroupContextProvider } from './RadioGroupContext';
import { Fieldset } from './Fieldset';

export type RadioGroupProps = {
  /** Navnet til radiogruppen. */
  name: string;
  /** Overskrift over radiogruppen */
  label?: string;
  /** Verdien til den valgte radioknappen */
  value: string | null;
  /** Radioknappene sendes inn som children */
  children: React.ReactNode;
  /** En callback som blir kalles hver gang en radioknapp klikkes på  */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
  /** Sett radiogruppen i readonly-modus */
  readOnly?: boolean;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  children,
  onChange,
  label,
  readOnly = false,
  ...rest
}) => {
  const contextValue = React.useMemo(
    () => ({ name, value, onChange, readOnly }),
    [name, value, onChange, readOnly],
  );
  return (
    <RadioGroupContextProvider value={contextValue}>
      {label ? (
        <Fieldset label={label} {...rest}>
          {children}
        </Fieldset>
      ) : (
        children
      )}
    </RadioGroupContextProvider>
  );
};
