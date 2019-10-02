const svgr = require('@svgr/rollup').default;
const ts = require('@wessberg/rollup-plugin-ts');

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
  rollup(config, opts) {
    config.plugins = [svgr(svgrConfig), ...config.plugins];
    // swap out rollup-plugin-typescript2
    config.plugins = config.plugins.map(p => {
      if (p && p.name === 'rpt2') {
        return ts({
          tsconfig: tsconfig => {
            return {
              ...tsconfig,
              target: 'ESNext',
              sourceMap: true,
              declaration: true,
            };
          },
          transpiler: 'babel',
        });
      }
      return p;
    });
    return { ...config };
  },
};
