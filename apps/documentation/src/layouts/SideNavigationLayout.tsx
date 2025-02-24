import React from 'react';
import { useWindowDimensions } from '@entur/utils';
import MobileSideNavigation from '@components/Navigations/SideNavigation/MobileSideNavigation';
import SideNavigation from '@components/Navigations/SideNavigation/SideNavigation';
import { MenuItem } from '@components/Navigations/SideNavigation/utils';
import { useStaticQuery, graphql } from 'gatsby';
import { pxToRem } from 'src/utils/utils';

const SideNavigationLayout = () => {
  const [openSidebar, setOpenSidebar] = React.useState(false);

  const { width } = useWindowDimensions();
  const remWidth = pxToRem(width);
  const isSmallScreen = remWidth !== undefined && remWidth < 60;
  const isLargeScreen = remWidth !== undefined && remWidth >= 60;

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

  if (isSmallScreen)
    return (
      <MobileSideNavigation
        menuItems={menuItems}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />
    );
  if (isLargeScreen) return <SideNavigation menuItems={menuItems} />;
  return <></>;
};

export default SideNavigationLayout;
