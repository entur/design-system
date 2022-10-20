const fs = require('fs-extra');
const path = require('path');
const toCase = require('case');
const babel = require('@babel/core');
const svgr = require('@svgr/core').default;
const { colors } = require('@entur/tokens');
var sass = require('node-sass');

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
function createSvgrConfig(native = false, componentName) {
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
      width: '{(props.width || props.size || 16)}',
      height: '{(props.height || props.size || 16)}',
    };

    config.replaceAttrValues = {
      [`${colors.brand.blue.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.bus.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.metro.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.tram.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.train.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.ferry.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.plane.toUpperCase()}`]: 'currentColor',
      [`${colors.transport.default.cableway.toUpperCase()}`]: 'currentColor',
    };
  } else {
    // Should always be white
    const partnerIcons = [
      'BrakarIcon',
      'BrakarNoTextIcon',
      'FarteIcon',
      'GOAIcon',
      'InnlandstrafikkIcon',
      'KolumbusIcon',
      'OstfoldIcon',
      'RuterIcon',
      'SJIcon',
      'SkyssIcon',
      'VKTIcon',
      'VyIcon',
      // Mobility Partners
      'BergenBysykkelIcon',
      'BoltIcon',
      'KolumbusBysykkelIcon',
      'LimeIcon',
      'MoveAboutIcon',
      'OsloBysykkelIcon',
      'TierIcon',
      'TrondheimBysykkelIcon',
      'VoiIcon',
      'ZvippIcon',
    ];
    // Icons with "special colors", so no color exchange for those
    const outliers = [
      'NorwayIcon',
      'UKIcon',
      'SwedenIcon',
      'DenmarkIcon',
      'SamiIcon',
      'LogoNegativeIcon',
      'LogoPositiveIcon',
      'MastercardIcon',
      'VippsIcon',
      'VippsLogoIcon',
      'VisaIcon',
      ...partnerIcons,
    ];

    /** Get icon-name, and if it has a transport color, add it as class to component */
    const lowerCaseName = componentName
      .substring(0, componentName.length - 4)
      .toLowerCase();
    let className =
      '{"eds-icon " + (props.className || "") + (props.inline ? " eds-icon--inline" : "")}';
    let color = `{(props.color || "currentColor")}`;

    if (outliers.includes(componentName)) {
      className = `{"eds-icon__${componentName} " + (props.className || "") + (props.inline ? " eds-icon--inline" : "")}`;
    }
    if (componentName && colors.transport.contrast[lowerCaseName]) {
      className = `{(!props.color ? "eds-icon eds-icon__${lowerCaseName} " : "eds-icon") + (props.className || "") + (props.inline ? " eds-icon--inline" : "")}`;
      color = `{(props.color || "${colors.transport.default[lowerCaseName]}")}`;
    }

    config.svgProps = {
      width: '{(props.width || props.size || "1em")}',
      height: '{(props.height || props.size || "1em")}',
      className: className,
      inline: '{undefined}',
      color: color,
    };
  }
  return config;
}

// Get all SVGs
const allSvgPaths = traverse('src/svgs');
const componentNames = [];
const deprecatedIcons = [{ icon: 'ReportsIcon', replacement: 'CopyIcon' }];

for (let svgPath of allSvgPaths) {
  // Get a PascalCased version of the file name to use as the component name,
  // and suffix it with "Icon"
  let componentName = path
    .basename(svgPath)
    .replace('.svg', 'Icon')
    .replace(/\s/g, '');
  componentName = toCase.pascal(componentName);

  // Check for .DS_Store to clarify confusing error message
  if (componentName === 'DSStore') {
    // eslint-disable-next-line no-undef
    console.error(
      '\nWARNING: You have a .DS_Store file among your svgs, please remove it. Path:',
      svgPath,
      '\n',
    );
  }

  // Read the SVG, optimize it with SVGO, and transpile it to React components
  // for both the web and React Native
  const rawSvgText = fs.readFileSync(svgPath, 'utf-8');

  const webCode = svgr.sync(
    rawSvgText,
    createSvgrConfig(false, componentName),
    {
      componentName,
    },
  );
  const nativeCode = svgr.sync(rawSvgText, createSvgrConfig(true), {
    componentName,
  });

  // If the icon is deprecated, we add a warning to the component code
  if (deprecatedIcons.map(e => e.icon).includes(componentName)) {
    const replacement = deprecatedIcons.filter(e => e.icon === componentName)[0]
      .replacement;
    const webCodeList = webCode.split(`\n`);
    const WebCodeWithDeprecation = [
      ...webCodeList.slice(0, 2),
      `console.warn("Design system warning: ${componentName} is deprecated! ${
        replacement ? `Use ${replacement} instead.` : ''
      }");`,
      `/**
* @deprecated This icon is deprecated
*/`,
      ...webCodeList.slice(2),
    ].join(`\n`);
    fs.outputFileSync(`./tmp/web/${componentName}.js`, WebCodeWithDeprecation);
  } // If not deprecated, we create the component without changes
  else {
    fs.outputFileSync(`./tmp/web/${componentName}.js`, webCode);
  }

  fs.outputFileSync(`./tmp/native/${componentName}.js`, nativeCode);

  // Save the component name in an array for use below
  componentNames.push(componentName);
}

fs.ensureDirSync('./dist');
// Create index files for both the web and RN components
let indexFile = '';
let typingsFile = '';
let typingsTemplate = fs.readFileSync('./types/index.d.ts').toString();
typingsFile += `${typingsTemplate}\n`;
for (let componentName of componentNames) {
  indexFile += `export { default as ${componentName} } from './${componentName}';\n`;
  typingsFile += `export declare const ${componentName}: React.FC<IconProps>;\n`;
}
fs.outputFileSync(`./tmp/web/index.js`, indexFile);
fs.outputFileSync(`./tmp/native/index.js`, indexFile);
fs.outputFileSync(`./dist/index.d.ts`, typingsFile);

// create a default index as well, which exposes the web interface by default
fs.outputFileSync(`./tmp/index.js`, "export * from './web';\n");

// finally, let's copy over the static assets if you need those directly
sass.render(
  {
    file: './src/index.scss',
  },
  function (err, result) {
    if (!err) {
      fs.outputFileSync('./dist/styles.css', result.css);
    } else {
      throw 'Icon-Build Failed';
    }
  },
);
