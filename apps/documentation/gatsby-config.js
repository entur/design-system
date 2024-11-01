// eslint-disable-next-line @typescript-eslint/no-var-requires
const Path = require('path');

console.log('PATH', Path.resolve(__dirname, '../../../node_modules'));
console.log('PATH2', Path.resolve(__dirname));

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        sassOptions: {
          includePaths: [Path.resolve(__dirname, '../../../node_modules')],
        },
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `changelogs`,
        path: `${__dirname}/changelogs/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `downloads`,
        path: `${__dirname}/src/gatsby-theme-docz/downloads/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `media`,
        path: `${__dirname}/src/gatsby-theme-docz/media/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `icons`,
        path: `${__dirname}/icons/`,
      },
    },
    'gatsby-transformer-remark',
  ],
};
