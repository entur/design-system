import React, { useEffect, useMemo } from 'react';
import { PostHogConfig } from 'posthog-js';
import { usePostHog } from 'posthog-js/react';
import type { PostHog } from 'posthog-js/react';

import { usePersistedState } from './SettingsContext';
import { ConsentValue, useConsent } from './ConsentProvider';

const PERSISTENCE_KEY_NAME = 'entur_ds_analytics';
const IDENTIFIED_PREFIX = 'entur_ds_';

const basePosthogOptions: Partial<PostHogConfig> = {
  api_host: 'https://eu.posthog.com',
  disable_session_recording: true,
  persistence_name: PERSISTENCE_KEY_NAME,
  cross_subdomain_cookie: false,
  person_profiles: 'identified_only',
  // we disable pageview since we will handle it manually
  capture_pageview: false,
  debug: true,
};
const acceptedPosthogOptions: Partial<PostHogConfig> = {
  ...basePosthogOptions,
  persistence: 'localStorage+cookie',
  disable_session_recording: false,
  enable_heatmaps: true,
};
export const deniedPosthogOptions: Partial<PostHogConfig> = {
  ...basePosthogOptions,
  enable_heatmaps: false,
  opt_out_capturing_by_default: true,
  opt_out_persistence_by_default: true,
};

export const POSTHOG_API_KEY =
  'phc_ESGRM1feMLZkHxV0P81O4i7g4I4jTFIYZpuZVxqF3hq';

type AnalyticsContextType = {
  updateAnalyticsConsent: (newConsent: ConsentValue) => void;
  analyticsConsent: ConsentValue | undefined;
  posthog: PostHog;
  setUniqueIdLocalStorage: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AnalyticsContext =
  React.createContext<AnalyticsContextType | null>(null);

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

  useEffect(() => {
    if (posthog.__loaded || consents?.analytics !== 'accepted') return;
    posthog.init(POSTHOG_API_KEY, deniedPosthogOptions);
  }, [consents?.analytics]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateAnalyticsConsent(consents?.analytics), []);

  // Function to delete all PostHog cookies
  const deletePostHogCookies = () => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      cookies.forEach(cookie => {
        const [name] = cookie.split('=');
        const trimmedName = name.trim();
        if (trimmedName.startsWith('ph_')) {
          // Delete cookie by setting it to expire in the past
          document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          // Also try with domain-specific paths
          document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.entur.no;`;
          document.cookie = `${trimmedName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=entur.no;`;
        }
      });
    }
  };

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
        // Delete all PostHog cookies when consent is denied
        deletePostHogCookies();
        break;
      }
      default: {
        posthog.set_config(deniedPosthogOptions);
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
