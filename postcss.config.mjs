import postcssPresetEnv from 'postcss-preset-env';
import discardComments from 'postcss-discard-comments';

export default {
  plugins: [
    postcssPresetEnv({
      features: {
        'logical-properties-and-values': false,
        'cascade-layers': false,
      },
    }),
    discardComments({
      remove: c =>
        /DO NOT CHANGE!|automatically generated from @entur\/tokens/i.test(c),
    }),
  ],
};
