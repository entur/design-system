// Published @entur/* packages, used as the option list for componentDoc.npmPackage.
// Mirrors the non-private packages in packages/* — update when one is added or removed:
//   for f in packages/*/package.json; do node -p "const p=require('./$f'); p.private ? '' : p.name"; done | grep . | sort
export const NPM_PACKAGES = [
  '@entur/a11y',
  '@entur/alert',
  '@entur/button',
  '@entur/chip',
  '@entur/datepicker',
  '@entur/dropdown',
  '@entur/expand',
  '@entur/fileupload',
  '@entur/form',
  '@entur/grid',
  '@entur/icons',
  '@entur/layout',
  '@entur/loader',
  '@entur/menu',
  '@entur/modal',
  '@entur/tab',
  '@entur/table',
  '@entur/tokens',
  '@entur/tooltip',
  '@entur/travel',
  '@entur/typography',
  '@entur/utils',
];
