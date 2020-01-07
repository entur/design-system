import warning from 'tiny-warning';

const packagesToCheck: Set<string> = new Set();
let checkTimeoutId: number;

function checkAndWarn() {
  const missingImports = Array.from(packagesToCheck)
    .filter(
      namespace =>
        parseInt(
          window
            .getComputedStyle(document.documentElement)
            .getPropertyValue(`--eds-${namespace}`),
        ) !== 1,
    )
    .sort();

  // Finally, we warn about those pesky imports
  const singleMissingImport = missingImports.length === 1;
  warning(
    missingImports.length === 0,
    `You are missing ${
      singleMissingImport
        ? 'a CSS import'
        : `${missingImports.length} CSS imports`
    }!

Please add the following CSS import${
      singleMissingImport ? '' : 's'
    } somewhere in your app:

${missingImports
  .map(namespace => `\t@import '~@entur/${namespace}/dist/styles';`)
  .join('\n')}
`,
  );
}

/** Warns the developer if they have forgotten to include styles */
export function warnAboutMissingStyles(...namespaces: string[]) {
  // We skip this check in production, and when we build static sites
  if (!__DEV__ || typeof window === 'undefined') {
    return;
  }
  // First, let's clear earlier calls to setTimeout
  window.clearTimeout(checkTimeoutId);

  // Next, let's add all namespaces to the set of packages to check
  namespaces.forEach(namespace => packagesToCheck.add(namespace));

  // Finally. let's trigger a run of the checker.
  checkTimeoutId = window.setTimeout(checkAndWarn, 1000);
}
