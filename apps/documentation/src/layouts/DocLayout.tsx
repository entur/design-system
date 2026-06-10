import React, { useEffect } from 'react';
import { PageProps } from 'gatsby';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from 'mdx/types';
import { SkipToContent } from '@entur/a11y';
import { Grid, GridItem, LayoutProvider } from '@entur/layout/beta';
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
      <LayoutProvider breakpoints={{ m: 960 }}>
        <Grid
          className="doc-layout"
          templateColumns={{ s: '1fr', m: '18rem 1fr' }}
          gap="none"
        >
          <GridItem as={TopNavigationLayout} colSpan={{ s: 1, m: '1 / -1' }} />
          <GridItem
            as={SideNavigationLayout}
            location={location}
            className="side-nav-column"
          />
          <GridItem as="main" id="main" className="page">
            {showHeader && <PageHeader frontmatter={frontmatter} />}
            <MdxTableOfContent />
            <MDXProvider components={components as MDXComponents}>
              {children}
            </MDXProvider>
          </GridItem>
          <GridItem as={Footer} colSpan={{ s: 1, m: '1 / -1' }} />
        </Grid>
      </LayoutProvider>
    </>
  );
};

export default DocLayout;
