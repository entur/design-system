import React from 'react';

type RadioGroupContextProps = {
  name: string;
  onChange: (e: React.ChangeEvent) => void;
  value: string;
};

const RadioGroupContext = React.createContext<RadioGroupContextProps | null>(
  null,
);

export const RadioGroupContextProvider = RadioGroupContext.Provider;

export const useRadioGroupContext = () => {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error(
      'You need to wrap your RadioButtons in a RadioGroup component',
    );
  }
  return context;
};
