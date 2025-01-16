import React from 'react';
import { GatsbyBrowser } from 'gatsby';
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
// we need to manually disable it in some situations
export const shouldUpdateScroll: GatsbyBrowser['shouldUpdateScroll'] = ({
  prevRouterProps,
  routerProps,
}) => {
  const previousPathCategory =
    prevRouterProps?.location.pathname.split('/')?.[1];
  const pathCategory = routerProps?.location.pathname.split('/')?.[1];

  console.log('has hash', routerProps.location);

  // If the pathname doesn't have a hash, reset the scroll position to the top
  if (routerProps.location.hash === '') {
    // Otherwise, scroll to the top of the page
    const page = document.getElementsByClassName('page')?.[0];
    if (page) page.scrollTo(0, 0);
  }
  // If the path does have a hash, scroll to that hash element
  else {
    const hashElement = document.getElementById(
      routerProps.location.hash?.slice(1),
    );
    if (hashElement) hashElement.scrollIntoView();
  }

  // If we move to a new category, i.e. 'komponenter' -> 'identitet', reset side menu scroll
  if (pathCategory !== previousPathCategory) {
    const sideMenu = document.getElementsByClassName(
      'side-navigation-wrapper',
    )?.[0];
    if (sideMenu) sideMenu.scrollTo(0, 0);
  }

  return false;
};
