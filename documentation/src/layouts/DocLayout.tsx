import React, { useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import classNames from 'classnames';
import { MDXComponents } from 'mdx/types.js';
import { MDXProvider } from '@mdx-js/react';

import { MenuItem } from '../components/Navigations/SideNavigation/utils';
import { useScrollRestoration } from '../utils/useScrollRestoration';
import SideNavigation from '../components/Navigations/SideNavigation/SideNavigation';
import MobileSideNavigation from '../components/Navigations/SideNavigation/MobileSideNavigation';
import TableOfContent from '../components/Navigations/TableOfContent/TableOfContent';
import { Media } from '../providers/MediaBreakpoint';
import { useSettings } from '../providers/SettingsContext';

import TopNavigationLayout from './TopNavigationLayout';
import components from './MdxProvider-utils';

interface LayoutProps {
  //pageTitle: string;
  children: React.ReactNode;
  location: Location;
}

const DocLayout = (props: LayoutProps) => {
  const { children } = props;
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const { colorMode } = useSettings();

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
            hide
          }
          id
        }
      }
    }
  `);

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-color-mode',
      colorMode ?? 'dark',
    );
  }, [colorMode]);
  const menuItems: MenuItem[] = MenuData.allMdx.nodes;

  return (
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
      </div>
    </div>
  );
};

export default DocLayout;
