import React from 'react';
import { GatsbySSR } from 'gatsby';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import './src/styles/index.scss';

import { ToastProvider } from '@entur/alert';
import {
  ConsentProvider,
  AnalyticsProvider,
  SettingsProvider,
  MediaContextProvider,
  AnalyticsContext,
  ColorsProvider,
} from './src/providers';
import DocLayout from './src/layouts/DocLayout';

export const wrapRootElement: GatsbySSR['wrapRootElement'] = ({ element }) => {
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
  );
  if (props.location.pathname === '/') return <>{children}</>;
  if (element.type.is404) {
    return <DocLayout {...props}>{children}</DocLayout>;
  }
  return <DocLayout {...props}>{children}</DocLayout>;
};

export const onRenderBody: GatsbySSR['onRenderBody'] = args => {
  const { setHeadComponents, setPreBodyComponents } = args;

  setHeadComponents([
    <script
      key="usercentrics-cmp"
      id="usercentrics-cmp"
      src="https://web.cmp.usercentrics.eu/ui/loader.js"
      data-draft="true"
      data-settings-id="uZYAtMHS646Dzh"
      async
    ></script>,
    <script key="suppress-cmp" type="application/javascript">
      var UC_UI_SUPPRESS_CMP_DISPLAY = true;
    </script>,
  ]);

  setPreBodyComponents([
    <script key="suppress-cmp" type="application/javascript">
      var UC_UI_SUPPRESS_CMP_DISPLAY = true;
    </script>,
  ]);
};
