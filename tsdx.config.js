const sass = require('rollup-plugin-sass');

module.exports = {
  rollup(config) {
    config.plugins.push(sass({ output: 'dist/styles.css' }));
    return config;
  },
};
