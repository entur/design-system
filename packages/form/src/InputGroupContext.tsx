import * as React from 'react';

type InputGroupContextType = {
  isFilled: boolean;
  setFilled: (e: boolean) => void;
};

const InputGroupContext = React.createContext<InputGroupContextType>({
  isFilled: false,
  setFilled: () => null,
});

export const InputGroupContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [filled, setFilled] = React.useState(false);

  const value = React.useMemo(
    () => ({ isFilled: filled, setFilled }),
    [filled, setFilled],
  );

  return (
    <InputGroupContext.Provider value={value}>
      {children}
    </InputGroupContext.Provider>
  );
};

export const useInputGroupContext = (): InputGroupContextType =>
  React.useContext(InputGroupContext);
