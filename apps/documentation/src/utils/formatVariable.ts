import { VariableFormat } from '~/components/SettingsContext';

/**
 * Takes a dot notation path and returns it in the preferred format.
 */
// Deprecate
export const formatVariable = (
  /** The dot-notation path to turn into a variable */
  dotNotationPath: string,
  /** The variable format gotten from useSettings */
  variableFormat: VariableFormat,
) => {
  const kebabCasedPath = dotNotationPath
    .replace(/\./g, '-') // replaces . with -
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2') // camelCase to kebab-case
    .toLowerCase();

  switch (variableFormat) {
    case 'scss':
      return `$${kebabCasedPath}`;
    case 'less':
      return `@${kebabCasedPath}`;
    case 'css':
      return `var(--${kebabCasedPath})`;
    case 'js':
      return dotNotationPath;
  }
};

export const formatDotToVariable = (
  /** The dot-notation path to turn into a variable */
  dotNotationPath: string,
) => {
  let modifiedPath = dotNotationPath;

  // Check for 'baseColors' and replace it with 'basecolors'
  if (modifiedPath.includes('baseColors')) {
    modifiedPath = modifiedPath.replace('baseColors', 'basecolors');
  }

  const kebabCasedPath = modifiedPath
    .replace(/\./g, '-') // replaces . with -
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // camelCase to kebab-case
    .replace(/_/g, '-') // replaces _ with -
    .toLowerCase();

  return kebabCasedPath;
};

// the primitive color tokens have different format, like blue._10. Maybe fix this in the future?
export const formatVariablePrimitive = (
  /** The dot-notation path to turn into a variable */
  dotNotationPath: string,
) => {
  const kebabCasedPath = dotNotationPath
    .replace(/\./g, '-') // replaces . with -
    .replace(/_/g, '') // replaces _ with nothing
    .toLowerCase();

  return kebabCasedPath;
};

export const formatVariableByType = (
  /** The variable format gotten from useSettings */
  variableFormat: VariableFormat,
  /** The formatted variable to turn into correct formattype */
  formattedVariable: string,
) => {
  switch (variableFormat) {
    case 'scss':
      return `$${formattedVariable}`;
    case 'less':
      return `@${formattedVariable}`;
    case 'css':
      return `var(--${formattedVariable})`;
    case 'js':
      return formattedVariable;
  }
};

export const formatTokenValue = (value: string | number): string => {
  if (typeof value === 'number') {
    return `${value}px (${value / 16}rem)`;
  }
  return value;
};

export const sliceTokenKey = (
  categoryKey: string,
  partsToSlice: number,
): string => {
  const parts = categoryKey.split('-');
  const remainingParts = parts.slice(partsToSlice);
  const result = remainingParts.join('-');
  return result.charAt(0) + result.slice(1);
};
