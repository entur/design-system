module.exports = {
  plugins: [
    'gatsby-plugin-sass',
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
        name: `icons`,
        path: `${__dirname}/icons/`,
      },
    },
    'gatsby-transformer-remark',
  ],
};
