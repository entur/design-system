// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getSanitizedPath } = require('../../../utils/getSanitizedPath') as {
  getSanitizedPath: (input: {
    category?: string;
    subcategory?: string;
    title?: string;
    categoryIndex?: number;
    isCategoryLandingPage?: boolean;
    tag?: string;
  }) => string | undefined;
};

export interface MenuItem {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  categoryIndex?: number;
  isCategoryLandingPage?: boolean;
  tag?: string;
  path?: string;
  order?: number;
}

export const isActive = (route: string, location: Location) => {
  return (
    removeLeadingAndTrailingSlash(route) ===
    removeLeadingAndTrailingSlash(location.pathname)
  );
};

export const removeTrailingSlash = (str?: string) =>
  str && str.endsWith('/') ? str.slice(0, -1) : str;

export const removeLeadingSlash = (str?: string) =>
  str && str.startsWith('/') ? str.slice(1) : str;

export function removeLeadingAndTrailingSlash(str?: string) {
  return removeLeadingSlash(removeTrailingSlash(str));
}

export const normalizeString = (string?: string): string => {
  if (string === undefined) return '';
  return string
    .replace(/\//g, '')
    .replace(/-/g, ' ')
    .replace(/[æÆ]/g, 'ae')
    .replace(/[øØ]/g, 'o')
    .replace(/[åÅ]/g, 'a')
    .toLowerCase();
};

export function menuItemComparator(a: MenuItem, b: MenuItem) {
  if (!a.title || !b.title) {
    console.error('Missing title in frontmatter:', a, b);
  }

  // Category landing pages should always appear first within their subcategory
  // Since there can only be one per category, we can use a simple boolean check
  if (a.isCategoryLandingPage !== b.isCategoryLandingPage) {
    return a.isCategoryLandingPage ? -1 : 1;
  }

  const menuItemAOrder = a.order ? a.order : 1000;
  const menuItemBOrder = b.order ? b.order : 1000;

  if (menuItemAOrder !== menuItemBOrder) {
    return menuItemAOrder - menuItemBOrder;
  }

  const titleA = (a.title || '').toUpperCase();
  const titleB = (b.title || '').toUpperCase();

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
  oversikt: 1,
  ressurser: 2,
  knapper: 3,
  skjemaelementer: 4,
  navigasjon: 5,
  'layout & flater': 6,
  feedback: 7,
  reise: 8,
} as any;

export const komIGangMenuSortOrder = {
  introduksjon: 1,
  'for designere': 2,
  'for utviklere': 3,
} as any;

export const visuellIdentitetMenuSortOrder = {
  introduksjon: 1,
  verktoykassen: 2,
  maler: 3,
} as any;

export const monsterMenuSortOrder = {
  oversikt: 1,
  monster: 2,
} as any;

export const ressurserMenuSortOrder = {
  oversikt: 1,
  workshopmaler: 2,
  innsikt: 3,
} as any;

export const tokensMenuSortOrder = {
  introduksjon: 1,
  fargetokens: 2,
  storrelsetokens: 3,
  'ovrige tokens': 4,
} as any;

export const sortSubCategoriesForCategory = (
  subcategoryA: string,
  subcategoryB: string,
  category: string,
) => {
  const normalizedCategory = normalizeString(category);
  const normalizedSubcategoryA = normalizeString(subcategoryA);
  const normalizedSubcategoryB = normalizeString(subcategoryB);

  const aSortOrder =
    sorters[normalizedCategory]?.[normalizedSubcategoryA] || 10;
  const bSortOrder =
    sorters[normalizedCategory]?.[normalizedSubcategoryB] || 10;
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

export { getSanitizedPath };
