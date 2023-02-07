import React from 'react';

export function usePersistedState<Type>(
  key: string,
  initialState: Type,
): [Type, React.Dispatch<React.SetStateAction<Type>>] {
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
export type Theme = 'light' | 'dark';
type SettingsContextType = {
  variableFormat: VariableFormat;
  setVariableFormat: React.Dispatch<React.SetStateAction<VariableFormat>>;
  userType: UserType;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
  packageManager: PackageManager;
  setPackageManager: React.Dispatch<React.SetStateAction<PackageManager>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
};

const SettingsContext = React.createContext<SettingsContextType | null>(null);

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

  const [theme, setTheme] = usePersistedState<Theme>('theme', 'light');

  const contextValue = React.useMemo(
    () => ({
      variableFormat,
      userType,
      setVariableFormat,
      setUserType,
      packageManager,
      setPackageManager,
      theme,
      setTheme,
    }),
    [
      variableFormat,
      userType,
      setVariableFormat,
      setUserType,
      packageManager,
      setPackageManager,
      theme,
      setTheme,
    ],
  );

  return <SettingsContext.Provider value={contextValue} {...props} />;
};

export const useSettings: () => SettingsContextType = () => {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error(
      'You need to wrap your component in a SettingsProvider component in ' +
        'order to use the useSettings hook',
    );
  }
  return context;
};
