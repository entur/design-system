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
  baseUrl: '/sandkasse/',
  webpackConfig: () => ({
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.tsx?$/,
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: 'defaults' }],
                      ['@babel/preset-react', { runtime: 'automatic' }],
                      '@babel/preset-typescript',
                    ],
                  },
                },
              ],
              exclude: /node_modules\/(?!playroom)/,
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
    resolve: {
      alias: {
        // Ensure React is properly deduplicated
        react: require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
        'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
        'react-dom/client': require.resolve('react-dom/client'),
      },
      fallback: {
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
        'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
        'react-dom/client': require.resolve('react-dom/client'),
      },
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  }),
  exampleCode: `{(() => {
    const title = 'Velkommen til Linje sandkasse! 🎨';
  
    return (
      <div>
        <Heading1>{title}</Heading1>
        <UnorderedList>
          <ListItem>Skriv JSX med komponentene fra designsystemet</ListItem>
          <ListItem>Bruk snippets til høyre (+)</ListItem>
          <ListItem>Du kan skru på mørk modus og kontrast over</ListItem>
        </UnorderedList>
      </div>
    );
  })()}`,
  iframeSandbox: 'allow-scripts',
  defaultVisibleWidths: ['Fit to window'],
  defaultVisibleThemes: [
    // subset of themes to display on first load
  ],
};
