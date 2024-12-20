import React from 'react';
import classNames from 'classnames';
import { graphql, useStaticQuery } from 'gatsby';
import { MenuItem } from '@components/Navigations/SideNavigation/utils';
import SideNavigation from '@components/Navigations/SideNavigation/SideNavigation';
import MobileSideNavigation from '@components/Navigations/SideNavigation/MobileSideNavigation';
import TableOfContent from '@components/Navigations/TableOfContent/TableOfContent';
import SiteFooter from '@components/Footer/SiteFooter';
import { Media } from '@providers/MediaBreakpoint';
import TopNavigationLayout from './TopNavigationLayout';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from 'mdx/types.js';
import components from './MdxProvider-utils';
import { SkipToContent } from '@entur/a11y';
interface LayoutProps {
  children: React.ReactNode;
}

const DocLayout = ({ children }: LayoutProps) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const MenuData = useStaticQuery(graphql`
    query {
      allMdx {
        nodes {
          frontmatter {
            title
            route
            parent
            menu
            order
            removeToc
            hide
          }
          id
        }
      }
    }
  `);

  const menuItems: MenuItem[] = MenuData.allMdx.nodes;

  return (
    <>
      <SkipToContent mainId="site-content">Gå til hovedinnhold</SkipToContent>
      <div className="page">
        <TopNavigationLayout />
        <Media greaterThanOrEqual="desktop">
          <SideNavigation menuItems={menuItems} />
        </Media>
        <Media at="mobile">
          <MobileSideNavigation
            menuItems={menuItems}
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
          />
        </Media>

        <div
          className={classNames('site-content', {
            'site-content--hidden': openSidebar,
          })}
        >
          <main id="site-content">
            <MDXProvider components={components as MDXComponents}>
              {children}
            </MDXProvider>
          </main>
          <TableOfContent />
          <SiteFooter />
        </div>
      </div>
    </>
  );
};

export default DocLayout;
