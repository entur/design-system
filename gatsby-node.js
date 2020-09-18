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
  for (package in packages) {
    fs.copyFileSync(
      path.resolve(`../packages/${packages[package]}/CHANGELOG.md`),
      `${__dirname}/changelogs/${packages[package]}.md`,
    );
  }
};

exports.sourceNodes = async ({ actions: { createNode } }) => {
  // get data from GitHub API at build time
  for (package in packages) {
    const data = await fetch(
      `https://registry.npmjs.org/@entur/${packages[package]}`,
    );
    const result = await data.json();
    createNode({
      name: packages[package],
      parent: `__SOURCE__`,
      children: [],
      id: packages[package] + package,
      version: result['dist-tags'].latest,
      internal: {
        type: 'NpmPackage',
        contentDigest: crypto
          .createHash(`md5`)
          .update(packages[package])
          .digest(`hex`),
      },
    });
  }
};
