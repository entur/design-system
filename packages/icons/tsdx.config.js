const svgr = require('@svgr/rollup').default;
const ts = require('@wessberg/rollup-plugin-ts');
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
    config.plugins = [
      svgr(svgrConfig),
      sass({ output: 'dist/styles.css' }),
      ...config.plugins,
    ];
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
