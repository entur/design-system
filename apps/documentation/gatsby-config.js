module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        implementation: require('sass'),
      },
    },
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
    {
      resolve: `gatsby-plugin-posthog`,
      options: {
        apiKey: 'phc_ESGRM1feMLZkHxV0P81O4i7g4I4jTFIYZpuZVxqF3hq',
        apiHost: 'https://eu.posthog.com',
        // Puts tracking script in the head instead of the body
        head: true,
        initOptions: {
          persistence: 'memory',
          disable_session_recording: true,
        },
      },
    },
  ],
};
