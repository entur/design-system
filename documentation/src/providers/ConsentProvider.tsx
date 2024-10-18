import React, { useMemo } from 'react';
import { usePersistedState } from './SettingsContext';

export type ConsentValue = 'undecided' | 'accepted' | 'denied' | undefined;

export type ConsentSet = {
  [key: string]: ConsentValue;
};

type ConsentProviderProps = {
  initialConsents?: ConsentSet;
  children: React.ReactNode;
};

type ConsentContextType = {
  consents: ConsentSet | undefined;
  updateConsents: (updatedValues: ConsentSet) => void;
};

const ConsentContext = React.createContext<ConsentContextType | null>(null);

export const ConsentProvider = ({
  initialConsents,
  children,
}: ConsentProviderProps) => {
  const [consents, setConsents] = usePersistedState(
    'consents',
    initialConsents,
  );

  const updateConsents = (updatedValues: ConsentSet) => {
    setConsents({ ...consents, ...updatedValues });
  };

  const contextValue = useMemo(
    () => ({
      consents,
      updateConsents,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [consents],
  );

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => {
  const context = React.useContext(ConsentContext);
  if (!context) {
    throw new Error(
      'You need to wrap your component in a ConsentProvider component in ' +
        'order to use the useConsent hook',
    );
  }
  return context;
};
