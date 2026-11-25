import { graphql, useStaticQuery } from 'gatsby';

export const useGetIcons = () => {
  const query = useStaticQuery(graphql`
    query IconsQuery {
      allFile(filter: { sourceInstanceName: { eq: "icons" } }) {
        edges {
          node {
            publicURL
            name
            relativeDirectory
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
    /** Category folder, e.g. UI/Validation */
    relativeDirectory: string;
  };
};
