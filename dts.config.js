// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const sass = require('rollup-plugin-sass');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const postcss = require('postcss');
// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  rollup(config) {
    config.plugins.unshift(
      sass({
        output: 'dist/styles.css',
        processor: css =>
          postcss([postcssPresetEnv])
            .process(css, { from: undefined })
            .then(result => result.css),
      }),
    );
    return config;
  },
};
