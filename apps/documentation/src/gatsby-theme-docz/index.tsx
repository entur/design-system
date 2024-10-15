import React, { useEffect } from 'react';
import { ComponentsProvider, Link, theme } from 'docz';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import { ToastProvider } from '@entur/alert';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Paragraph,
  PreformattedText,
  StrongText,
  CodeText,
  UnorderedList,
  ListItem,
  NumberedList,
} from '@entur/typography';

import {
  AnalyticsProvider,
  deniedPosthogOptions,
  POSTHOG_API_KEY,
} from '~/utils/Providers/AnalyticsProvider';
import { ConsentProvider } from '~/utils/Providers/ConsentProvider';
import { SettingsProvider } from '~/utils/Providers/SettingsContext';
import { ColorsProvider } from '~/utils/Providers/ColorProvider';
import { MediaContextProvider } from '~/utils/Providers/MediaBreakpoint';
import Props from '~/components/Props';
import { Page } from '~/gatsby-theme-docz/UI/Page';

const componentMap = {
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  p: Paragraph,
  a: Link,
  pre: PreformattedText,
  strong: StrongText,
  inlineCode: CodeText,
  ul: UnorderedList,
  li: ListItem,
  ol: NumberedList,
  props: Props,
};

const App: React.FC = ({ children }) => {
  // useEffect to only initialise posthog in browser environment,
  // not during gatsby build
  useEffect(() => {
    posthog.init(POSTHOG_API_KEY, deniedPosthogOptions);
  }, []);

  // Use wrapPageElement and wrapRootElement in gatsby-browser when migrating away from Docz
  return (
    <SettingsProvider>
      <ConsentProvider>
        <PostHogProvider client={posthog}>
          <AnalyticsProvider>
            <ToastProvider>
              <MediaContextProvider>
                <ColorsProvider>
                  <ComponentsProvider components={componentMap}>
                    <Page>{children}</Page>
                  </ComponentsProvider>
                </ColorsProvider>
              </MediaContextProvider>
            </ToastProvider>
          </AnalyticsProvider>
        </PostHogProvider>
      </ConsentProvider>
    </SettingsProvider>
  );
};

export default theme({})(App);
