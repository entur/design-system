import path from 'path';
import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  graphqlTypegen: {
    typesOutputPath: 'src/utils/gatsby/gatsby-types.d.ts',
  },
  siteMetadata: {
    title: 'Entur Designsystem',
    url: 'https://design.entur.no/',
    siteUrl: 'https://design.entur.no/',
    description:
      'Her finner du alt du trenger å vite om Entur sitt designsystem',
  },
  trailingSlash: 'never',
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        useResolveUrlLoader: true,
        sassOptions: {
          api: 'modern-compiler',
          includePaths: [path.resolve(__dirname, '../../node_modules')],
        },
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-remark-images',
    {
      resolve: 'gatsby-plugin-root-import',
      options: {
        '@components': path.join(__dirname, 'src', 'components'),
        '@data': path.join(__dirname, 'src', 'data'),
        '@media': path.join(__dirname, 'src', 'media'),
        '@providers': path.join(__dirname, 'src', 'providers'),
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1200,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              className: `gatsby-header-links`,
              icon: false,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'media',
        path: './src/media/',
      },
      __key: 'media',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'downloads',
        path: './src/downloads/',
      },
      __key: 'downloads',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      __key: 'pages',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'icons',
        path: './icons/',
      },
      __key: 'icons',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'changelog',
        path: './changelogs/',
      },
      __key: 'changelog',
    },
  ],
};

export default config;
