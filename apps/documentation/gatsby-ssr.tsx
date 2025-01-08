import './src/styles/index.scss';

import React from 'react';
import { GatsbyBrowser, GatsbySSR } from 'gatsby';
import { PostHogProvider } from 'posthog-js/react';
import posthog from 'posthog-js';

import { ToastProvider } from '@entur/alert';

import DocLayout from './src/layouts/DocLayout';
import {
  ConsentProvider,
  AnalyticsProvider,
  SettingsProvider,
  MediaContextProvider,
  AnalyticsContext,
  ColorsProvider,
} from './src/providers';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => {
  return (
    <SettingsProvider>
      <ConsentProvider>
        <PostHogProvider client={posthog}>
          <AnalyticsProvider>
            <ToastProvider>
              <ColorsProvider>
                <MediaContextProvider>{element}</MediaContextProvider>
              </ColorsProvider>
            </ToastProvider>
          </AnalyticsProvider>
        </PostHogProvider>
      </ConsentProvider>
    </SettingsProvider>
  );
};

export const wrapPageElement: GatsbySSR['wrapPageElement'] = ({
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
  if (element.type.is404) {
    return <>{children}</>; // Do not wrap 404 pages
  }
  return <DocLayout {...props}>{children}</DocLayout>;
};
