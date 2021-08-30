import React from 'react';

type RadioGroupContextProps = {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | null;
};

const RadioGroupContext = React.createContext<RadioGroupContextProps | null>(
  null,
);

export const RadioGroupContextProvider = RadioGroupContext.Provider;

export const useRadioGroupContext: () => RadioGroupContextProps = () => {
  const context = React.useContext(RadioGroupContext);
  if (!context) {
    throw new Error(
      'You need to wrap your RadioButtons in a RadioGroup component',
    );
  }
  return context;
};
