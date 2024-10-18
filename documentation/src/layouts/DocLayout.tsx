import * as React from 'react';
import classNames from 'classnames';
import { graphql, useStaticQuery } from 'gatsby';
import { MenuItem } from '../components/Navigations/SideNavigation/utils';
import SideNavigation from '../components/Navigations/SideNavigation/SideNavigation';
import MobileSideNavigation from '../components/Navigations/SideNavigation/MobileSideNavigation';
import TableOfContent from '../components/Navigations/TableOfContent/TableOfContent';
import { Media } from '../providers/MediaBreakpoint';
import TopNavigationLayout from './TopNavigationLayout';
import { MDXProvider } from '@mdx-js/react';
import components from './MdxProvider-utils';
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
          <MDXProvider components={components}>{children} </MDXProvider>
        </main>
        <TableOfContent />
      </div>
    </div>
  );
};

export default DocLayout;
