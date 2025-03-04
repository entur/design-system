import path from 'path';
import { GatsbyConfig, graphql } from 'gatsby';

const config: GatsbyConfig = {
  graphqlTypegen: {
    typesOutputPath: 'src/utils/gatsby/gatsby-types.d.ts',
  },
  siteMetadata: {
    title: 'Entur Linje',
    url: 'https://linje.entur.no/',
    siteUrl: 'https://linje.entur.no/',
    description:
      'Her finner du alt du trenger å vite om Linje – Entur sitt designsystem',
  },
  trailingSlash: 'never',
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        useResolveUrlLoader: true,
        sassOptions: {
          api: 'modern-compiler',
          includePaths: [path.resolve(__dirname, 'node_modules')],
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
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1200,
            },
          },
          {
            resolve: 'gatsby-remark-autolink-headers',
            options: {
              className: 'gatsby-header-links',
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
    {
      resolve: 'gatsby-plugin-local-search',
      options: {
        // Info about options here: https://www.gatsbyjs.com/plugins/gatsby-plugin-local-search/#gatsby-plugin-local-search
        name: 'pages',
        engine: 'flexsearch',
        engineOptions: {
          // Info about engineOptions here: https://github.com/nextapps-de/flexsearch?tab=readme-ov-file#index-options
          tokenize: 'forward',
          threshold: 2,
          resolution: 30,
          depth: 20,
          document: {
            id: 'id',
            index: ['title', 'tags', 'body'],
            // This is done to add more importance to 'title' and 'tags' in the search
            field: {
              title: {
                weight: 3,
              },
              tags: {
                weight: 2,
              },
              body: {
                weight: 1,
              },
            },
          },
        },
        ref: 'id',
        index: ['title', 'tags', 'body'],
        store: ['id', 'path', 'title', 'description', 'npmPackage'],
        normalizer: ({ data }) =>
          data.allMdx.nodes.map(node => ({
            id: node.id,
            path: node.frontmatter.route,
            title: node.frontmatter.title,
            tags: node.frontmatter.tags,
            description: node.frontmatter.description,
            body: node.body,
            npmPackage: node.frontmatter.npmPackage,
          })),

        // GraphQL query used to fetch all data for the search index. This is
        // required.
        query: `
          {
            allMdx {
              nodes {
                body
                id
                frontmatter {
                  route
                  description
                  npmPackage
                  title
                  tags
                }
              }
            }
          }
        `,
      },
    },
  ],
};

export default config;
