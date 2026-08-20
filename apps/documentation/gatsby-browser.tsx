import React from 'react';
import { GatsbyBrowser } from 'gatsby';

import './src/styles/index.scss';

import { ToastProvider } from '@entur/alert';
import {
  ColorsProvider,
  ConsentProvider,
  MediaContextProvider,
  SettingsProvider,
} from './src/providers';
import { SearchProvider } from './src/components/Search/SearchContext';
import { ConsentBanner } from './src/components/ConsentBanner/ConsentBanner';
import DocLayout from './src/layouts/DocLayout';

export const wrapRootElement: GatsbyBrowser['wrapRootElement'] = ({
  element,
}) => {
  return (
    <SettingsProvider>
      <ConsentProvider>
        {/* Belongs at the very top of the page, ahead of the skip link */}
        <ConsentBanner />
        <ToastProvider>
          <ColorsProvider>
            <MediaContextProvider>
              <SearchProvider>{element}</SearchProvider>
            </MediaContextProvider>
          </ColorsProvider>
        </ToastProvider>
      </ConsentProvider>
    </SettingsProvider>
  );
};

export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({
  element,
  props,
}) => {
  const CUSTOM_LAYOUT_PAGES = [
    '/',
    '/stand',
    '/ressurser/innsikt/brukerundersokelse',
  ];
  const normalizedPath = props.location.pathname.replace(/\/$/, '') || '/';
  if (CUSTOM_LAYOUT_PAGES.includes(normalizedPath)) return <>{element}</>;
  return <DocLayout {...props}>{element}</DocLayout>;
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

  const hasHash = routerProps.location.hash !== '';

  // An unanswered consent banner has to stay in view across navigation, and it sits at the
  // top of the document — so landing at the top of the page keeps it visible. A hash still
  // wins, since it means the reader asked for a particular section.
  if (!hasHash) {
    window.scrollTo({ top: 0, left: 0 });

    const page = document.getElementsByClassName('page')?.[0];
    if (page instanceof HTMLElement) {
      page.scrollTo({ top: 0, left: 0 });
    }

    document.scrollingElement?.scrollTo({ top: 0, left: 0 });
  } else {
    const hashElement = document.getElementById(
      routerProps.location.hash?.slice(1),
    );
    if (hashElement) hashElement.scrollIntoView({ block: 'start' });
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
