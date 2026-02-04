export type GetSanitizedPathInput = {
  category?: string;
  subcategory?: string;
  title?: string;
  categoryIndex?: number;
  isCategoryLandingPage?: boolean;
  isBeta?: boolean;
};

// Re-export JS implementation for Node/Gatsby compatibility.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getSanitizedPath } = require('./getSanitizedPath.js') as {
  getSanitizedPath: (input: GetSanitizedPathInput) => string | undefined;
};

export { getSanitizedPath };
