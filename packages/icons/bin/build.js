const fs = require('fs-extra');
const path = require('path');
const toCase = require('case');
const babel = require('@babel/core');
const svgr = require('@svgr/core').default;
const { colors } = require('@entur/tokens');

/** Traverses a directory
 * returns an array of all file paths
 */
function traverse(directory, dirEnt = '') {
  const entryName = dirEnt ? dirEnt.name : '';
  const completePath = path.resolve(directory, entryName);
  if (dirEnt && dirEnt.isFile()) {
    return [completePath];
  }
  const directoryContent = fs.readdirSync(completePath, {
    withFileTypes: true,
  });
  return directoryContent
    .map(nextDirEnt => traverse(completePath, nextDirEnt))
    .reduce(
      (acc, next) => (Array.isArray(next) ? [...acc, ...next] : [...acc, next]),
      [],
    );
}

/** Create the correct SVGR config based on its environment */
function createSvgrConfig(native = false) {
  const config = {
    icon: true,
    replaceAttrValues: {
      [`${colors.brand.blue.toUpperCase()}`]: 'currentColor',
    },
    expandProps: 'start',
    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
    native,
  };

  if (native) {
    config.svgProps = {
      color: '{(props.color || "#181C56")}',
      width: '{(props.width || props.size || "1em")}',
      height: '{(props.height || props.size || "1em")}',
    };

    config.replaceAttrValues = {
      [`${colors.brand.blue.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.bus.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.metro.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.tram.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.train.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.ferry.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.plane.toUpperCase()}`]: 'currentColor',
    };
  } else {
    config.svgProps = {
      width: '{(props.width || props.size || "1em")}',
      height: '{(props.height || props.size || "1em")}',
      className:
        '{"eds-icon " + (props.className ? props.className : "") + (props.inline ? " eds-icon--inline" : "")}',
      inline: '{undefined}',
    };
  }
  return config;
}

// Get all SVGs
const allSvgPaths = traverse('src/svgs');
const componentNames = [];

for (let svgPath of allSvgPaths) {
  // Get a PascalCased version of the file name to use as the component name,
  // and suffix it with "Icon"
  let componentName = path
    .basename(svgPath)
    .replace('.svg', 'Icon')
    .replace(/\s/g, '');
  componentName = toCase.pascal(componentName);

  // Read the SVG, optimize it with SVGO, and transpile it to React components
  // for both the web and React Native
  const rawSvgText = fs.readFileSync(svgPath, 'utf-8');
  const webCode = svgr.sync(rawSvgText, createSvgrConfig(false), {
    componentName,
  });
  const nativeCode = svgr.sync(rawSvgText, createSvgrConfig(true), {
    componentName,
  });
  fs.outputFileSync(`./tmp/web/${componentName}.js`, webCode);
  fs.outputFileSync(`./tmp/native/${componentName}.js`, nativeCode);

  // Save the component name in an array for use below
  componentNames.push(componentName);
}

// Create index files for both the web and RN components
let indexFile = '';
for (let componentName of componentNames) {
  indexFile += `export { default as ${componentName} } from './${componentName}';\n`;
}
fs.outputFileSync(`./tmp/web/index.js`, indexFile);
fs.outputFileSync(`./tmp/native/index.js`, indexFile);

// create a default index as well, which exposes the web interface by default
fs.outputFileSync(`./tmp/index.js`, "export * from './web';\n");

// finally, let's copy over the static assets if you need those directly
fs.ensureDirSync('./dist');
fs.copyFileSync('./src/index.css', './dist/styles.css');
