import path from 'path';
import { GatsbyConfig, graphql } from 'gatsby';
import { getSanitizedPath } from './src/utils/utils';

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
    {
      resolve: 'gatsby-source-sanity',
      options: {
        projectId: 'npa0lfls',
        dataset: 'production',
        watchMode: process.env.NODE_ENV === 'development',
      },
    },
    'gatsby-plugin-image',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        useResolveUrlLoader: true,
        sassOptions: {
          api: 'modern-compiler',
          includePaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '../../node_modules'),
          ],
          loadPaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '../../node_modules'),
          ],
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
          threshold: 2, // Lower threshold for more sensitive matching
          resolution: 30, // Higher resolution for better precision
          depth: 25, // Increased depth for better recall
          document: {
            id: 'id',
            index: [
              'title',
              'tags',
              'description',
              'npmPackage',
              'body',
              'category',
              'subcategory',
            ],
            // Optimized weights for better search relevance
            field: {
              title: {
                weight: 5, // Highest weight - most important for exact matches
              },
              tags: {
                weight: 4, // High weight - contains specific, curated keywords
              },
              description: {
                weight: 3, // Medium-high weight - concise summaries
              },
              npmPackage: {
                weight: 3, // Medium-high weight - important for developers
              },
              category: {
                weight: 2, // Medium weight - provides context
              },
              subcategory: {
                weight: 2, // Medium weight - provides context
              },
              body: {
                weight: 1, // Lowest weight - can be long and dilute relevance
              },
            },
          },
        },
        ref: 'id',
        index: [
          'title',
          'tags',
          'description',
          'npmPackage',
          'body',
          'category',
          'subcategory',
        ],
        store: [
          'id',
          'path',
          'title',
          'description',
          'npmPackage',
          'category',
          'subcategory',
        ],
        normalizer: ({ data }) => {
          const mdxNodes = data.allMdx.nodes.map(node => ({
            id: node.id,
            path: node.frontmatter.route,
            title: node.frontmatter.title,
            tags: node.frontmatter.tags,
            description: node.frontmatter.description,
            npmPackage: node.frontmatter.npmPackage,
            body: node.body,
            category: null,
            subcategory: null,
          }));

          const sanityNodes = data.allSanityPage.nodes.map(node => {
            const path = getSanitizedPath({
              title: node.title,
              category: node.category,
              subcategory: node.subcategory,
              isCategoryLandingPage: node.isCategoryLandingPage,
            });

            return {
              id: node.id,
              path: path,
              title: node.title,
              tags: [],
              description: node.description,
              npmPackage: null,
              body: node.content?._rawItems
                ? JSON.stringify(node.content._rawItems)
                : '',
              category: node.category,
              subcategory: node.subcategory,
            };
          });

          return [...mdxNodes, ...sanityNodes];
        },

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
            allSanityPage {
              nodes {
                id
                title
                description
                category
                subcategory
                isCategoryLandingPage
                content {
                  _rawItems
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
