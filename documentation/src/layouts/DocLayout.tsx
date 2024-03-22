import * as React from 'react';
import classNames from 'classnames';
import { graphql, useStaticQuery } from 'gatsby';
import { MenuItem } from '../components/Navigations/SideNavigation/utils';
import { SiteSideNavigation } from '../components/Navigations/SideNavigation/SiteSideNavigation';
import { MobileSideNavigation } from '../components/Navigations/SideNavigation/MobileSideNavigation';
import { TableOfContent } from '../components/Navigations/TableOfContent/TableOfContent';
import { Media } from '../contexts/MediaBreakpoint';
import TopNavigationLayout from './TopNavigationLayout';
interface LayoutProps {
  pageTitle: string;
  children: React.ReactNode;
}
//TODO graphql query kan flyttes til pages mdx.frontmatter__route.tsx?
const DocLayout: React.FC<LayoutProps> = ({
  pageTitle,
  children,
}: LayoutProps) => {
  const data = useStaticQuery(graphql`
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
  const menuItems: MenuItem[] = data.allMdx.nodes;

  const [openSidebar, setOpenSidebar] = React.useState(false);

  return (
    <div className="page">
      <TopNavigationLayout />
      <Media greaterThanOrEqual="desktop">
        <SiteSideNavigation menuItems={menuItems} />
      </Media>
      <Media at="mobile">
        <MobileSideNavigation
          menuItems={menuItems}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          className={classNames('sidebar-mobile', {
            'sidebar-mobile--show': openSidebar,
          })}
        />
      </Media>

      <div
        className={classNames('site-content', {
          'site-content--hidden': openSidebar,
        })}
      >
        <main id="site-content">{children}</main>
        <TableOfContent />
      </div>
    </div>
  );
};

export default DocLayout;
