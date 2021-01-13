import React from 'react';

type ChoiceChipGroupContextProps = {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | null;
};

const ChoiceChipGroupContext = React.createContext<ChoiceChipGroupContextProps | null>(
  null,
);

export const ChoiceChipGroupContextProvider = ChoiceChipGroupContext.Provider;

export const useChoiceChipGroupContext = () => {
  const context = React.useContext(ChoiceChipGroupContext);
  if (!context) {
    throw new Error(
      'You need to wrap your ChoiceChips in a ChoiceChipGroup-component',
    );
  }
  return context;
};
