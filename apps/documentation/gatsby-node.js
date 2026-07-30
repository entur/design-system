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

// Commit subjects may contain bare tags like <dialog>, which MDX parses as JSX
// and fails on. Escape < outside code fences and inline code.
const escapeMdxTags = markdown =>
  markdown
    .split(/(^```[\s\S]*?^```$)/m)
    .map((block, index) =>
      index % 2 === 1
        ? block
        : block
            .split(/(`[^`\n]*`)/)
            .map((part, i) => (i % 2 === 1 ? part : part.replace(/</g, '&lt;')))
            .join(''),
    )
    .join('');

exports.onPreBootstrap = () => {
  fs.ensureDirSync(`${__dirname}/dist/changelogs/`);
  fs.ensureDirSync(`${__dirname}/dist/icons/`);

  for (let changelogPackage in packages) {
    const changelog = fs.readFileSync(
      path.resolve(`../../packages/${packages[changelogPackage]}/CHANGELOG.md`),
      'utf8',
    );
    fs.writeFileSync(
      `${__dirname}/dist/changelogs/${packages[changelogPackage]}.md`,
      escapeMdxTags(changelog),
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

// Router first, then each sub-skill with its own references, so llms-full.txt reads top-down.
const SKILL_ORDER = [
  'entur-linje',
  'entur-web-development',
  'entur-accessibility',
  'entur-brand-design',
];

/**
 * Collects every SKILL.md and references/*.md under skills/, in reading order.
 * Walking the directory rather than keeping a list means a new reference file is
 * published without a matching edit here.
 */
const collectSkillFiles = (skillsDir, reporter) => {
  if (!fs.existsSync(skillsDir)) {
    reporter.warn(`[llms.txt] No skills directory at ${skillsDir}`);
    return [];
  }

  const present = fs
    .readdirSync(skillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const ordered = [
    ...SKILL_ORDER.filter(name => present.includes(name)),
    ...present.filter(name => !SKILL_ORDER.includes(name)).sort(),
  ];

  const collected = [];

  for (const skill of ordered) {
    const files = [path.join(skillsDir, skill, 'SKILL.md')];
    const referencesDir = path.join(skillsDir, skill, 'references');
    if (fs.existsSync(referencesDir)) {
      files.push(
        ...fs
          .readdirSync(referencesDir)
          .filter(name => name.endsWith('.md'))
          .sort()
          .map(name => path.join(referencesDir, name)),
      );
    }

    for (const filePath of files) {
      if (!fs.existsSync(filePath)) {
        reporter.warn(`[llms.txt] Skill file missing: ${filePath}`);
        continue;
      }
      const content = fs.readFileSync(filePath, 'utf8');
      // The first heading is the file's own title; fall back to the filename.
      const heading = /^#\s+(.+)$/m.exec(content);
      const label = heading
        ? heading[1].trim()
        : path.basename(filePath, '.md');
      collected.push({ label, content });
    }
  }

  return collected;
};

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

  const skillsFiles = collectSkillFiles(skillsDir, reporter);
  reporter.info(`[llms.txt] Including ${skillsFiles.length} skill files`);

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
