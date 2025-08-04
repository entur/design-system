import * as icons from '@entur/icons';

export function pxToRem(pxValue: number | undefined) {
  if (pxValue === undefined) return undefined;
  const rootFontSize = window.getComputedStyle(document.body)?.['font-size'] as
    | string
    | undefined;
  const rootFontNumber = parseInt(
    /(\d+)px$/gm.exec(rootFontSize ?? '')?.[0] ?? '',
  );
  if (isNaN(rootFontNumber)) {
    console.error('Could not get root font size');
    return pxValue / 16;
  }

  const remValue = pxValue / rootFontNumber;
  return remValue;
}

type IconName = keyof typeof icons;

export function getIconByName(iconName: string | undefined) {
  if (iconName === undefined) return null;
  if (Object.keys(icons).includes(iconName)) return icons[iconName as IconName];

  return null;
}

export function isEnturIcon(iconName: string): iconName is keyof typeof icons {
  return iconName in icons;
}

export function getSanitizedPath({
  category,
  subcategory,
  title,
  categoryIndex,
}: {
  category: string;
  subcategory?: string;
  title: string;
  categoryIndex?: number;
}) {
  function sanitizeText(text: string) {
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
  if (categoryIndex) return `/${sanitizedCategory}`;

  const sanitizedTitle = sanitizeText(title);
  if (!subcategory) return `/${sanitizedCategory}/${sanitizedTitle}`;

  const sanitizedSubcategory = sanitizeText(subcategory);
  return `/${sanitizedCategory}/${sanitizedSubcategory}/${sanitizedTitle}`;
}
