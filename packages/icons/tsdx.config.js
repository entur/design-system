const svgr = require('@svgr/rollup').default;
const ts = require('rollup-plugin-typescript2');

const svgrConfig = {
  icon: true,
  replaceAttrValues: {
    '#181E53': 'currentColor',
    '#181C56': 'currentColor',
  },
  svgProps: {
    className: 'entur-icon',
  },
};

module.exports = {
  rollup(config) {
    config.plugins = [...config.plugins, svgr(svgrConfig)];
    config.plugins = config.plugins.map(plugin => {
      if (plugin && plugin.name === 'rpt2') {
        return ts({
          ...plugin.options,
          objectHashIgnoreUnknownHack: true,
        });
      }
      return plugin;
    });
    return config;
  },
};
