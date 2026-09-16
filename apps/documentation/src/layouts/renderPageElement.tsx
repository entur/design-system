import React from 'react';
import { PageProps } from 'gatsby';

import { ConsentBanner } from '@components/ConsentBanner/ConsentBanner';
import DocLayout from './DocLayout';

/** Pages that bring their own layout, and so are rendered as they are. */
const CUSTOM_LAYOUT_PAGES = [
  '/',
  '/stand',
  '/ressurser/innsikt/brukerundersokelse',
];

/** Shared by gatsby-ssr and gatsby-browser so the two cannot drift apart.
 *
 *  The consent banner sits outside the layout choice: at the very top of the page, ahead of
 *  the skip link, and on every page whichever layout it uses. It lives here rather than in
 *  wrapRootElement because Gatsby validates that tree as head elements, and warns about
 *  every tag the banner renders. */
export const renderPageElement = (
  element: React.ReactNode,
  props: PageProps,
) => {
  const normalizedPath = props.location.pathname.replace(/\/$/, '') || '/';
  const hasCustomLayout = CUSTOM_LAYOUT_PAGES.includes(normalizedPath);

  return (
    <>
      <ConsentBanner />
      {hasCustomLayout ? element : <DocLayout {...props}>{element}</DocLayout>}
    </>
  );
};
