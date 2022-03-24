const sass = require('rollup-plugin-sass');
const postcss = require('postcss');
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
