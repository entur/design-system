import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    postcssPresetEnv({
      features: {
        'logical-properties-and-values': false,
      },
    }),
  ],
};
