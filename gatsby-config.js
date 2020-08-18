module.exports = {
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-146928642-1',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `changelogs`,
        path: `${__dirname}/changelogs/`,
      },
    },
    'gatsby-transformer-remark',
  ],
};
