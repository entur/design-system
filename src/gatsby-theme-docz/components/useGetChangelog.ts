import { useStaticQuery, graphql } from 'gatsby';

export const useGetChangelog = () => {
  const query = useStaticQuery(graphql`
    query PackageChangelog {
      allMarkdownRemark {
        edges {
          node {
            html
            rawMarkdownBody
            parent {
              ... on File {
                name
              }
            }
          }
        }
      }
    }
  `);
  return query;
};
