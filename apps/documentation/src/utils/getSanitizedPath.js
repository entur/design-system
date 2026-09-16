// Keep in sync with the copy in utils.ts.
function sanitizeText(text) {
  if (!text) return undefined;
  return text
    .toLowerCase()
    .replaceAll('æ', 'ae')
    .replaceAll('ø', 'o')
    .replaceAll('å', 'a')
    .replaceAll('&', 'og')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getSanitizedPath({
  category,
  subcategory,
  title,
  categoryIndex,
  isCategoryLandingPage,
  tag,
}) {
  const sanitizedCategory = sanitizeText(category);

  // If this is a category landing page, return just the category path
  if (isCategoryLandingPage) {
    return `/${sanitizedCategory}`;
  }

  if (categoryIndex) {
    return `/${sanitizedCategory}`;
  }

  const sanitizedTitle = `${sanitizeText(title)}${
    tag?.toLowerCase() === 'beta' ? '/beta' : ''
  }`;
  if (!subcategory) return `/${sanitizedCategory}/${sanitizedTitle}`;

  const sanitizedSubcategory = sanitizeText(subcategory);
  return `/${sanitizedCategory}/${sanitizedSubcategory}/${sanitizedTitle}`;
}

module.exports = {
  getSanitizedPath,
};
