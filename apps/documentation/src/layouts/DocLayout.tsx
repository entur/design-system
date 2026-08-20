import React, { useEffect } from 'react';
import classNames from 'classnames';
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
import TableOfContentAside from '@components/Navigations/TableOfContent/TableOfContentAside';
import { TocProvider } from '@components/Navigations/TableOfContent/TocContext';
import { scrollToHashOnLoad } from '../utils/scrollUtils';

const DocLayout = ({ children, location, pageContext }: PageProps) => {
  useEffect(() => {
    scrollToHashOnLoad();
  }, [location.pathname, location.hash]);

  const frontmatter = (pageContext as any)?.frontmatter;
  const showHeader = !frontmatter?.removeHeader;
  // Pages outside the top level categories have no side menu to show — the menu is built
  // from the first part of the path — so they can ask for the column to be left out.
  const showSideNavigation = !frontmatter?.removeSideNavigation;

  return (
    <TocProvider>
      <SkipToContent mainId="main">Gå til hovedinnhold</SkipToContent>
      <div
        className={classNames('doc-layout', {
          'doc-layout--without-side-navigation': !showSideNavigation,
        })}
      >
        <TopNavigationLayout className="doc-layout__topnav" />
        {showSideNavigation && (
          <SideNavigationLayout
            location={location}
            className="side-nav-column"
          />
        )}
        <main id="main" className="page">
          {showHeader && <PageHeader frontmatter={frontmatter} />}
          <MdxTableOfContent />
          <MDXProvider components={components as MDXComponents}>
            {children}
          </MDXProvider>
        </main>
        <TableOfContentAside />
        <Footer className="doc-layout__footer" />
      </div>
    </TocProvider>
  );
};

export default DocLayout;
