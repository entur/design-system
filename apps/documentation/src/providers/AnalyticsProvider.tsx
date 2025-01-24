import React, { useEffect, useMemo } from 'react';
import { CaptureResult, PostHogConfig } from 'posthog-js';
import { usePostHog, PostHog } from 'posthog-js/react';

import { usePersistedState } from './SettingsContext';
import { ConsentValue, useConsent } from './ConsentProvider';

const PERSISTENCE_KEY_NAME = 'entur_ds_analytics';
const IDENTIFIED_PREFIX = 'entur_ds_';

const basePosthogOptions: Partial<PostHogConfig> = {
  api_host: 'https://eu.posthog.com',
  persistence: 'memory',
  disable_session_recording: true,
  persistence_name: PERSISTENCE_KEY_NAME,
  cross_subdomain_cookie: false,
  person_profiles: 'identified_only',
  // we disable pageview since we will handle it manually
  capture_pageview: false,
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
  autocapture: false,
  capture_pageview: false,
  capture_pageleave: true,
  capture_dead_clicks: false,
  before_send: (event: CaptureResult | null): CaptureResult | null => {
    function removePosthogPropertiesFromObject(object: Record<string, any>) {
      return Object.entries(object)
        .filter(([key]) => !(key[0] === '$'))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, any>);
    }

    if (event) {
      const _current_url = event.properties['$current_url'] as string;
      event.properties = removePosthogPropertiesFromObject(event.properties);
      event.properties['$current_url'] = _current_url;
      event.properties['is_dev'] =
        _current_url.includes('localhost') ||
        _current_url.includes('127.0.0.1');
      // TODO: should we anonymise distinct_id?

      return event;
    }
    return null;
  },
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
    if (posthog.__loaded) return;
    posthog.init(POSTHOG_API_KEY, deniedPosthogOptions);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateAnalyticsConsent(consents?.analytics), []);

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
        posthog.reset();
        setUniqueId(null);
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
