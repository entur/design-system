module.exports = {
  components: './src/components.ts',
  outputPath: './public/playroom',

  title: 'Linje lekerom',
  snippets: './src/snippets.ts',
  frameComponent: './src/FrameComponent.tsx',
  widths: [320, 768, 1024],
  port: 9000,
  openBrowser: true,
  paramType: 'search',
  baseUrl: '/playroom/',
  webpackConfig: () => ({
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
            },
            {
              test: /\.scss$/,
              use: [
                'style-loader',
                'css-loader',
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: true,
                    api: 'modern-compiler',
                  },
                },
              ],
              sideEffects: true,
            },
            {
              loader: 'file-loader',
              exclude: [
                /node_modules\/(?!(@entur.+)\/).*/,
                /node_modules(\/|\\)(?!(@entur.+)(\/|\\)).*/,
                /\.(js|mjs|jsx|css|scss|ts|tsx)$/,
              ],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
  }),
  exampleCode: `
  <Button>
    Hello World!
  </Button>
`,
  iframeSandbox: 'allow-scripts',
  defaultVisibleWidths: [
    // subset of widths to display on first load
  ],
  defaultVisibleThemes: [
    // subset of themes to display on first load
  ],
};
