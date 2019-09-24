/*
This is the SVGO plugin configuration
It lists all options, and you can tweak as you see fit.

If you want to change these, you'll find descriptions and source links here:
https://github.com/svg/svgo#what-it-can-do
 */
const plugins = [
  { cleanupAttrs: true },
  { inlineStyles: true },
  { removeDoctype: true },
  { removeXMLProcInst: true },
  { removeComments: true },
  { removeMetadata: true },
  { removeTitle: true },
  { removeDesc: true },
  { removeUselessDefs: true },
  { removeXMLNS: true },
  { removeEditorsNSData: true },
  { removeEmptyAttrs: true },
  { removeHiddenElems: true },
  { removeEmptyText: true },
  { removeEmptyContainers: true },
  { removeViewBox: false },
  { cleanupEnableBackground: true },
  { minifyStyles: true },
  { convertStyleToAttrs: true },
  {
    convertColors: {
      // The icon set has two very similar colors - #181E53 and #181C56
      // This regex makes sure we switch out both with "currentColor"
      currentColor: /#181(E53|C56)/i,
    },
  },
  { convertPathData: true },
  { convertTransform: true },
  { removeUnknownsAndDefaults: true },
  { removeNonInheritableGroupAttrs: true },
  { removeUselessStrokeAndFill: true },
  { removeUnusedNS: true },
  { prefixIds: false },
  { cleanupIDs: true },
  { cleanupNumericValues: true },
  { cleanupListOfValues: true },
  { moveElemsAttrsToGroup: true },
  { moveGroupAttrsToElems: true },
  { collapseGroups: true },
  { removeRasterImages: true },
  { mergePaths: true },
  { convertShapeToPath: true },
  { convertEllipseToCircle: true },
  { sortAttrs: true },
  { sortDefsChildren: true },
  { removeDimensions: true },
  { removeAttrs: true },
  { removeAttributesBySelector: false },
  { removeElementsByAttr: false },
  { addAttributesToSVGElement: false },
  { removeOffCanvasPaths: true },
  { removeStyleElement: true },
  { removeScriptElement: true },
  { mergePaths: false },
];

export default {
  plugins,
};
