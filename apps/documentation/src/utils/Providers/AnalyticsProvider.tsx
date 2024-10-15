import React, { useEffect, useMemo } from 'react';
import { PostHogConfig } from 'posthog-js';
import { usePostHog } from 'posthog-js/react';
import type { PostHog } from 'posthog-js/react';
import { useLocation } from '@reach/router';
import { usePersistedState } from './SettingsContext';
import { useConsent } from './ConsentProvider';

export type ConsentValue = 'undecided' | 'accepted' | 'denied' | undefined;

export type ConsentSet = {
  [key: string]: ConsentValue;
};

const PERSISTANCE_KEY_NAME = 'entur_ds_analytics';
const IDENTIFIED_PREFIX = 'entur_ds_';

const basePosthogOptions: Partial<PostHogConfig> = {
  api_host: 'https://eu.posthog.com',
  persistence: 'memory',
  disable_session_recording: true,
  persistence_name: PERSISTANCE_KEY_NAME,
  cross_subdomain_cookie: false,
  person_profiles: 'identified_only',
};
const acceptedPosthogOptions: Partial<PostHogConfig> = {
  ...basePosthogOptions,
  persistence: 'localStorage+cookie',
  disable_session_recording: false,
  enable_heatmaps: true,
};
export const deniedPosthogOptions: Partial<PostHogConfig> = {
  ...basePosthogOptions,
  persistence: 'memory',
  disable_persistence: false,
  enable_heatmaps: false,
};

export const POSTHOG_API_KEY =
  'phc_ESGRM1feMLZkHxV0P81O4i7g4I4jTFIYZpuZVxqF3hq';

type AnalyticsContextType = {
  updateAnalyticsConsent: (newConsent: ConsentValue) => void;
  analyticsConsent: ConsentValue | undefined;
  posthog: PostHog;
  setUniqueIdLocalStorage: React.Dispatch<React.SetStateAction<string | null>>;
};

const AnalyticsContext = React.createContext<AnalyticsContextType | null>(null);

export const AnalyticsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const posthog = usePostHog();
  const { consents, updateConsents } = useConsent();
  const [uniqueId, setUniqueId] = usePersistedState<string | null>(
    'entur_ds_unique_id',
    null,
  );
  const location = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateAnalyticsConsent(consents?.analytics), []);

  useEffect(() => {
    if (posthog.__loaded) posthog.capture('$pageview');
  }, [location.href, posthog]);

  const updateAnalyticsConsent = (newConsent: ConsentValue) => {
    switch (newConsent) {
      case 'accepted': {
        posthog.set_config(acceptedPosthogOptions);
        posthog.opt_in_capturing({ captureEventName: 'User opted in' });
        updateConsents({ analytics: 'accepted' });
        const _uniqueId =
          uniqueId ?? IDENTIFIED_PREFIX + posthog.get_distinct_id();
        setUniqueId(_uniqueId);
        posthog.identify(_uniqueId);
        break;
      }
      case 'denied': {
        posthog.set_config(deniedPosthogOptions);
        updateConsents({ analytics: 'denied' });
        posthog.opt_out_capturing();
        posthog.reset();
        setUniqueId(null);
        break;
      }
      default: {
        posthog.set_config(deniedPosthogOptions);
        updateConsents({ analytics: 'undecided' });
      }
    }
  };

  const contextValue = useMemo(
    () => ({
      updateAnalyticsConsent,
      analyticsConsent: consents?.analytics,
      posthog,
      setUniqueIdLocalStorage: setUniqueId,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [consents, posthog],
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = React.useContext(AnalyticsContext);
  if (!context) {
    throw new Error(
      'You need to wrap your component in a AnalyticsProvider component in ' +
        'order to use the useAnalytics hook',
    );
  }
  return context;
};
