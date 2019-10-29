import { VariableFormat } from 'src/components/SettingsContext';

/**
 * Takes a dot notation path and returns it in the preferred format.
 */
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
