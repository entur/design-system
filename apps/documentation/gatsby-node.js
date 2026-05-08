// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const fs = require('fs-extra');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const fetch = require('node-fetch');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const crypto = require('crypto');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const { spawn } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const { getSanitizedPath } = require('./src/utils/getSanitizedPath');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const {
  generateLlmsTxt,
  generateLlmsFullTxt,
} = require('./src/utils/generate-llms-txt');

let propGenerationPromise = null;
let playgroundBuildPromise = null;

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const oldConfig = getConfig();
  const editedConfig = getConfig();

  editedConfig.resolve.alias = {
    ...editedConfig.resolve.alias,
    '~': path.resolve(__dirname, '../src/'),
  };

  // Our MDX-plugin makes it hard to maintain CSS order,
  // we therefore turn on ignoreOrder for mini-css-extract-plugin.
  if (Array.isArray(editedConfig.plugins)) {
    editedConfig.plugins.forEach(plugin => {
      if (
        plugin &&
        plugin.constructor &&
        plugin.constructor.name === 'MiniCssExtractPlugin'
      ) {
        plugin.options = {
          ...plugin.options,
          ignoreOrder: true,
        };
      }
    });
  }

  actions.replaceWebpackConfig({ ...oldConfig, ...editedConfig });
};

const packages = [
  'a11y',
  'alert',
  'button',
  'chip',
  'datepicker',
  'dropdown',
  'expand',
  'fileupload',
  'form',
  'grid',
  'icons',
  'layout',
  'loader',
  'menu',
  'modal',
  'tab',
  'table',
  'tokens',
  'tooltip',
  'travel',
  'typography',
  'utils',
];

exports.onPreInit = () => {
  if (process.argv[2] !== 'build') return;

  if (!process.env.SKIP_PROPS_GENERATION) {
    propGenerationPromise = new Promise((resolve, reject) => {
      const proc = spawn('yarn', ['generate-props'], {
        stdio: 'inherit',
        shell: true,
        cwd: __dirname,
      });
      proc.on('error', reject);
      proc.on('close', code =>
        code === 0
          ? resolve()
          : reject(new Error(`generate-props exited with code ${code}`)),
      );
    });
  }

  playgroundBuildPromise = new Promise((resolve, reject) => {
    const proc = spawn('yarn', ['build'], {
      stdio: 'inherit',
      shell: true,
      cwd: path.join(__dirname, '../code-playground'),
    });
    proc.on('error', reject);
    proc.on('close', code =>
      code === 0
        ? resolve()
        : reject(new Error(`code-playground build exited with code ${code}`)),
    );
  });
};

exports.onPreBuild = async () => {
  if (propGenerationPromise) await propGenerationPromise;
};

exports.onPreBootstrap = () => {
  fs.ensureDirSync(`${__dirname}/dist/changelogs/`);
  fs.ensureDirSync(`${__dirname}/dist/icons/`);

  for (let changelogPackage in packages) {
    fs.copyFileSync(
      path.resolve(`../../packages/${packages[changelogPackage]}/CHANGELOG.md`),
      `${__dirname}/dist/changelogs/${packages[changelogPackage]}.md`,
    );
  }

  // Copy icons to dist/icons directory for Gatsby source filesystem
  fs.copySync('../../packages/icons/src/svgs', `${__dirname}/dist/icons/`);
};

async function createDocumentationPagesFromSanity(graphql, actions, reporter) {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allSanityPage {
        nodes {
          id
          title
          description
          category
          subcategory
          isCategoryLandingPage
          tag
        }
      }
      allSanityComponentDoc {
        nodes {
          id
          title
          description
          category
          subcategory
          npmPackage
          tag
        }
      }
      allMdx {
        nodes {
          id
          frontmatter {
            title
            description
            route
            npmPackage
          }
          parent {
            ... on File {
              sourceInstanceName
            }
          }
        }
      }
    }
  `);

  if (result.errors) throw result.errors;

  const pages = (result.data.allSanityPage || {}).nodes || [];
  const componentDocs = (result.data.allSanityComponentDoc || {}).nodes || [];
  const mdxNodes = (result.data.allMdx || {}).nodes || [];

  const llmsPages = [];

  pages.forEach(page => {
    const id = page.id;
    const pagePath = getSanitizedPath({
      title: page.title,
      category: page.category,
      subcategory: page.subcategory,
      isCategoryLandingPage: page.isCategoryLandingPage,
      tag: page.tag ?? undefined,
    });

    createPage({
      path: pagePath,
      component: require.resolve('./src/templates/ContentTemplate.tsx'),
      context: { id },
    });

    llmsPages.push({
      title: page.title,
      description: page.description || '',
      category: page.category || '',
      subcategory: page.subcategory || '',
      path: pagePath,
      npmPackage: null,
    });
  });
  reporter.info(`[create page] Created ${pages.length} documentation pages`);

  componentDocs.forEach(doc => {
    const id = doc.id;
    const docPath = getSanitizedPath({
      title: doc.title,
      category: doc.category,
      subcategory: doc.subcategory,
      tag: doc.tag ?? undefined,
    });

    createPage({
      path: docPath,
      component: require.resolve('./src/templates/ComponentDocTemplate.tsx'),
      context: { id },
    });

    llmsPages.push({
      title: doc.title,
      description: doc.description || '',
      category: doc.category || '',
      subcategory: doc.subcategory || '',
      path: docPath,
      npmPackage: doc.npmPackage || null,
    });
  });
  reporter.info(
    `[create page] Created ${componentDocs.length} component documentation pages`,
  );

  mdxNodes
    .filter(node => node.parent?.sourceInstanceName === 'pages')
    .forEach(node => {
      const route = node.frontmatter?.route;
      if (!route) return;
      const parts = route.replace(/^\//, '').split('/');
      llmsPages.push({
        title: node.frontmatter?.title || route,
        description: node.frontmatter?.description || '',
        category: parts[0] || '',
        subcategory: parts[1] || '',
        path: route,
        npmPackage: node.frontmatter?.npmPackage || null,
      });
    });

  fs.ensureDirSync(`${__dirname}/dist`);
  fs.writeJsonSync(`${__dirname}/dist/llms-page-data.json`, llmsPages);
  reporter.info(`[llms.txt] Collected ${llmsPages.length} pages for llms.txt`);
}

exports.sourceNodes = async ({ createNodeId, actions: { createNode } }) => {
  // get data from GitHub API at build time
  await Promise.all(
    packages.map(async thePackage => {
      const data = await fetch(
        `https://registry.npmjs.org/@entur/${thePackage}`,
      );
      const result = await data.json();
      createNode({
        name: thePackage,
        parent: '__SOURCE__',
        children: [],
        id: createNodeId(thePackage),
        version: result['dist-tags'].latest,
        internal: {
          type: 'NpmPackageVersion',
          contentDigest: crypto
            .createHash('md5')
            .update(result['dist-tags'].latest)
            .digest('hex'),
        },
      });
    }),
  );
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createRedirect } = actions;

  createRedirect({
    fromPath: '/komponenter/navigasjon/breadcrumbs',
    toPath: '/komponenter/navigasjon/breadcrumbnavigation',
  });

  await createDocumentationPagesFromSanity(graphql, actions, reporter);
};

const SKILLS_FILES = [
  {
    label: 'Getting Started',
    file: 'entur-web-development/references/getting-started.md',
  },
  {
    label: 'Component Reference',
    file: 'entur-web-development/references/components.md',
  },
  {
    label: 'Design Tokens & CSS Variables',
    file: 'entur-web-development/references/tokens-and-variables.md',
  },
  { label: 'Colors', file: 'entur-brand-design/references/colors.md' },
  {
    label: 'Typography',
    file: 'entur-brand-design/references/typography.md',
  },
  {
    label: 'Visual Identity',
    file: 'entur-brand-design/references/visual-identity.md',
  },
  {
    label: 'Accessibility Patterns',
    file: 'entur-accessibility/references/entur-a11y-patterns.md',
  },
];

exports.onPostBuild = async ({ reporter }) => {
  const pageDataPath = path.join(__dirname, 'dist', 'llms-page-data.json');
  if (!fs.existsSync(pageDataPath)) {
    reporter.warn(
      '[llms.txt] No page data found, skipping llms.txt generation',
    );
    return;
  }

  const pages = fs.readJsonSync(pageDataPath);
  const skillsDir = path.resolve(__dirname, '../../skills');

  const skillsFiles = SKILLS_FILES.map(({ label: fileLabel, file }) => {
    const filePath = path.join(skillsDir, file);
    const content = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, 'utf8')
      : '';
    return { label: fileLabel, content };
  }).filter(({ content }) => content);

  const llmsTxt = generateLlmsTxt(pages);
  const llmsFullTxt = generateLlmsFullTxt(pages, skillsFiles);

  const publicDir = path.join(__dirname, 'public');
  fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsTxt);
  fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), llmsFullTxt);

  reporter.info('[llms.txt] Generated /llms.txt and /llms-full.txt');

  if (playgroundBuildPromise) {
    await playgroundBuildPromise;
    const sandkasseDir = path.join(publicDir, 'sandkasse');
    fs.ensureDirSync(sandkasseDir);
    fs.copySync(
      path.join(__dirname, '../code-playground/public/playroom'),
      sandkasseDir,
    );
    reporter.info('[playground] Copied code-playground build to /sandkasse');
  }
};
