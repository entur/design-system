export type MenuItem = {
  id: string;
  title: string;
  category?: string;
  subcategory?: string;
  order?: number;
  hide?: boolean;
  // not yet implemented
  categoryIndex?: boolean;
};

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
}: MenuItem) {
  function sanitizeText(text?: string) {
    if (!text) return undefined;
    return text
      .toLowerCase()
      .replace('æ', 'ae')
      .replace('ø', 'o')
      .replace('å', 'a')
      .replace(/ +/g, '-');
  }

  const sanitizedCategory = sanitizeText(category);
  if (categoryIndex) return `/${sanitizedCategory}`;

  const sanitizedTitle = sanitizeText(title);
  if (!subcategory) return `/${sanitizedCategory}/${sanitizedTitle}`;

  const sanitizedSubcategory = sanitizeText(subcategory);
  return `/${sanitizedCategory}/${sanitizedSubcategory}/${sanitizedTitle}`;
}
