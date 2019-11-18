import React from 'react';

type ChoiceChipGroupContextProps = {
  name: string;
  onChange: (e: React.ChangeEvent) => void;
  value: string;
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
