import React, { useEffect } from 'react';
import { PageProps } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from 'mdx/types';
import { SkipToContent } from '@entur/a11y';
import SiteFooter from '@components/Footer/SiteFooter';
import TopNavigationLayout from './TopNavigationLayout';
import components from './MdxProvider-utils';
import SideNavigationLayout from './SideNavigationLayout';
import TableOfContentLayout from './TableOfContentLayout';
import { scrollToHashOnLoad } from '../utils/scrollUtils';

const DocLayout = ({ children, location }: PageProps) => {
  // Handle hash scrolling on page load
  useEffect(() => {
    scrollToHashOnLoad();
  }, [location.pathname, location.hash]);

  return (
    <>
      <SkipToContent mainId="main">Gå til hovedinnhold</SkipToContent>
      <TopNavigationLayout />
      <SideNavigationLayout location={location} />

      <div className="page">
        <div className="site-content">
          <main id="main">
            <MDXProvider components={components as MDXComponents}>
              {children}
            </MDXProvider>
          </main>
          <TableOfContentLayout />
          <SiteFooter />
        </div>
      </div>
    </>
  );
};

export default DocLayout;
