const svgr = require('@svgr/rollup').default;
const sass = require('rollup-plugin-sass');

const svgrConfig = {
  icon: true,
  replaceAttrValues: {
    '#181E53': 'currentColor',
    '#181C56': 'currentColor',
  },
  svgProps: {
    className:
      '{"entur-icon " + (props.className ? props.className : "") + (props.inline ? " entur-icon--inline" : "")}',
    inline: '{undefined}',
  },
  expandProps: 'start',
};

module.exports = {
  rollup(config, opts) {
    config.plugins.unshift(svgr(svgrConfig));
    config.plugins.unshift(sass({ output: 'dist/styles.css' }));
    return config;
  },
};
