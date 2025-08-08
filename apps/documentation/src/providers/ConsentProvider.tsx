import React, { useEffect, useMemo } from 'react';
import { usePersistedState } from './SettingsContext';
import {
  CONSENT_UPDATED_EVENT,
  Consents,
  handleConsentUpdate,
} from 'src/utils/cmpUtils';

export type ConsentValue = 'undecided' | 'accepted' | 'denied' | undefined;

export type ConsentSet = {
  [key: string]: ConsentValue;
};

type ConsentProviderProps = {
  initialConsents?: ConsentSet | null;
  children: React.ReactNode;
};

type ConsentContextType = {
  consents: ConsentSet | null;
  updateConsents: (updatedValues: ConsentSet) => void;
};

const ConsentContext = React.createContext<ConsentContextType | null>(null);

export const ConsentProvider = ({
  initialConsents = null,
  children,
}: ConsentProviderProps) => {
  const [consents, setConsents] = usePersistedState(
    'consents',
    initialConsents,
  );

  const updateConsents = (updatedValues: ConsentSet) => {
    setConsents({ ...consents, ...updatedValues });
  };

  // Event listener for handling changes to and from Usercentrics CMP
  useEffect(() => {
    let previousConsents: Consents | null = null;

    const consentUpdateHandler = async (event: Event) => {
      previousConsents = await handleConsentUpdate(event, previousConsents);
    };

    window.addEventListener(CONSENT_UPDATED_EVENT, consentUpdateHandler);

    return () => {
      window.removeEventListener(CONSENT_UPDATED_EVENT, consentUpdateHandler);
    };
  }, []);

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
