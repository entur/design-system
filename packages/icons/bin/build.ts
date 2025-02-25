import toCase from 'case';
import fs from 'fs-extra';
import path from 'path';
import sass from 'sass';
import { loadConfig } from 'svgo';
import { Config, transform } from '@svgr/core';
import { colors, transport } from '@entur/tokens';
import template from './template';

type Component = {
  name: string;
  svgPath: string;
  isDeprecated?: boolean;
  replacement?: string;
  categories: string[];
};

/**
 * Deprecated icons, mapped to their possible replacements.
 * If an icon is deprecated without a replacement, it is mapped to no value,
 * and you can still check for deprecation using `deprecatedIcons.has(iconName)`.
 */
const DEPRECATED_ICONS = new Map([
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

// These icons should not use brand-blue by default
const OUTLIER_CATEGORIES = ['Partner', 'Flag', 'Entur'];
const SPECIAL_OUTLIERS = [
  'AmericanExpressIcon',
  'MastercardIcon',
  'VippsIcon',
  'VippsLogoIcon',
  'VisaIcon',
  'CompassNeedleIcon',
];

buildIconComponents();

function buildIconComponents() {
  const components = traverse('src/svgs').map((svgPath: string) => {
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
    const categories = svgPath
      .split('svgs')?.[1]
      .split('/')
      .filter(
        (category: string) => category !== '' && !category.includes('.svg'),
      );
    const isDeprecated = DEPRECATED_ICONS.has(name);
    const replacement = DEPRECATED_ICONS.get(name);
    return {
      name,
      svgPath,
      isDeprecated,
      replacement,
      categories,
    } as Component;
  });

  for (const component of components) {
    // Read the SVG, optimize it with SVGO, and transpile it to React components
    // for both the web and React Native
    outputComponentCode({ component });
    outputComponentCode({ component, native: true });
  }

  createIndexFiles(components);
  createTypeDeclaration(components);
  createStyleFiles();
}

async function outputComponentCode({
  component,
  native,
}: {
  component: Component;
  native?: boolean;
}) {
  const { name, svgPath, categories } = component;
  const rawSvgText = fs.readFileSync(svgPath, 'utf-8');
  const webCode = await transform(
    rawSvgText,
    await createSvgrConfig({ component, native }),
    {
      componentName: name,
    },
  );
  const outputPath = `./tmp/${native ? 'native' : 'web'}/${name}.js`;
  const componentCodeWithPossibleDeprecation = addDeprecationWarnings(
    webCode,
    component,
  );
  fs.outputFileSync(outputPath, componentCodeWithPossibleDeprecation);
}

/** Add deprecation warnings if an icon is deprecated */
function addDeprecationWarnings(
  webCode: string,
  { isDeprecated, name, replacement }: Component,
) {
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

function createTypeDeclaration(components: Component[]) {
  const typingsPreamble = fs.readFileSync('./types/index.d.ts').toString();
  const componentTypeLines = components.flatMap(
    ({ name, isDeprecated, replacement }) => {
      const typeDeclaration = `export declare const ${name}: React.FC<IconProps & React.SVGProps<SVGElement>>;`;
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

function createIndexFiles(components: Component[]) {
  const indexFile = components
    .map(({ name }) => `export { default as ${name} } from './${name}';`)
    .join('\n');
  fs.outputFileSync('./tmp/web/index.js', indexFile);
  fs.outputFileSync('./tmp/native/index.js', indexFile);
  // create a default index as well, which exposes the web interface by default
  fs.outputFileSync('./tmp/index.js', 'export * from "./web";\n');
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
 * returns an array of all file paths */
function traverse(directory: string, dirEnt?: fs.Dirent) {
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
async function createSvgrConfig({
  component,
  native = false,
}: {
  component: Component;
  native?: boolean;
}) {
  const { name: componentName, categories } = component;
  const svgoConfig = (await loadConfig()) ?? undefined;

  const config: Config = {
    icon: true,
    replaceAttrValues: {
      [`${colors.brand.blue.toUpperCase()}`]: 'currentColor',
    },
    expandProps: 'start',
    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx', '@svgr/plugin-prettier'],
    template,
    native,
    ref: true,
    svgoConfig,
  };

  if (native) {
    const isPartnerIcon = categories.includes('Partner');
    config.svgProps = {
      ...(isPartnerIcon
        ? { color: '{(props.color || "#fff")}' }
        : { color: '{(props.color || "#181C56")}' }),
      width: '{(props.width || props.size || 16)}',
      height: '{(props.height || props.size || 16)}',
    };

    config.replaceAttrValues = {
      ...(isPartnerIcon && {
        // Untill we upgrade to svgo@4 we cannot convert all colors to the same case (convertColors with convertCase is added in v4)
        ['#fff']: 'currentColor',
        ['#FFF']: 'currentColor',
      }),
      [colors.brand.blue.toUpperCase()]: 'currentColor',
      [colors.transport.default.bus.toUpperCase()]: 'currentColor',
      [colors.transport.default.metro.toUpperCase()]: 'currentColor',
      [colors.transport.default.tram.toUpperCase()]: 'currentColor',
      [colors.transport.default.train.toUpperCase()]: 'currentColor',
      [colors.transport.default.ferry.toUpperCase()]: 'currentColor',
      [colors.transport.default.plane.toUpperCase()]: 'currentColor',
      [colors.transport.default.cableway.toUpperCase()]: 'currentColor',
      [colors.transport.default.mobility.toUpperCase()]: 'currentColor',
    };

    return config;
  }

  /** Get icon-name, and if it has a transport color, add it as class to component */
  const lowerCaseName = componentName
    .substring(0, componentName.length - 4)
    .toLowerCase();
  let className = `{"eds-icon " + (props.className || "") + (props.inline ? " eds-icon--inline" : "")}`;
  let color = `{(props.color || "currentColor")}`;

  const isOutlier =
    categories.some((category: string) =>
      OUTLIER_CATEGORIES.includes(category),
    ) || SPECIAL_OUTLIERS.includes(componentName);
  const isTransport = componentName && categories.includes('Transport');

  if (isOutlier) {
    className = `{(props.color ? "eds-icon " : "") + "eds-icon__${componentName} " + (props.className || "") + (props.inline ? " eds-icon--inline" : "")}`;
    color = `{(props.color)}`;
  }
  if (isTransport) {
    className = `{(!props.color ? "eds-icon eds-icon__${lowerCaseName} " : "eds-icon") + (props.className || "") + (props.inline ? " eds-icon--inline" : "")}`;
    color = `{(props.color || "${transport.standard[lowerCaseName]}")}`;
  }

  config.svgProps = {
    width: '{(props.width || props.size || "1em")}',
    height: '{(props.height || props.size || "1em")}',
    className,
    color,
  };

  return config;
}

/** Get a PascalCased version of a file name to use as the component name, and suffix it with "Icon" */
function getComponentNameFromSvgPath(svgPath: string) {
  const componentName = path
    .basename(svgPath)
    .replace('.svg', 'Icon')
    .replace(/\s/g, '');
  return toCase.pascal(componentName);
}

/** Constructs human-readable deprecation message, referring to a possible replacement if one exists */
function getDeprecationMessage(name: string, replacement?: string) {
  if (replacement) return `${name} is deprecated; use ${replacement} instead`;

  return `${name} is deprecated`;
}

/** Creates a JSdoc comment with a single deprecation message */
function createDeprecatedJsdocComment(explanation: string) {
  return `/** @deprecated ${explanation} */`;
}
