const path = require('path');
const fs = require('fs-extra');

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
