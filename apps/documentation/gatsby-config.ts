import path from 'path';
import { GatsbyConfig } from 'gatsby';
import { getSanitizedPath } from './src/utils/getSanitizedPath';

const isGitHubPullRequest =
  process.env.GITHUB_EVENT_NAME === 'pull_request' ||
  Boolean(process.env.GITHUB_HEAD_REF) ||
  (process.env.GITHUB_REF ?? '').startsWith('refs/pull/');

const shouldUseDevelopmentGraphqlTag =
  process.env.NODE_ENV === 'development' || isGitHubPullRequest;

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
        graphqlTag:
          process.env.SANITY_GRAPHQL_TAG ||
          (shouldUseDevelopmentGraphqlTag ? 'development' : 'default'),
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
        '@layouts': path.join(__dirname, 'src', 'layouts'),
        '@data': path.join(__dirname, 'src', 'data'),
        '@media': path.join(__dirname, 'src', 'media'),
        '@providers': path.join(__dirname, 'src', 'providers'),
        '@utils': path.join(__dirname, 'src', 'utils'),
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
        name: 'changelog',
        path: './dist/changelogs/',
      },
      __key: 'changelog',
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'icons',
        path: './dist/icons/',
      },
      __key: 'icons',
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
              'tag',
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
              tag: {
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
          'tag',
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
          'tag',
          'category',
          'subcategory',
        ],
        normalizer: ({ data }) => {
          const mdxStandaloneNodes = (data.allMdx?.nodes ?? []).filter(
            (node: { parent?: { sourceInstanceName?: string } }) =>
              node.parent?.sourceInstanceName === 'pages',
          );
          const tabsMdxNodes = (data.allFile?.nodes ?? [])
            .filter(
              (file: { sourceInstanceName?: string; childMdx?: unknown }) =>
                file.sourceInstanceName === 'tabs' && file.childMdx,
            )
            .map(
              (file: {
                childMdx: {
                  body: string;
                  frontmatter?: { route?: string };
                };
              }) => file.childMdx,
            );

          const mdxNodes = mdxStandaloneNodes.map(
            (node: {
              id: string;
              frontmatter?: {
                route?: string;
                title?: string;
                tags?: string[];
                description?: string;
                npmPackage?: string;
              };
              body: string;
            }) => ({
              id: node.id,
              path: node.frontmatter?.route,
              title: node.frontmatter?.title,
              tag: null,
              tags: node.frontmatter?.tags,
              description: node.frontmatter?.description,
              npmPackage: node.frontmatter?.npmPackage,
              body: node.body,
              category: null,
              subcategory: null,
            }),
          );

          const mergedMdxByRoute = tabsMdxNodes.reduce(
            (
              acc: Record<string, string>,
              node: { frontmatter?: { route?: string }; body: string },
            ) => {
              const route = node.frontmatter?.route;
              if (!route) return acc;
              acc[route] = `${acc[route] || ''} ${node.body}`.trim();
              return acc;
            },
            {},
          );

          const sanityNodes = data.allSanityPage.nodes.map(node => {
            const path = getSanitizedPath({
              title: node.title,
              category: node.category,
              subcategory: node.subcategory,
              isCategoryLandingPage: node.isCategoryLandingPage,
              tag: node.tag ?? undefined,
            });

            return {
              id: node.id,
              path: path,
              title: node.title,
              tag: node.tag ?? null,
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

          const sanityComponentDocs = data.allSanityComponentDoc.nodes.map(
            node => {
              const path = getSanitizedPath({
                title: node.title,
                category: node.category,
                subcategory: node.subcategory,
                tag: node.tag ?? undefined,
              });

              const tabsContent =
                node.tabs && node.tabs.length > 0
                  ? node.tabs
                      .map(tab =>
                        tab.content?._rawItems
                          ? JSON.stringify(tab.content._rawItems)
                          : '',
                      )
                      .join(' ')
                  : '';

              const beskrivelseContent = node.beskrivelse?._rawItems
                ? JSON.stringify(node.beskrivelse._rawItems)
                : '';
              const utviklingContent = node.utvikling?._rawItems
                ? JSON.stringify(node.utvikling._rawItems)
                : '';

              const sanityContent = tabsContent
                ? tabsContent
                : `${beskrivelseContent} ${utviklingContent}`.trim();

              const mergedMdxContent = mergedMdxByRoute[path] || '';
              const combinedContent =
                `${sanityContent} ${mergedMdxContent}`.trim();

              return {
                id: node.id,
                path,
                title: node.title,
                tag: node.tag ?? null,
                tags: [],
                description: node.description,
                npmPackage: node.npmPackage ?? null,
                body: combinedContent,
                category: node.category,
                subcategory: node.subcategory,
              };
            },
          );

          // Manual entries for TSX pages not covered by MDX/Sanity
          const manualPages = [
            {
              id: 'brukerundersokelse',
              path: '/ressurser/innsikt/brukerundersokelse',
              title: 'Designsystemets brukerundersøkelser',
              tag: null,
              description:
                'Analyse av brukerundersøkelser for Entur Linje designsystem 2022–2025.',
              npmPackage: null,
              body: 'Designsystemets brukerundersøkelser brukerundersøkelse survey analyse tilfredshet trender respondenter kvalitative tilbakemeldinger forbedringsforslag',
              category: 'Ressurser',
              subcategory: 'Innsikt',
            },
          ];

          return [
            ...mdxNodes,
            ...sanityNodes,
            ...sanityComponentDocs,
            ...manualPages,
          ];
        },

        // GraphQL query used to fetch all data for the search index. This is
        // required.
        query: `
          {
            allMdx {
              nodes {
                body
                id
                parent {
                  ... on File {
                    sourceInstanceName
                  }
                }
                frontmatter {
                  route
                  description
                  npmPackage
                  title
                  tags
                }
              }
            }
            allFile(filter: { sourceInstanceName: { eq: "tabs" }, extension: { in: ["mdx", "md"] } }) {
              nodes {
                sourceInstanceName
                childMdx {
                  body
                  frontmatter {
                    route
                  }
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
                tag
                content {
                  _rawItems
                }
              }
            }
            allSanityComponentDoc {
              nodes {
                id
                title
                description
                category
                subcategory
                npmPackage
                tag
                beskrivelse {
                  _rawItems
                }
                utvikling {
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
