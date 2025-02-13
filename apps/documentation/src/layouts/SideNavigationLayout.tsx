import React from 'react';
import { useWindowDimensions } from '@entur/utils';
import MobileSideNavigation from '@components/Navigations/SideNavigation/MobileSideNavigation';
import SideNavigation from '@components/Navigations/SideNavigation/SideNavigation';
import { MenuItem } from '@components/Navigations/SideNavigation/utils';
import { useStaticQuery, graphql } from 'gatsby';

const SideNavigationLayout = () => {
  const [openSidebar, setOpenSidebar] = React.useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width !== undefined && width <= 960;

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

  return isMobile ? (
    <MobileSideNavigation
      menuItems={menuItems}
      openSidebar={openSidebar}
      setOpenSidebar={setOpenSidebar}
    />
  ) : (
    <SideNavigation menuItems={menuItems} />
  );
};

export default SideNavigationLayout;
