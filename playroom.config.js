module.exports = {
  components: './playroom/components.ts',
  outputPath: './dist/playroom',

  // Optional:
  title: 'TestBench',
  frameComponent: './playroom/FrameComponent.tsx',
  widths: [1300],
  port: 9000,
  openBrowser: true,
  paramType: 'search', // default is 'hash'
  exampleCode: `
    <div>
    </div>
  `,
  baseUrl: '/playroom/',
  webpackConfig: conf => {
    return {
      module: {
        rules: [
          {
            oneOf: [
              {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: require.resolve('babel-loader'),
                  options: {
                    presets: [
                      require.resolve('@babel/preset-env'),
                      require.resolve('@babel/preset-react'),
                      require.resolve('@babel/preset-typescript'),
                    ],
                    plugins: [
                      require.resolve(
                        '@babel/plugin-proposal-class-properties',
                      ),
                      require.resolve(
                        '@babel/plugin-proposal-optional-chaining',
                      ),
                      require.resolve(
                        '@babel/plugin-proposal-nullish-coalescing-operator',
                      ),
                    ],
                  },
                },
              },
              {
                test: /\.css$/,
                exclude: [
                  /node_modules\/(?!(@entur.+)\/).*/,
                  /node_modules(\/|\\)(?!(@entur.+)(\/|\\)).*/,
                ],
                use: [
                  require.resolve('style-loader'),
                  require.resolve('css-loader'),
                ],
              },

              {
                test: /\.scss$/,
                use: [
                  require.resolve('style-loader'),
                  {
                    loader: require.resolve('css-loader'),
                    options: {
                      importLoaders: 3,
                      sourceMap: true,
                    },
                  },
                  {
                    loader: require.resolve('sass-loader'),
                    options: {
                      sourceMap: true,
                    },
                  },
                ],
                sideEffects: true,
              },
              {
                loader: require.resolve('file-loader'),
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
    };
  },
  iframeSandbox: 'allow-scripts',
};
