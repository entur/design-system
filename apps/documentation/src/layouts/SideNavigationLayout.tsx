import React from 'react';
import MobileSideNavigation from '@components/Navigations/SideNavigation/MobileSideNavigation';
import SideNavigation from '@components/Navigations/SideNavigation/SideNavigation';
import { MenuItem } from '@components/Navigations/SideNavigation/utils';
import { PageProps, graphql, useStaticQuery } from 'gatsby';

const SideNavigationLayout = ({
  location,
}: {
  location: PageProps['location'];
}) => {
  const [openSidebar, setOpenSidebar] = React.useState(false);

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
          tag
        }
      }
      allSanityComponentDoc {
        nodes {
          id
          subcategory
          category
          title
          tag
        }
      }
    }
  `);

  const menuItems = mergeMdxAndSanityPageData(MenuData.allMdx.nodes, [
    ...MenuData.allSanityPage.nodes,
    ...MenuData.allSanityComponentDoc.nodes,
  ]);

  return (
    <nav aria-label="Sidemeny">
      <div className="side-navigation--desktop">
        <SideNavigation menuItems={menuItems} currentLocation={location} />
      </div>
      <div className="side-navigation--mobile">
        <MobileSideNavigation
          menuItems={menuItems}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          currentLocation={location}
        />
      </div>
    </nav>
  );
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
        isCategoryLandingPage: false,
        tag: undefined,
      } as MenuItem;
    });
  const sanityPages = sanityPageData.map(page => {
    return {
      id: page.id,
      title: page.title,
      category: page.category,
      subcategory: page.subcategory,
      order: page.order ?? null,
      categoryIndex: page.categoryIndex ?? null,
      isCategoryLandingPage: page.isCategoryLandingPage ?? false,
      tag: page.tag ?? undefined,
    } as MenuItem;
  });
  const customMenuItems: MenuItem[] = [
    {
      id: 'code-playground',
      title: 'Sandkasse',
      category: 'Komponenter',
      subcategory: 'Oversikt',
      order: 2,
      path: '/sandkasse/',
    } as MenuItem,
    {
      id: 'brukerundersokelse',
      title: 'Brukerundersøkelse',
      category: 'Ressurser',
      subcategory: 'Innsikt',
      order: 1,
      path: '/ressurser/innsikt/brukerundersokelse/',
    } as MenuItem,
  ];

  return [...mdxPages, ...sanityPages, ...customMenuItems];
}
