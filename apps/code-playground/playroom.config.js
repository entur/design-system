module.exports = {
  components: './src/components.ts',
  outputPath: './dist',

  // Optional:
  title: 'TestBench',
  frameComponent: './src/FrameComponent.tsx',
  widths: [1200, 700, 500, 350],
  port: 9000,
  openBrowser: true,
  paramType: 'search', // default is 'hash'
  snippets: './src/snippets.ts',
  exampleCode: `
    <div>
    </div>
  `,
  baseUrl: '/',
  webpackConfig: () => {
    return {
      module: {
        rules: [
          {
            oneOf: [
              {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      '@babel/preset-env',
                      '@babel/preset-react',
                      '@babel/preset-typescript',
                    ],
                    plugins: [
                      '@babel/plugin-proposal-class-properties',
                      '@babel/plugin-proposal-optional-chaining',
                      '@babel/plugin-proposal-nullish-coalescing-operator',
                    ],
                  },
                },
              },
              {
                test: /\.css$/,
                include: [
                  /src\/.*/,
                  /playroom\/.*/,
                  /packages\/.*/,
                  /node_modules\/react-datepicker\/.*/,
                ],
                use: ['style-loader', 'css-loader'],
              },

              {
                test: /\.scss$/,
                use: [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                      importLoaders: 3,
                      sourceMap: true,
                    },
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      sourceMap: true,
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
    };
  },
  iframeSandbox: 'allow-scripts allow-forms allow-same-origin',
};
