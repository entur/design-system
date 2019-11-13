import React from 'react';

type ChoiceChipsGroupContextProps = {
  name: string;
  onChange: (e: React.ChangeEvent) => void;
  value: string;
};

const ChoiceChipsGroupContext = React.createContext<ChoiceChipsGroupContextProps | null>(
  null,
);

export const ChoiceChipsGroupContextProvider = ChoiceChipsGroupContext.Provider;

export const useChoiceChipsGroupContext = () => {
  const context = React.useContext(ChoiceChipsGroupContext);
  if (!context) {
    throw new Error(
      'You need to wrap your ChoiceChips in a ChoiceChipsGroup component',
    );
  }
  return context;
};
