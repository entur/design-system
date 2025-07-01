module.exports = {
  components: './src/components.ts',
  outputPath: './public/playroom',

  title: 'Linje lekerom',
  snippets: './src/snippets/index.ts',
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
  exampleCode: `<Paragraph>Velkommen til Linje lekerom! 🎨</Paragraph>
  <ListItem>Skriv JSX med komponentene fra designsystemet</ListItem>
  <ListItem>Bruk snippets til høyre (+)</ListItem>
  <ListItem>Du kan skru på mørk modus og kontrast over</ListItem>`,
  iframeSandbox: 'allow-scripts',
  defaultVisibleWidths: [
    // subset of widths to display on first load
  ],
  defaultVisibleThemes: [
    // subset of themes to display on first load
  ],
};
