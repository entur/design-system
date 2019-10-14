import React from 'react';

function usePersistedState<Type>(key: string, initialState: Type) {
  const useStateResult = React.useState<Type>(initialState);
  // It seem like an unnecessary step to not destructure right away, but it's
  // done this way to keep the type definition intact
  const [state, setState] = useStateResult;
  React.useEffect(() => {
    // We need to set the initial state on second render, since we use Gatsby,
    // and we can't use `localStorage` there
    setState(JSON.parse(localStorage.getItem(key) as string) || initialState);
  }, []);
  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return useStateResult;
}

export type VariableFormat = 'scss' | 'less' | 'css' | 'js';
export type UserType = 'developer' | 'designer';
type Context = {
  variableFormat: VariableFormat;
  setVariableFormat: React.Dispatch<React.SetStateAction<VariableFormat>>;
  userType: UserType;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
};

const SettingsContext = React.createContext<Context | null>(null);

export const SettingsProvider: React.FC = props => {
  const [variableFormat, setVariableFormat] = usePersistedState<VariableFormat>(
    'variable-format',
    'scss',
  );
  const [userType, setUserType] = usePersistedState<UserType>(
    'user-type',
    'developer',
  );

  const contextValue = React.useMemo(
    () => ({ variableFormat, userType, setVariableFormat, setUserType }),
    [variableFormat, userType],
  );

  return <SettingsContext.Provider value={contextValue} {...props} />;
};

export const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error(
      'You need to wrap your component in a SettingsProvider component in ' +
        'order to use the useSettings hook',
    );
  }
  return context;
};
