export interface MenuItem {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  categoryIndex?: number;
  isCategoryLandingPage?: boolean;
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
  return string.replace(/\//g, '').replace(/-/g, ' ').toLowerCase();
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

export const sortSubCategoriesForCategory = (
  subcategoryA: string,
  subcategoryB: string,
  category: string,
) => {
  const aSortOrder = sorters[category]?.[subcategoryA] || 10;
  const bSortOrder = sorters[category]?.[subcategoryB] || 10;
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

export function getSanitizedPath({
  category,
  subcategory,
  title,
  categoryIndex,
  isCategoryLandingPage,
}: Pick<
  MenuItem,
  | 'category'
  | 'subcategory'
  | 'title'
  | 'categoryIndex'
  | 'isCategoryLandingPage'
>) {
  function sanitizeText(text?: string) {
    if (!text) return undefined;
    return text
      .toLowerCase()
      .replaceAll('æ', 'ae')
      .replaceAll('ø', 'o')
      .replaceAll('å', 'a')
      .replaceAll('&', 'og')
      .replace(/\?$/, '')
      .replace(/ +/g, '-')
      .replace(/[^a-zA-Z0-9\-]+\-/g, '');
  }

  const sanitizedCategory = sanitizeText(category);

  // If this is a category landing page, return just the category path
  if (isCategoryLandingPage) {
    return `/${sanitizedCategory}`;
  }

  if (categoryIndex) {
    return `/${sanitizedCategory}`;
  }

  const sanitizedTitle = sanitizeText(title);
  if (!subcategory) return `/${sanitizedCategory}/${sanitizedTitle}`;

  const sanitizedSubcategory = sanitizeText(subcategory);
  return `/${sanitizedCategory}/${sanitizedSubcategory}/${sanitizedTitle}`;
}
