// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const fs = require('fs-extra');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const fetch = require('node-fetch');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const crypto = require('crypto');

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const oldConfig = getConfig();
  const editedConfig = getConfig();

  editedConfig.resolve.alias = {
    ...editedConfig.resolve.alias,
    '~': path.resolve(__dirname, '../src/'),
  };

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

exports.onPreBootstrap = () => {
  fs.ensureDirSync(`${__dirname}/changelogs/`);
  fs.ensureDirSync(`${__dirname}/icons/`);
  for (let changelogPackage in packages) {
    fs.copyFileSync(
      path.resolve(`../../packages/${packages[changelogPackage]}/CHANGELOG.md`),
      `${__dirname}/changelogs/${packages[changelogPackage]}.md`,
    );
  }
  fs.copySync('../../packages/icons/src/svgs', `${__dirname}/icons/`);
};

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
          type: 'NpmPackage',
          contentDigest: crypto
            .createHash('md5')
            .update(result['dist-tags'].latest)
            .digest('hex'),
        },
      });
    }),
  );
};
