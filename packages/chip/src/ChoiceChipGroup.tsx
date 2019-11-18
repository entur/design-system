import React from 'react';
import { ChoiceChipGroupContextProvider } from './ChoiceChipGroupContext';
import './ChoiceChip.scss';
type ChoiceChipGroupProps = {
  /** Navnet til ChoiceChipsGroup */
  name: string;
  /** Verdien til den valgte ChoiceChipen */
  value: string;
  /** ChoiceChip-komponentene sendes inn som children */
  children: React.ReactNode;
  /** En callback som blir kalles hver gang en ChoiceChip klikkes på  */
  onChange: (e: React.ChangeEvent) => void;
  [key: string]: any;
};

export const ChoiceChipGroup: React.FC<ChoiceChipGroupProps> = ({
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
    <ChoiceChipGroupContextProvider value={contextValue}>
      <div className="eds-choice-chips-group" {...rest}>
        {children}
      </div>
    </ChoiceChipGroupContextProvider>
  );
};
