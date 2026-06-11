import React, { useEffect } from 'react';
import { PageProps } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from 'mdx/types';
import { SkipToContent } from '@entur/a11y';
import Footer from '@components/Footer/Footer';
import TopNavigationLayout from './TopNavigationLayout';
import components from '../utils/MdxProvider-utils';
import SideNavigationLayout from './SideNavigationLayout';
import PageHeader from '@components/PageHeader/PageHeader';
import MdxTableOfContent from '@components/Navigations/TableOfContent/MdxTableOfContent';
import { scrollToHashOnLoad } from '../utils/scrollUtils';

const DocLayout = ({ children, location, pageContext }: PageProps) => {
  useEffect(() => {
    scrollToHashOnLoad();
  }, [location.pathname, location.hash]);

  const frontmatter = (pageContext as any)?.frontmatter;
  const showHeader = !frontmatter?.removeHeader;

  return (
    <>
      <SkipToContent mainId="main">Gå til hovedinnhold</SkipToContent>
      <div className="doc-layout">
        <TopNavigationLayout className="doc-layout__full-width" />
        <SideNavigationLayout location={location} className="side-nav-column" />
        <main id="main" className="page">
          {showHeader && <PageHeader frontmatter={frontmatter} />}
          <MdxTableOfContent />
          <MDXProvider components={components as MDXComponents}>
            {children}
          </MDXProvider>
        </main>
        <Footer className="doc-layout__full-width" />
      </div>
    </>
  );
};

export default DocLayout;
