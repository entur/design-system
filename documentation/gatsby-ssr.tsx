import './src/styles/index.scss';

import React, { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import {
  AnalyticsProvider,
  deniedPosthogOptions,
  POSTHOG_API_KEY,
} from './src/providers/AnalyticsProvider';
import { ConsentProvider } from './src/providers/ConsentProvider';
import { ToastProvider } from '@entur/alert';
import { SettingsProvider } from './src/providers/SettingsContext';
import { MediaContextProvider } from './src/providers/MediaBreakpoint';

export const wrapRootElement = ({ element }) => {
  //TODO fix analytics providers
  // useEffect to only initialise posthog in browser environment,
  // not during gatsby build
  // useEffect(() => {
  //   if (posthog.__loaded) return;
  //   posthog.init(POSTHOG_API_KEY, deniedPosthogOptions);
  // }, []);

  return (
    <SettingsProvider>
      {/* <ConsentProvider> */}
      {/* <PostHogProvider client={posthog}> */}
      {/* <AnalyticsProvider> */}
      {/* <ToastProvider> */}
      <MediaContextProvider>{element}</MediaContextProvider>
      {/* </ToastProvider> */}
      {/* </AnalyticsProvider> */}
      {/* </PostHogProvider> */}
      {/* </ConsentProvider> */}
    </SettingsProvider>
  );
};
