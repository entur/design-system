import React from 'react';
import { useWindowDimensions } from '@entur/utils';
import MobileSideNavigation from '@components/Navigations/SideNavigation/MobileSideNavigation';
import SideNavigation from '@components/Navigations/SideNavigation/SideNavigation';
import { MenuItem } from '@components/Navigations/SideNavigation/utils';
import { useStaticQuery, graphql, PageProps } from 'gatsby';
import { pxToRem } from 'src/utils/utils';

const SideNavigationLayout = ({
  location,
}: {
  location: PageProps['location'];
}) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);

  const { width } = useWindowDimensions();
  const remWidth = pxToRem(width);
  const isSmallScreen = remWidth !== undefined && remWidth < 60;
  const isLargeScreen = remWidth !== undefined && remWidth >= 60;

  const MenuData = useStaticQuery(graphql`
    query AllPages {
      allMdx {
        nodes {
          frontmatter {
            title
            description
            route
            parent
            menu
            order
            removeToc
            npmPackage
            tags
            categoryIndex
          }
          id
        }
      }
      allSanityPage {
        nodes {
          id
          subcategory
          category
          title
          isCategoryLandingPage
        }
      }
      allSanityComponentDoc {
        nodes {
          id
          subcategory
          category
          title
        }
      }
    }
  `);

  const menuItems = mergeMdxAndSanityPageData(MenuData.allMdx.nodes, [
    ...MenuData.allSanityPage.nodes,
    ...MenuData.allSanityComponentDoc.nodes,
  ]);
  if (isSmallScreen)
    return (
      <MobileSideNavigation
        menuItems={menuItems}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        currentLocation={location}
      />
    );
  if (isLargeScreen)
    return <SideNavigation menuItems={menuItems} currentLocation={location} />;
  return <></>;
};

export default SideNavigationLayout;

function mergeMdxAndSanityPageData(mdxPageData: any[], sanityPageData: any[]) {
  const mdxPages = mdxPageData
    .filter(page => page.frontmatter.title !== null)
    .map(page => {
      return {
        id: page.id,
        title: page.frontmatter.title,
        category: page.frontmatter.parent,
        subcategory: page.frontmatter.menu,
        tags: page.frontmatter.tags,
        order: page.frontmatter.order,
        categoryIndex: page.frontmatter.categoryIndex,
        isCategoryLandingPage: false, // MDX pages don't have this field
      } as MenuItem;
    });
  const sanityPages = sanityPageData.map(page => {
    return {
      id: page.id,
      title: page.title,
      category: page.category,
      subcategory: page.subcategory,
      tags: page?.tags ?? null,
      order: page.order ?? null,
      categoryIndex: page.categoryIndex ?? null,
      isCategoryLandingPage: page.isCategoryLandingPage ?? false,
    } as MenuItem;
  });
  // Add custom menu items
  const customMenuItems: MenuItem[] = [
    {
      id: 'code-playground',
      title: 'Sandkasse',
      category: 'Komponenter',
      subcategory: 'Oversikt',
      order: 2, // Place it after the main "Komponenter" overview page
      path: '/sandkasse/',
    } as MenuItem,
  ];

  return [...mdxPages, ...sanityPages, ...customMenuItems];
}
