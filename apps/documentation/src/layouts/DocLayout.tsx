import React from 'react';
import TableOfContent from '@components/Navigations/TableOfContent/TableOfContent';
import SiteFooter from '@components/Footer/SiteFooter';
import TopNavigationLayout from './TopNavigationLayout';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from 'mdx/types';
import components from './MdxProvider-utils';
import { SkipToContent } from '@entur/a11y';
import SideNavigationLayout from './SideNavigationLayout';
import TableOfContentLayout from './TableOfContentLayout';
interface LayoutProps {
  children: React.ReactNode;
}

const DocLayout = ({ children }: LayoutProps) => {
  return (
    <>
      <SkipToContent mainId="main">Gå til hovedinnhold</SkipToContent>
      <TopNavigationLayout />
      <SideNavigationLayout />

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
