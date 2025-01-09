import { useStaticQuery, graphql } from 'gatsby';

export const useGetChangelog = () => {
  const query = useStaticQuery(graphql`
    query PackageChangelog {
      allFile(filter: { sourceInstanceName: { eq: "changelog" } }) {
        nodes {
          name
          publicURL
          children {
            id
            ... on Mdx {
              id
              body
            }
          }
        }
      }
    }
  `);
  return query;
};
