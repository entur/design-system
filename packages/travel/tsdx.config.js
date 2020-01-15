const sass = require('rollup-plugin-sass');
const copy = require('rollup-plugin-copy-assets');
module.exports = {
  rollup(config) {
    // TODO for code review: En måte å extende tsdx.confic.js fra rotnivå
    // For så å legge til copy her
    config.plugins.unshift(sass({ output: 'dist/styles.css' }));
    config.plugins.unshift(copy({ assets: ['src/pattern'] }));
    return config;
  },
};
