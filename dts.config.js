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
            // Having multiple @charset in bundle causes syntax errors so we remove them
            .process(cssWithoutCharset(css), { from: undefined })
            .then(result => result.css + '\n'),
      }),
    );
    return config;
  },
};

function cssWithoutCharset(css) {
  return css.replace('@charset "UTF-8";', '');
}
