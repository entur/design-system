import React, { useEffect, useMemo, useState } from 'react';
import { CaptureResult, PostHogConfig } from 'posthog-js';
import { usePostHog } from 'posthog-js/react';
import type { PostHog } from 'posthog-js/react';

import { usePersistedState } from './SettingsContext';
import {
  formatConsentDetails,
  formatConsentEvent,
  getCMP,
} from 'src/utils/consentManagementUtils/utils';
import {
  CONSENT_UPDATED_EVENT,
  ConsentDetails,
  Consents,
} from 'src/utils/consentManagementUtils/types';
// import { ConsentValue, useConsent } from './ConsentProvider';

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
  before_send: (event: CaptureResult | null): CaptureResult | null => {
    if (event) {
      console.log(event);
      return event;
    }
    return null;
  },
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
  disable_persistence: true,
  enable_heatmaps: false,
  disable_session_recording: true,
  capture_dead_clicks: false,
  capture_heatmaps: false,
  capture_pageleave: false,
  capture_pageview: false,
  capture_performance: false,
  opt_out_capturing_by_default: true,
};

export const POSTHOG_API_KEY =
  'phc_ESGRM1feMLZkHxV0P81O4i7g4I4jTFIYZpuZVxqF3hq';

type AnalyticsContextType = {
  updateAnalyticsConfig: (newConsent: any) => void;
  updateAnalyticsConsent: (newConsent: any) => void;
  analyticsConsent: any | undefined;
  consents: Consents;
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
  // const { consents, updateConsents } = useConsent();
  const [consents, setConsents] = useState<Consents>(undefined);
  const [uniqueId, setUniqueId] = usePersistedState<string | null>(
    'entur_ds_unique_id',
    null,
  );

  window.addEventListener('UC_UI_INITIALIZED', function (event) {
    console.log('UC_UI_INITIALIZED', event.detail);
  });

  useEffect(() => {
    function handleConsentUpdate(event: Event) {
      const consents = formatConsentEvent(event);
      console.dir(consents);
      setConsents(consents);

      updateAnalyticsConfig(
        consents?.find(consent => consent.id === 'uRoG9JxhEUtI4V')
          ?.consentGiven ?? false,
      );
    }

    window.addEventListener(CONSENT_UPDATED_EVENT, handleConsentUpdate);
    return () =>
      window.removeEventListener(CONSENT_UPDATED_EVENT, handleConsentUpdate);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // useEffect(() => updateAnalyticsConsent(consents?.analytics), []);

  const updateAnalyticsConfig = (hasConsented: boolean) => {
    if (hasConsented) {
      console.log('accepted');
      if (posthog.__loaded) {
        posthog.set_config(acceptedPosthogOptions);
      } else {
        posthog.init(POSTHOG_API_KEY, acceptedPosthogOptions);
      }
      posthog.opt_in_capturing({ captureEventName: 'User opted in' });
      const _uniqueId =
        uniqueId ?? IDENTIFIED_PREFIX + posthog.get_distinct_id();
      setUniqueId(_uniqueId);
      posthog.identify(_uniqueId);
    } else {
      console.log('denied');
      if (posthog?.__loaded) {
        posthog.opt_out_capturing();
        posthog.reset();
      }
      setUniqueId(null);
    }
  };

  const updateAnalyticsConsent = async (consent: boolean) => {
    console.log('update');
    if (typeof window === 'undefined') return;
    await window.__ucCmp.updateServicesConsents([
      {
        id: 'uRoG9JxhEUtI4V',
        consent,
      },
    ]);
    await window.__ucCmp.saveConsents();

    console.log(formatConsentDetails(await getCMP()?.getConsentDetails()));
  };

  const contextValue = useMemo(
    () => ({
      updateAnalyticsConfig,
      updateAnalyticsConsent,
      analyticsConsent: consents?.find(
        consent => consent.id === 'uRoG9JxhEUtI4V',
      )?.consentGiven,
      consents,
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
