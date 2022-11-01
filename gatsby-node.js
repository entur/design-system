// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const fs = require('fs-extra');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const fetch = require(`node-fetch`);
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
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

exports.onPreBootstrap = () => {
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
        parent: `__SOURCE__`,
        children: [],
        id: createNodeId(thePackage),
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

exports.onCreateBabelConfig = ({ actions }) => {
  actions.setBabelPreset({
    /*
     * This preset is necessary to avoid the following error:
     *
     *       ERROR #98123  WEBPACK
     *
     *     Generating SSR bundle failed
     *
     *     /Users/eirikvageskar/design-system/node_modules/docz/dist/index.esm.js: It's not possible to compile spread arguments in `super()` without compiling classes.
     *     Please add '@babel/plugin-transform-classes' to your Babel configuration.
     *       63 |     Provider: (_a = class Provider extends Component {
     *       64 |       constructor() {
     *     > 65 |         super(...arguments);
     *          |         ^^^^^^^^^^^^^^^^^^^
     *       66 |         this.state = this.props.initial || initial || {};
     *       67 |       }
     *       68 |
     *
     *     File: ../node_modules/docz/dist/index.esm.js
     *
     * An alternative is to pin the @babel/plugin-transform-spread to 7.12.1:
     * https://github.com/gatsbyjs/gatsby/issues/29326#issuecomment-773066125
     */
    name: '@babel/preset-env',
    options: {},
  });
};
