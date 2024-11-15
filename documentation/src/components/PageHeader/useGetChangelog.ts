import { useStaticQuery, graphql } from 'gatsby';

export const useGetChangelog = () => {
  const query = useStaticQuery(graphql`
    query PackageChangelog {
      allMdx {
        nodes {
          body
          parent {
            ... on File {
              name
            }
          }
        }
      }
    }
  `);
  return query;
};
