import * as React from 'react';

type InputGroupContextType = {
  isFilled: boolean;
  setFilled: (e: boolean) => void;
};

const InputGroupContext = React.createContext<InputGroupContextType>({
  isFilled: false,
  setFilled: () => {},
});

export const InputGroupContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [filled, setFilled] = React.useState(false);
  return (
    <InputGroupContext.Provider
      value={{ isFilled: filled, setFilled: setFilled }}
    >
      {children}
    </InputGroupContext.Provider>
  );
};

export const useInputGroupContext = () => React.useContext(InputGroupContext);
