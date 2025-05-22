import React from 'react';
import { PageProps } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from 'mdx/types';
import { SkipToContent } from '@entur/a11y';
import SiteFooter from '@components/Footer/SiteFooter';
import TopNavigationLayout from './TopNavigationLayout';
import components from './MdxProvider-utils';
import SideNavigationLayout from './SideNavigationLayout';
import TableOfContentLayout from './TableOfContentLayout';

const DocLayout = ({ children, location }: PageProps) => {
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
