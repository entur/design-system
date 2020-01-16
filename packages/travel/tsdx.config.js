const sass = require('rollup-plugin-sass');
const copy = require('rollup-plugin-copy-assets');
const typescript = require('rollup-plugin-typescript2');

module.exports = {
  rollup(config) {
    // TODO for code review: En måte å extende tsdx.confic.js fra rotnivå
    // For så å legge til copy her
    config.plugins.push(
      typescript({
        typescript: require('typescript'),
        objectHashIgnoreUnknownHack: true,
      }),
    );
    config.plugins.push(copy({ assets: ['src/pattern'] }));
    config.plugins.push(sass({ output: 'dist/styles.css' }));
    return config;
  },
};
