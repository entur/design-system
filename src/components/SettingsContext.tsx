import React from 'react';

function usePersistedState<Type>(key: string, initialState: Type) {
  const useStateResult = React.useState<Type>(() => {
    if (typeof window === 'undefined') {
      // Server side
      return initialState;
    }
    return JSON.parse(localStorage.getItem(key) as string) || initialState;
  });
  // It seem like an unnecessary step to not destructure right away, but it's
  // done this way to keep the type definition intact
  const [state] = useStateResult;
  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return useStateResult;
}

export type VariableFormat = 'scss' | 'less' | 'css' | 'js';
export type UserType = 'developer' | 'designer';
export type PackageManager = 'yarn' | 'npm';
type Context = {
  variableFormat: VariableFormat;
  setVariableFormat: React.Dispatch<React.SetStateAction<VariableFormat>>;
  userType: UserType;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
  packageManager: PackageManager;
  setPackageManager: React.Dispatch<React.SetStateAction<PackageManager>>;
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

  const [packageManager, setPackageManager] = usePersistedState<PackageManager>(
    'package-manager',
    'npm',
  );

  const contextValue = React.useMemo(
    () => ({
      variableFormat,
      userType,
      setVariableFormat,
      setUserType,
      packageManager,
      setPackageManager,
    }),
    [
      variableFormat,
      userType,
      setVariableFormat,
      setUserType,
      packageManager,
      setPackageManager,
    ],
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
