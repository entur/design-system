import React from 'react';
import { ChoiceChipsGroupContextProvider } from './ChoiceChipsGroupContext';

type ChoiceChipsGroupProps = {
  /** Navnet til ChoiceChipsgruppen. */
  name: string;
  /** Overskrift over ChoiceChipsgruppen */
  label?: string;
  /** Verdien til den valgte ChoiceChipsknappen */
  value: string;
  /** ChoiceChipsknappene sendes inn som children */
  children: React.ReactNode;
  /** En callback som blir kalles hver gang en ChoiceChipsen klikkes på  */
  onChange: (e: React.ChangeEvent) => void;
  [key: string]: any;
};

export const ChoiceChipsGroup: React.FC<ChoiceChipsGroupProps> = ({
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
    <ChoiceChipsGroupContextProvider value={contextValue}>
      <fieldset {...rest}>{children}</fieldset>
    </ChoiceChipsGroupContextProvider>
  );
};
