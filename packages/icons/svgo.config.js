/*
This is the SVGO plugin configuration
It lists all options, and you can tweak as you see fit.

If you want to change these, you'll find descriptions and source links here:
https://github.com/svg/svgo#what-it-can-do
 */
const plugins = [
  { name: 'cleanupAttrs' },
  { name: 'inlineStyles' },
  { name: 'removeDoctype' },
  { name: 'removeXMLProcInst' },
  { name: 'removeComments' },
  { name: 'removeMetadata' },
  { name: 'removeTitle' },
  { name: 'removeDesc' },
  { name: 'removeUselessDefs' },
  { name: 'removeXMLNS' },
  { name: 'removeEditorsNSData' },
  { name: 'removeEmptyAttrs' },
  { name: 'removeHiddenElems' },
  { name: 'removeEmptyText' },
  { name: 'removeEmptyContainers' },
  { name: 'cleanupEnableBackground' },
  { name: 'minifyStyles' },
  { name: 'convertStyleToAttrs' },
  { name: 'convertPathData' },
  { name: 'convertTransform' },
  { name: 'removeUnknownsAndDefaults' },
  { name: 'removeNonInheritableGroupAttrs' },
  { name: 'removeUselessStrokeAndFill' },
  { name: 'removeUnusedNS' },
  { name: 'cleanupIds' },
  { name: 'cleanupNumericValues' },
  { name: 'cleanupListOfValues' },
  { name: 'moveElemsAttrsToGroup' },
  { name: 'moveGroupAttrsToElems' },
  { name: 'collapseGroups' },
  { name: 'removeRasterImages' },
  { name: 'mergePaths' },
  { name: 'convertShapeToPath' },
  { name: 'convertEllipseToCircle' },
  { name: 'sortAttrs' },
  { name: 'sortDefsChildren' },
  { name: 'removeDimensions' },
  { name: 'removeOffCanvasPaths' },
  { name: 'removeStyleElement' },
  { name: 'removeScriptElement' },
  {
    name: 'convertColors',
    params: {
      shorthex: false, // Prevents shortening (e.g., #ffffff → #fff)
      shortname: false, // Prevents named colors (e.g., `black` → `#000000`)
    },
  },
];

module.exports = {
  plugins,
};
