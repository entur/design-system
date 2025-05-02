import React from 'react';

export type MenuItem = {
  id: string;
  frontmatter: {
    title: string;
    route: string;
    parent?: string;
    menu: string;
    order?: number;
    hide?: boolean;
    [key: string]: any;
  };
};

export const isActive = (route: string, location: Location) => {
  return removeTrailingSlash(route) === removeTrailingSlash(location.pathname);
};

export const removeTrailingSlash = (str?: string) =>
  str && str.endsWith('/') ? str.slice(0, -1) : str;

export const normalizePath = (path: string): string => {
  return path.replace(/\//g, '').replace(/-/g, ' ').toLowerCase();
};

export const hasSameParentCategory = (
  menuItem: MenuItem,
  currentDoc: string,
): boolean => {
  const normalizedParent = normalizePath(menuItem.frontmatter.parent || '');
  const normalizedCurrentDoc = normalizePath(currentDoc);
  if (normalizedParent === normalizedCurrentDoc) {
    return true;
  }

  const menuName = menuItem.frontmatter.menu;
  if (Array.isArray(menuName)) {
    return menuName.some((subMenuItem: MenuItem) =>
      hasSameParentCategory(subMenuItem, currentDoc),
    );
  } else if (typeof menuName === 'string') {
    if (
      normalizedParent === normalizedCurrentDoc ||
      normalizedCurrentDoc.startsWith(normalizedParent + '/')
    ) {
      return true;
    } else {
      return false;
    }
  }

  return false;
};

export function compare(a: MenuItem, b: MenuItem) {
  if (!a.frontmatter.title || !b.frontmatter.title) {
    console.error('Missing title in frontmatter:', a, b);
  }

  const menuItemAOrder = a.frontmatter.order ? a.frontmatter.order : 1000;
  const menuItemBOrder = b.frontmatter.order ? b.frontmatter.order : 1000;

  if (menuItemAOrder !== menuItemBOrder) {
    return menuItemAOrder - menuItemBOrder;
  }

  const titleA = (a.frontmatter.title || '').toUpperCase();
  const titleB = (b.frontmatter.title || '').toUpperCase();

  if (titleA < titleB) {
    return -1;
  }
  if (titleA > titleB) {
    return 1;
  }
  return 0;
}

// Menu-items sort orders
export const componentsMenuSortOrder = {
  Oversikt: 1,
  Ressurser: 2,
  Knapper: 3,
  Skjemaelementer: 4,
  Navigasjon: 5,
  'Layout & Flater': 6,
  Feedback: 7,
  Reise: 8,
} as any;

export const komIGangMenuSortOrder = {
  Introduksjon: 1,
  'For designere': 2,
  'For utviklere': 3,
} as any;

export const visuellIdentitetMenuSortOrder = {
  Introduksjon: 1,
  Verktøykassen: 2,
  Maler: 3,
} as any;

export const monsterMenuSortOrder = {
  Oversikt: 1,
  Mønster: 2,
} as any;

export const ressurserMenuSortOrder = {
  Oversikt: 1,
  Workshopmaler: 2,
} as any;

export const tokensMenuSortOrder = {
  Introduksjon: 1,
  Fargetokens: 2,
  'Øvrige tokens': 3,
} as any;

export const sortComponentMenus = (
  a: MenuItem,
  b: MenuItem,
  sortOrder: any,
) => {
  const aSortOrder = sortOrder[a.frontmatter.title] || 10;
  const bSortOrder = sortOrder[b.frontmatter.title] || 10;
  return aSortOrder - bSortOrder;
};

export const sorters: { [key: string]: any } = {
  'kom-i-gang': komIGangMenuSortOrder,
  identitet: visuellIdentitetMenuSortOrder,
  komponenter: componentsMenuSortOrder,
  tokens: tokensMenuSortOrder,
  monster: monsterMenuSortOrder,
  ressurser: ressurserMenuSortOrder,
};

export function useSideMenuScroll(page: string) {
  const [scrollPosition, setScrollPosition] = React.useState<number>(0);

  // React.useEffect(() => {
  //   // Retrieve the scroll position from sessionStorage
  //   const savedPosition = sessionStorage.getItem(`scroll-${page}`);
  //   if (savedPosition !== null) {
  //     // setScrollPosition(Number(savedPosition)); // Ensure it's a number
  //   }
  //   return () => {
  //     console.log('removescroll!');
  //     console.log('page', page);
  //     sessionStorage.removeItem(`scroll-${page}`);
  //   };
  // }, [page]);

  // React.useEffect(() => {
  //   console.log('setscroll!');
  //   const currentScroll = scrollPosition.toString();
  //   if (currentScroll !== '0') {
  //     // Save the current scroll position to sessionStorage
  //     sessionStorage.setItem(`scroll-${page}`, scrollPosition.toString());
  //   } else sessionStorage.removeItem(`scroll-${page}`);
  // }, [scrollPosition, page]);

  return [scrollPosition, setScrollPosition] as const;
}
