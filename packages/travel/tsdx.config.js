const sass = require('rollup-plugin-sass');
const copy = require('rollup-plugin-copy-assets');
const rpts2 = require('rollup-plugin-typescript2');

module.exports = {
  rollup(config) {
    // TODO for code review: En måte å extende tsdx.confic.js fra rotnivå
    // For så å legge til copy her
    config.plugins = config.plugins.map(plugin => {
      if (plugin && plugin.name === 'rpt2') {
        return rpts2({
          // properties that I added for demonstration purposes
          clean: true,
          objectHashIgnoreUnknownHack: true,
        });
      }

      return plugin;
    });
    config.plugins.push(copy({ assets: ['src/pattern'] }));
    config.plugins.push(sass({ output: 'dist/styles.css' }));
    return config;
  },
};
