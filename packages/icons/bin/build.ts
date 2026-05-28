import toCase from 'case';
import fs from 'fs-extra';
import path from 'path';
import sass from 'sass';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';
import { loadConfig } from 'svgo';
import { Config, transform } from '@svgr/core';
import { colors, transport } from '@entur/tokens';
import template from './template';

type Component = {
  name: string;
  svgPath: string;
  isDeprecated?: boolean;
  deprecationMessage?: string;
  categories: string[];
};

type DeprecatedIcon = {
  oldName: string;
  replacementName?: string;
  customMessage?: string;
};

const DEPRECATED_ICONS: DeprecatedIcon[] = [
  { oldName: 'BellIcon', replacementName: 'AlertIcon' },
  {
    oldName: 'BrakarNoTextIcon',
    replacementName: 'BrakarSymbolMonoIcon',
    customMessage:
      'BrakarNoTextIcon is deprecated; use BrakarSymbolMonoIcon for monochrome, BrakarSymbolIcon for color symbol, or BrakarLogoIcon for full logo',
  },
  {
    oldName: 'TromsFylkestrafikkIcon',
    replacementName: 'TromsLogoMonoIcon',
    customMessage:
      'TromsFylkestrafikkIcon is deprecated; use TromsLogoMonoIcon for monochrome or TromsLogoIcon for brand colors',
  },
  {
    oldName: 'HafjellIcon',
    replacementName: 'HafjellbussenLogoIcon',
    customMessage:
      'HafjellIcon is deprecated; use HafjellbussenLogoIcon for brand colors or HafjellbussenLogoMonoIcon for monochrome',
  },
  {
    oldName: 'OttoMobilityIcon',
    replacementName: 'OttoLogoIcon',
    customMessage:
      'OttoMobilityIcon is deprecated; use OttoLogoIcon for brand colors or OttoLogoMonoIcon for monochrome',
  },
  {
    oldName: 'RuterNoTextIcon',
    replacementName: 'RuterSymbolMonoIcon',
    customMessage:
      'RuterNoTextIcon is deprecated; use RuterSymbolMonoIcon for monochrome, RuterSymbolIcon for color symbol, or RuterLogoIcon for full logo',
  },
  {
    oldName: 'SkyssNoTextIcon',
    replacementName: 'SkyssSymbolMonoIcon',
    customMessage:
      'SkyssNoTextIcon is deprecated; use SkyssSymbolMonoIcon for monochrome, SkyssSymbolIcon for color symbol, or SkyssLogoIcon for full logo',
  },
  {
    oldName: 'BaneNORIcon',
    replacementName: 'BaneNORLogoMonoIcon',
    customMessage:
      'BaneNORIcon is deprecated; use BaneNORLogoMonoIcon for monochrome',
  },
  // Naming oddities fixed up
  {
    oldName: 'GOAColorIcon',
    replacementName: 'GOALogoIcon',
    customMessage:
      'GOAColorIcon is deprecated; use GOALogoIcon for brand colors or GOALogoMonoIcon for monochrome',
  },
  {
    oldName: 'ReisNordlandIcon',
    replacementName: 'ReisNordlandLogoMonoIcon',
    customMessage:
      'ReisNordlandIcon is deprecated; use ReisNordlandLogoMonoIcon for monochrome or ReisNordlandLogoIcon for brand colors',
  },
  {
    oldName: 'ReisNordlandColorIcon',
    replacementName: 'ReisNordlandLogoIcon',
    customMessage:
      'ReisNordlandColorIcon is deprecated; use ReisNordlandLogoIcon for brand colors or ReisNordlandLogoMonoIcon for monochrome',
  },
  {
    oldName: 'SJNordIcon',
    replacementName: 'SJNordLogoMonoIcon',
    customMessage:
      'SJNordIcon is deprecated; use SJNordLogoMonoIcon for monochrome',
  },
  // Old root Partner/ icons (were currentColor logos, now split into LogoMono/Logo)
  {
    oldName: 'AKTIcon',
    replacementName: 'AKTLogoMonoIcon',
    customMessage:
      'AKTIcon is deprecated; use AKTLogoMonoIcon for monochrome or AKTLogoIcon for brand colors',
  },
  {
    oldName: 'AlesundTurvognIcon',
    replacementName: 'AlesundTurvognLogoMonoIcon',
    customMessage:
      'AlesundTurvognIcon is deprecated; use AlesundTurvognLogoMonoIcon for monochrome or AlesundTurvognLogoIcon for brand colors',
  },
  {
    oldName: 'AtBIcon',
    replacementName: 'AtBLogoMonoIcon',
    customMessage:
      'AtBIcon is deprecated; use AtBLogoMonoIcon for monochrome or AtBLogoIcon for brand colors',
  },
  {
    oldName: 'BrakarIcon',
    replacementName: 'BrakarLogoMonoIcon',
    customMessage:
      'BrakarIcon is deprecated; use BrakarLogoMonoIcon for monochrome or BrakarLogoIcon for brand colors',
  },
  {
    oldName: 'FarteIcon',
    replacementName: 'FarteLogoMonoIcon',
    customMessage:
      'FarteIcon is deprecated; use FarteLogoMonoIcon for monochrome or FarteLogoIcon for brand colors',
  },
  {
    oldName: 'FlybussenIcon',
    replacementName: 'FlybussenLogoMonoIcon',
    customMessage:
      'FlybussenIcon is deprecated; use FlybussenLogoMonoIcon for monochrome or FlybussenLogoIcon for brand colors',
  },
  {
    oldName: 'FramIcon',
    replacementName: 'FramLogoMonoIcon',
    customMessage:
      'FramIcon is deprecated; use FramLogoMonoIcon for monochrome or FramLogoIcon for brand colors',
  },
  {
    oldName: 'GOAIcon',
    replacementName: 'GOALogoMonoIcon',
    customMessage:
      'GOAIcon is deprecated; use GOALogoMonoIcon for monochrome or GOALogoIcon for brand colors',
  },
  {
    oldName: 'HykeIcon',
    replacementName: 'HykeLogoMonoIcon',
    customMessage:
      'HykeIcon is deprecated; use HykeLogoMonoIcon for monochrome or HykeLogoIcon for brand colors',
  },
  {
    oldName: 'InnlandstrafikkIcon',
    replacementName: 'InnlandstrafikkLogoMonoIcon',
    customMessage:
      'InnlandstrafikkIcon is deprecated; use InnlandstrafikkLogoMonoIcon for monochrome or InnlandstrafikkLogoIcon for brand colors',
  },
  {
    oldName: 'KolumbusIcon',
    replacementName: 'KolumbusLogoMonoIcon',
    customMessage:
      'KolumbusIcon is deprecated; use KolumbusLogoMonoIcon for monochrome or KolumbusLogoIcon for brand colors',
  },
  {
    oldName: 'NordlandIcon',
    replacementName: 'NordlandLogoMonoIcon',
    customMessage:
      'NordlandIcon is deprecated; use NordlandLogoMonoIcon for monochrome or NordlandLogoIcon for brand colors',
  },
  {
    oldName: 'OstfoldIcon',
    replacementName: 'OstfoldLogoMonoIcon',
    customMessage:
      'OstfoldIcon is deprecated; use OstfoldLogoMonoIcon for monochrome or OstfoldLogoIcon for brand colors',
  },
  {
    oldName: 'RuterIcon',
    replacementName: 'RuterLogoMonoIcon',
    customMessage:
      'RuterIcon is deprecated; use RuterLogoMonoIcon for monochrome or RuterLogoIcon for brand colors',
  },
  {
    oldName: 'SJIcon',
    replacementName: 'SJLogoMonoIcon',
    customMessage:
      'SJIcon is deprecated; use SJLogoMonoIcon for monochrome or SJLogoIcon for brand colors',
  },
  {
    oldName: 'SkyssIcon',
    replacementName: 'SkyssLogoMonoIcon',
    customMessage:
      'SkyssIcon is deprecated; use SkyssLogoMonoIcon for monochrome or SkyssLogoIcon for brand colors',
  },
  {
    oldName: 'SnelandiaIcon',
    replacementName: 'SnelandiaLogoMonoIcon',
    customMessage:
      'SnelandiaIcon is deprecated; use SnelandiaLogoMonoIcon for monochrome or SnelandiaLogoIcon for brand colors',
  },
  {
    oldName: 'SvipperIcon',
    replacementName: 'SvipperLogoMonoIcon',
    customMessage:
      'SvipperIcon is deprecated; use SvipperLogoMonoIcon for monochrome or SvipperLogoIcon for brand colors',
  },
  {
    oldName: 'VKTIcon',
    replacementName: 'VKTLogoMonoIcon',
    customMessage:
      'VKTIcon is deprecated; use VKTLogoMonoIcon for monochrome or VKTLogoIcon for brand colors',
  },
  {
    oldName: 'VyIcon',
    replacementName: 'VyLogoMonoIcon',
    customMessage:
      'VyIcon is deprecated; use VyLogoMonoIcon for monochrome or VyLogoIcon for brand colors',
  },
  {
    oldName: 'ØresundstågIcon',
    replacementName: 'OresundstagLogoMonoIcon',
    customMessage:
      'ØresundstågIcon is deprecated; use OresundstagLogoMonoIcon for monochrome or OresundstagLogoIcon for brand colors',
  },
  // Old Mobility/ icons (moved to Logo/)
  {
    oldName: 'BergenBysykkelIcon',
    replacementName: 'BergenBysykkelLogoMonoIcon',
    customMessage:
      'BergenBysykkelIcon is deprecated; use BergenBysykkelLogoMonoIcon for monochrome or BergenBysykkelLogoIcon for brand colors',
  },
  {
    oldName: 'BoltIcon',
    replacementName: 'BoltLogoMonoIcon',
    customMessage:
      'BoltIcon is deprecated; use BoltLogoMonoIcon for monochrome or BoltLogoIcon for brand colors',
  },
  {
    oldName: 'FarteBysykkelIcon',
    replacementName: 'FarteBysykkelLogoMonoIcon',
    customMessage:
      'FarteBysykkelIcon is deprecated; use FarteBysykkelLogoMonoIcon for monochrome or FarteBysykkelLogoIcon for brand colors',
  },
  {
    oldName: 'GetAroundIcon',
    replacementName: 'GetAroundLogoMonoIcon',
    customMessage:
      'GetAroundIcon is deprecated; use GetAroundLogoMonoIcon for monochrome or GetAroundLogoIcon for brand colors',
  },
  {
    oldName: 'HertzIcon',
    replacementName: 'HertzLogoMonoIcon',
    customMessage:
      'HertzIcon is deprecated; use HertzLogoMonoIcon for monochrome or HertzLogoIcon for brand colors',
  },
  {
    oldName: 'KolumbusBysykkelIcon',
    replacementName: 'KolumbusBysykkelLogoMonoIcon',
    customMessage:
      'KolumbusBysykkelIcon is deprecated; use KolumbusBysykkelLogoMonoIcon for monochrome or KolumbusBysykkelLogoIcon for brand colors',
  },
  {
    oldName: 'LimeIcon',
    replacementName: 'LimeLogoMonoIcon',
    customMessage:
      'LimeIcon is deprecated; use LimeLogoMonoIcon for monochrome or LimeLogoIcon for brand colors',
  },
  {
    oldName: 'MoveAboutIcon',
    replacementName: 'MoveAboutLogoMonoIcon',
    customMessage:
      'MoveAboutIcon is deprecated; use MoveAboutLogoMonoIcon for monochrome or MoveAboutLogoIcon for brand colors',
  },
  {
    oldName: 'OsloBysykkelIcon',
    replacementName: 'OsloBysykkelLogoMonoIcon',
    customMessage:
      'OsloBysykkelIcon is deprecated; use OsloBysykkelLogoMonoIcon for monochrome or OsloBysykkelLogoIcon for brand colors',
  },
  {
    oldName: 'SURFIcon',
    replacementName: 'SurfLogoMonoIcon',
    customMessage:
      'SURFIcon is deprecated; use SurfLogoMonoIcon for monochrome or SurfLogoIcon for brand colors',
  },
  {
    oldName: 'TierIcon',
    replacementName: 'TierLogoMonoIcon',
    customMessage:
      'TierIcon is deprecated; use TierLogoMonoIcon for monochrome or TierLogoIcon for brand colors',
  },
  {
    oldName: 'TrondheimBysykkelIcon',
    replacementName: 'TrondheimBysykkelLogoMonoIcon',
    customMessage:
      'TrondheimBysykkelIcon is deprecated; use TrondheimBysykkelLogoMonoIcon for monochrome or TrondheimBysykkelLogoIcon for brand colors',
  },
  {
    oldName: 'VoiIcon',
    replacementName: 'VoiLogoMonoIcon',
    customMessage:
      'VoiIcon is deprecated; use VoiLogoMonoIcon for monochrome or VoiLogoIcon for brand colors',
  },
  {
    oldName: 'ZvippIcon',
    replacementName: 'ZvippLogoMonoIcon',
    customMessage:
      'ZvippIcon is deprecated; use ZvippLogoMonoIcon for monochrome or ZvippLogoIcon for brand colors',
  },
];

// These icons should not use brand-blue by default
const OUTLIER_CATEGORIES = [
  'Partner',
  'Flag',
  'Entur',
  'NonPartnerLogo',
  'Payment',
];
const SPECIAL_OUTLIERS = ['CompassNeedleIcon'];

buildIconComponents();

async function buildIconComponents() {
  const components = traverse('src/svgs').flatMap((svgPath: string) => {
    // Remove .DS_Store files automatically
    if (svgPath.endsWith('.DS_Store')) {
      fs.removeSync(svgPath);
      console.log('Removed .DS_Store file:', svgPath);
      return [];
    }
    const name = getComponentNameFromSvgPath(svgPath);
    const categories = svgPath
      .split('svgs')?.[1]
      .split('/')
      .filter(
        (category: string) => category !== '' && !category.includes('.svg'),
      );
    const deprecationInfo = DEPRECATED_ICONS.find(d => d.oldName === name);
    const isDeprecated = deprecationInfo !== undefined;
    const deprecationMessage = isDeprecated
      ? deprecationInfo.customMessage ??
        getDeprecationMessage(name, deprecationInfo.replacementName)
      : undefined;
    return {
      name,
      svgPath,
      isDeprecated,
      deprecationMessage,
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
  createWebIndex();
  await createStyleFiles();
}

async function outputComponentCode({
  component,
  native,
}: {
  component: Component;
  native?: boolean;
}) {
  const { name, svgPath } = component;
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
  { isDeprecated, deprecationMessage }: Component,
) {
  if (isDeprecated && deprecationMessage) {
    const webCodeList = webCode.split(`\n`);

    const functionDeclarationLine = webCodeList.findIndex(line =>
      /^function/.test(line),
    );

    const jsdocInsertionPoint = functionDeclarationLine;
    const consoleLogInsertionPoint = functionDeclarationLine + 1;

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
    ({ name, isDeprecated, deprecationMessage }) => {
      const typeDeclaration = `export declare const ${name}: React.FC<IconProps & React.SVGProps<SVGElement>>;`;
      if (isDeprecated && deprecationMessage) {
        return [
          createDeprecatedJsdocComment(deprecationMessage),
          typeDeclaration,
        ];
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

function createWebIndex() {
  // Create a temporary web index that rollup will consume (styles are compiled separately)
  fs.ensureDirSync('./tmp/web');
  // nothing else needed; rollup uses tmp/web/index.js created above
}

async function createStyleFiles() {
  fs.ensureDirSync('./dist');
  try {
    const result = sass.compile('./src/index.scss', {
      loadPaths: ['../../node_modules'],
    });
    const processed = await postcss([postcssPresetEnv({})]).process(
      result.css,
      { from: undefined },
    );
    fs.outputFileSync('./dist/styles.css', processed.css);
  } catch (e) {
    console.error(
      '\u001b[31mERROR: Icon style build failed.\n------------------\u001b[0m\n',
      e,
    );
    throw '@entur/icons styles failed!';
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
    inline: '{undefined}',
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
