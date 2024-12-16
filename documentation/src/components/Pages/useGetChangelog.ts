import { useStaticQuery, graphql } from 'gatsby';

export const useGetChangelog = () => {
  const query = useStaticQuery(graphql`
    query ChangelogQuery {
      allFile(filter: { sourceInstanceName: { eq: "changelog" } }) {
        edges {
          node {
            publicURL
            name
            absolutePath
          }
        }
      }
    }
  `);
  return query;
};
