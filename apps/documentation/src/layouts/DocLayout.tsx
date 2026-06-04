import React, { useEffect } from 'react';
import { PageProps } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from 'mdx/types';
import { SkipToContent } from '@entur/a11y';
import SiteFooter from '@components/Footer/SiteFooter';
import TopNavigationLayout from './TopNavigationLayout';
import components from '../utils/MdxProvider-utils';
import SideNavigationLayout from './SideNavigationLayout';
import PageHeader from '@components/PageHeader/PageHeader';
import MdxTableOfContent from '@components/Navigations/TableOfContent/MdxTableOfContent';
import { scrollToHashOnLoad } from '../utils/scrollUtils';

const DocLayout = ({
  children,
  location,
  disableToc = false,
  pageContext,
}: PageProps & { disableToc?: boolean }) => {
  useEffect(() => {
    scrollToHashOnLoad();
  }, [location.pathname, location.hash]);

  const frontmatter = (pageContext as any)?.frontmatter;
  const showHeader = !disableToc && !frontmatter?.removeHeader;

  return (
    <>
      <SkipToContent mainId="main">Gå til hovedinnhold</SkipToContent>
      <TopNavigationLayout />
      <SideNavigationLayout location={location} />

      <div className="page">
        <div className="site-content">
          <main id="main">
            {showHeader && <PageHeader />}
            {!disableToc && <MdxTableOfContent />}
            <MDXProvider components={components as MDXComponents}>
              {children}
            </MDXProvider>
          </main>
          <SiteFooter />
        </div>
      </div>
    </>
  );
};

export default DocLayout;
