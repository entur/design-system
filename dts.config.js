// eslint-disable-next-line @typescript-eslint/no-var-requires -- disabled when we turned on linting for all files in the project
const path = require('path');
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
        // Api with rollup-plugin-sass has no effect as of Jan 2025 so legacy-js-api warnings are silenced for now
        api: 'modern',
        options: {
          includePaths: [path.resolve(__dirname, 'node_modules')],
          // Remove this when api option works with rollup-plugin-sass
          silenceDeprecations: ['legacy-js-api'],
        },
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
