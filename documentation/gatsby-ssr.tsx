import './src/styles/index.scss';

import React, { useEffect } from 'react';
import { SettingsProvider } from './src/providers/SettingsContext';
import { MediaContextProvider } from './src/providers/MediaBreakpoint';
import DocLayout from './src/layouts/DocLayout';
import { GatsbySSR } from 'gatsby';
import { FrontPage } from './src/components/FrontPage/FrontPage';
import FrontPageLayout from './src/layouts/FrontPageLayout';

export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => {
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

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({
  element,
  props,
}) => {
  if (props.location.pathname === '/') return <>{element}</>;
  return <DocLayout {...props}>{element}</DocLayout>;
};
