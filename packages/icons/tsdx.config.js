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
      '{"eds-icon " + (props.className ? props.className : "") + (props.inline ? " eds-icon--inline" : "")}',
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
