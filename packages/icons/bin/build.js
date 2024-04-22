const svgr = require('@svgr/core').default;
const toCase = require('case');
const fs = require('fs-extra');
const path = require('path');
const sass = require('sass');

const { colors } = require('@entur/tokens');

/**
 * Deprecated icons, mapped to their possible replacements.
 * If an icon is deprecated without a replacement, it is mapped to no value,
 * and you can still check for deprecation using `deprecatedIcons.has(iconName)`.
 */
const deprecatedIcons = new Map([
  ['ReportsIcon', 'CopyIcon'],
  ['SubwayIcon', 'MetroIcon'],
  ['ScooterIcon', 'MobilityIcon'],
  ['WalkingIcon', 'WalkIcon'],
  ['OutlinedValidationCheckIcon', 'ValidationCheckIcon'],
  ['OutlinedValidationErrorIcon', 'ValidationErrorIcon'],
  ['OutlinedValidationExclamationIcon', 'ValidationExclamationIcon'],
  ['OutlinedValidationInfoIcon', 'ValidationInfoIcon'],
  ['ValidationCheckIcon', 'ValidationSuccessIcon'],
  ['ValidationCheckFilledIcon', 'ValidationSuccessFilledIcon'],
]);

// Should always be white
const partnerIcons = [
  'AKTIcon',
  'AtBIcon',
  'BrakarIcon',
  'BrakarNoTextIcon',
  'FarteIcon',
  'FlybussenIcon',
  'GOAIcon',
  'HykeIcon',
  'InnlandstrafikkIcon',
  'KolumbusIcon',
  'OstfoldIcon',
  'RuterIcon',
  'RuterNoTextIcon',
  'SJIcon',
  'SkyssIcon',
  'SkyssNoTextIcon',
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
  'GetAroundIcon',
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
  'AmericanExpressIcon',
  'MastercardIcon',
  'VippsIcon',
  'VippsLogoIcon',
  'VisaIcon',
  'CompassNeedleIcon',
  ...partnerIcons,
];

const components = traverse('src/svgs').map(svgPath => {
  // Check for .DS_Store to clarify confusing error message
  if (svgPath.endsWith('.DS_Store')) {
    // eslint-disable-next-line no-undef
    console.error(
      '\nWARNING: You have a .DS_Store file among your svgs, please remove it. Path:',
      svgPath,
      '\n',
    );
  }
  const name = getComponentNameFromSvgPath(svgPath);
  const isDeprecated = deprecatedIcons.has(name);
  const replacement = deprecatedIcons.get(name);
  return { name, svgPath, isDeprecated, replacement };
});

for (const component of components) {
  // Read the SVG, optimize it with SVGO, and transpile it to React components
  // for both the web and React Native
  outputWebCode(component);
  outputNativeCode(component);
}

createIndexFiles(components);
createTypeDeclaration(components);
createStyleFiles();

function outputWebCode(component) {
  const { name, svgPath } = component;
  const rawSvgText = fs.readFileSync(svgPath, 'utf-8');
  const webCode = svgr.sync(rawSvgText, createSvgrConfig(false, name), {
    componentName: name,
  });
  const afterPossibleDeprecations = addDeprecationWarnings(webCode, component);
  fs.outputFileSync(`./tmp/web/${name}.js`, afterPossibleDeprecations);
}

/** Add deprecation warnings if an icon is deprecated */
function addDeprecationWarnings(webCode, { isDeprecated, name, replacement }) {
  if (isDeprecated) {
    const webCodeList = webCode.split(`\n`);

    const functionDeclarationLine = webCodeList.findIndex(line =>
      /^function/.test(line),
    );

    const deprecationMessage = getDeprecationMessage(name, replacement);
    const jsdocInsertionPoint = functionDeclarationLine;
    const numberOfLinesThatTheFunctionDeclarationTakesUp = 1;
    const consoleLogInsertionPoint =
      functionDeclarationLine + numberOfLinesThatTheFunctionDeclarationTakesUp;

    return [
      ...webCodeList.slice(0, jsdocInsertionPoint),
      createDeprecatedJsdocComment(deprecationMessage),
      ...webCodeList.slice(jsdocInsertionPoint, consoleLogInsertionPoint),
      `console.warn('Design system warning: ${deprecationMessage}');`,
      ...webCodeList.slice(consoleLogInsertionPoint),
    ].join(`\n`);
  }
  return webCode;
}

function outputNativeCode({ name: componentName, svgPath }) {
  const rawSvgText = fs.readFileSync(svgPath, 'utf-8');
  const nativeCode = svgr.sync(rawSvgText, createSvgrConfig(true), {
    componentName,
  });
  fs.outputFileSync(`./tmp/native/${componentName}.js`, nativeCode);
}

function createIndexFiles(components) {
  const indexFile = components
    .map(({ name }) => `export { default as ${name} } from './${name}';`)
    .join('\n');
  fs.outputFileSync(`./tmp/web/index.js`, indexFile);
  fs.outputFileSync(`./tmp/native/index.js`, indexFile);
  // create a default index as well, which exposes the web interface by default
  fs.outputFileSync(`./tmp/index.js`, "export * from './web';\n");
}

function createTypeDeclaration(components) {
  const typingsPreamble = fs.readFileSync('./types/index.d.ts').toString();
  const componentTypeLines = components.flatMap(
    ({ name, isDeprecated, replacement }) => {
      const typeDeclaration = `export declare const ${name}: React.FC<IconProps>;`;
      if (isDeprecated) {
        const deprecationMessage = getDeprecationMessage(name, replacement);
        const jsdocComment = createDeprecatedJsdocComment(deprecationMessage);
        return [jsdocComment, typeDeclaration];
      }
      return typeDeclaration;
    },
  );
  const typingsFile = [typingsPreamble, ...componentTypeLines].join('\n');
  fs.ensureDirSync('./dist');
  fs.outputFileSync(`./dist/index.d.ts`, typingsFile);
}

function createStyleFiles() {
  fs.ensureDirSync('./dist');
  // finally, let's copy over the static assets if you need those directly
  try {
    const result = sass.compile('./src/index.scss', {
      loadPaths: ['../../node_modules'],
    });
    fs.outputFileSync('./dist/styles.css', result.css);
  } catch (e) {
    console.error(
      '\u001b[31mERROR: Icon build failed.\n------------------\u001b[0m\n',
      e,
    );
    throw '@entur/icons failed!';
  }
}

/** Traverses a directory
 * returns an array of all file paths
 */
function traverse(directory, dirEnt = '') {
  const entryName = dirEnt ? dirEnt.name : '';
  const completePath = path.resolve(directory, entryName);
  if (dirEnt && dirEnt.isFile()) {
    return completePath;
  }
  const directoryContent = fs.readdirSync(completePath, {
    withFileTypes: true,
  });
  return directoryContent.flatMap(nextDirEnt =>
    traverse(completePath, nextDirEnt),
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
      [colors.brand.blue.toUpperCase()]: 'currentColor',
      [colors.transport.default.bus.toUpperCase()]: 'currentColor',
      [colors.transport.default.metro.toUpperCase()]: 'currentColor',
      [colors.transport.default.tram.toUpperCase()]: 'currentColor',
      [colors.transport.default.train.toUpperCase()]: 'currentColor',
      [colors.transport.default.ferry.toUpperCase()]: 'currentColor',
      [colors.transport.default.plane.toUpperCase()]: 'currentColor',
      [colors.transport.default.cableway.toUpperCase()]: 'currentColor',
    };
  } else {
    /** Get icon-name, and if it has a transport color, add it as class to component */
    const lowerCaseName = componentName
      .substring(0, componentName.length - 4)
      .toLowerCase();
    let className =
      '{"eds-icon " + (props.className || "") + (props.inline ? " eds-icon--inline" : "")}';
    let color = `{(props.color || "currentColor")}`;

    if (outliers.includes(componentName)) {
      className = `{(props.color ? "eds-icon " : "") + "eds-icon__${componentName} " + (props.className || "") + (props.inline ? " eds-icon--inline" : "")}`;
      color = `{(props.color)}`;
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

/** Get a PascalCased version of a file name to use as the component name, and suffix it with "Icon" */
function getComponentNameFromSvgPath(svgPath) {
  const componentName = path
    .basename(svgPath)
    .replace('.svg', 'Icon')
    .replace(/\s/g, '');
  return toCase.pascal(componentName);
}

/** Constructs human-readable deprecation message, referring to a possible replacement if one exists */
function getDeprecationMessage(name, replacement) {
  if (replacement) {
    return `${name} is deprecated; use ${replacement} instead`;
  }
  return `${name} is deprecated`;
}

/** Creates a JSdoc comment with a single deprecation message */
function createDeprecatedJsdocComment(explanation) {
  return `/** @deprecated ${explanation} */`;
}
