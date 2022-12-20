import { useStaticQuery, graphql } from 'gatsby';
export const useGetNpmVersion = () => {
  const query = useStaticQuery(graphql`
    query NpmVersion {
      allNpmPackage {
        edges {
          node {
            version
            name
          }
        }
      }
    }
  `);
  return query;
};
