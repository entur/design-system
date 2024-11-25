import React, { useEffect } from 'react';
import { SettingsProvider, useSettings } from './src/providers/SettingsContext';
import { MediaContextProvider } from './src/providers/MediaBreakpoint';
import DocLayout from './src/layouts/DocLayout';
import { GatsbyBrowser } from 'gatsby';
import { ToastProvider } from '@entur/alert';
import './src/styles/index.scss';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => {
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
      <ToastProvider>
        <MediaContextProvider>{element}</MediaContextProvider>
      </ToastProvider>
      {/* </AnalyticsProvider> */}
      {/* </PostHogProvider> */}
      {/* </ConsentProvider> */}
    </SettingsProvider>
  );
};

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props,
}) => {
  if (props.location.pathname === '/') return <>{element}</>;
  return <DocLayout {...props}>{element}</DocLayout>;
};
