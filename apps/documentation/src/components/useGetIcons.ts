import { useStaticQuery, graphql } from 'gatsby';
export const useGetIcons = () => {
  const query = useStaticQuery(graphql`
    query IconsQuery {
      allFile(filter: { sourceInstanceName: { eq: "icons" } }) {
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
  return query.allFile.edges as iconsQueryType[];
};

export type iconsQueryType = {
  node: {
    publicURL: string;
    name: string;
    absolutePath: string;
  };
};
