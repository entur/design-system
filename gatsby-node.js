const path = require('path');
const fs = require('fs-extra');
const fetch = require(`node-fetch`);
const crypto = require('crypto');

exports.onCreateWebpackConfig = args => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        '~': path.resolve(__dirname, '../src/'),
      },
    },
  });
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
];

exports.onPreBootstrap = ({}) => {
  fs.ensureDirSync(`${__dirname}/changelogs/`);
  fs.ensureDirSync(`${__dirname}/icons/`);
  for (let changelogPackage in packages) {
    fs.copyFileSync(
      path.resolve(`../packages/${packages[changelogPackage]}/CHANGELOG.md`),
      `${__dirname}/changelogs/${packages[changelogPackage]}.md`,
    );
  }
  fs.ensureDirSync('../../src/gatsby-theme-docz/svgs');
  fs.copySync('../packages/icons/src/svgs', `${__dirname}/icons/`);
};

exports.sourceNodes = async ({ actions: { createNode } }) => {
  // get data from GitHub API at build time
  await Promise.all(
    packages.map(async (package, index) => {
      const data = await fetch(`https://registry.npmjs.org/@entur/${package}`);
      const result = await data.json();
      createNode({
        name: package,
        parent: `__SOURCE__`,
        children: [],
        id: package + index,
        version: result['dist-tags'].latest,
        internal: {
          type: 'NpmPackage',
          contentDigest: crypto
            .createHash(`md5`)
            .update(result['dist-tags'].latest)
            .digest(`hex`),
        },
      });
    }),
  );
};
