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
    if (!state) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return useStateResult;
}

export type VariableFormat = 'scss' | 'less' | 'css' | 'js';
export type UserType = 'developer' | 'designer';
export type PackageManager = 'yarn' | 'npm';
export type Theme = 'light' | 'dark' | 'system';
type SettingsContextType = {
  variableFormat: VariableFormat;
  setVariableFormat: React.Dispatch<React.SetStateAction<VariableFormat>>;
  userType: UserType;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
  packageManager: PackageManager;
  setPackageManager: React.Dispatch<React.SetStateAction<PackageManager>>;
  colorMode: Theme;
  setColorMode: React.Dispatch<React.SetStateAction<Theme>>;
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

  const [colorMode, setColorMode] = usePersistedState<Theme>(
    'color-mode',
    'light',
  );

  React.useEffect(() => {
    document.documentElement.setAttribute(
      'data-color-mode',
      colorMode ?? 'dark',
    );
  }, [colorMode]);

  const contextValue = React.useMemo(
    () => ({
      variableFormat,
      userType,
      setVariableFormat,
      setUserType,
      packageManager,
      setPackageManager,
      colorMode,
      setColorMode,
    }),
    [
      variableFormat,
      userType,
      setVariableFormat,
      setUserType,
      packageManager,
      setPackageManager,
      colorMode,
      setColorMode,
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
