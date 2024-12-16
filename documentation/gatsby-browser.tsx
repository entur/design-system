import React from 'react';
import DocLayout from './src/layouts/DocLayout';
import { GatsbyBrowser } from 'gatsby';
import { ToastProvider } from '@entur/alert';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import {
  ConsentProvider,
  AnalyticsProvider,
  SettingsProvider,
  MediaContextProvider,
  AnalyticsContext,
} from './src/providers';

import './src/styles/index.scss';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => {
  return (
    <SettingsProvider>
      <ConsentProvider>
        <PostHogProvider client={posthog}>
          <AnalyticsProvider>
            <ToastProvider>
              <MediaContextProvider>{element}</MediaContextProvider>
            </ToastProvider>
          </AnalyticsProvider>
        </PostHogProvider>
      </ConsentProvider>
    </SettingsProvider>
  );
};

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props,
}) => {
  const children = (
    <ConsentProvider>
      <PostHogProvider client={posthog}>
        <AnalyticsContext.Consumer>
          {context => {
            if (context !== null && context.posthog.__loaded) {
              // we manually capture pageviews since gatsby
              // is not able to detect route changes
              context.posthog.capture('$pageview');
            }
            return element;
          }}
        </AnalyticsContext.Consumer>
      </PostHogProvider>
    </ConsentProvider>
  );
  if (props.location.pathname === '/') return <>{children}</>;
  return <DocLayout {...props}>{children}</DocLayout>;
};

// Since Gatsby does automatic scroll restoration on navigation,
// we need to manually disable it
export const shouldUpdateScroll: GatsbyBrowser['shouldUpdateScroll'] = ({
  prevPath,
  pathname,
}) => {
  // If the pathname has a hash (i.e., navigating to a specific heading),
  // do not override the scroll position.
  if (pathname !== prevPath && window.location.hash) {
    return false;
  }

  // Otherwise, scroll to the top of the page
  const page = document.getElementsByClassName('page')?.[0];
  if (page) page.scrollTo(0, 0);
  return false;
};
