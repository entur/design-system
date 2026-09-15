// Published @entur/* packages, used as the option list for componentDoc.npmPackage.
// The value is the key without the scope, which is what the documentation site prefixes.
// Mirrors the non-private packages in packages/* — update when one is added or removed:
//   for f in packages/*/package.json; do node -p "const p=require('./$f'); p.private ? '' : p.name"; done | grep . | sort
export const NPM_PACKAGES = [
  { title: '@entur/a11y', value: 'a11y' },
  { title: '@entur/alert', value: 'alert' },
  { title: '@entur/button', value: 'button' },
  { title: '@entur/chip', value: 'chip' },
  { title: '@entur/datepicker', value: 'datepicker' },
  { title: '@entur/dropdown', value: 'dropdown' },
  { title: '@entur/expand', value: 'expand' },
  { title: '@entur/fileupload', value: 'fileupload' },
  { title: '@entur/form', value: 'form' },
  { title: '@entur/grid', value: 'grid' },
  { title: '@entur/icons', value: 'icons' },
  { title: '@entur/layout', value: 'layout' },
  { title: '@entur/loader', value: 'loader' },
  { title: '@entur/menu', value: 'menu' },
  { title: '@entur/modal', value: 'modal' },
  { title: '@entur/tab', value: 'tab' },
  { title: '@entur/table', value: 'table' },
  { title: '@entur/tokens', value: 'tokens' },
  { title: '@entur/tooltip', value: 'tooltip' },
  { title: '@entur/travel', value: 'travel' },
  { title: '@entur/typography', value: 'typography' },
  { title: '@entur/utils', value: 'utils' },
];
