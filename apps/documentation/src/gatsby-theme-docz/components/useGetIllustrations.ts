import { useStaticQuery, graphql } from 'gatsby';

export const useGetIllustrations = () => {
  const query = useStaticQuery(graphql`
    query IllustrationsQuery {
      pngFiles: allFile(
        filter: {
          absolutePath: { regex: "/.+downloads/illustrations.+/" }
          extension: { in: ["png"] }
        }
      ) {
        illustrations: nodes {
          absolutePath
          name
          publicURL
          extension
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      otherFiles: allFile(
        filter: {
          absolutePath: { regex: "/.+downloads/illustrations.+/" }
          extension: { in: ["svg", "pdf"] }
        }
      ) {
        illustrations: nodes {
          absolutePath
          name
          publicURL
          extension
        }
      }
    }
  `);
  return (query.pngFiles.illustrations as IllustrationsQueryType[]).concat(
    query.otherFiles.illustrations as IllustrationsQueryType[],
  );
};

export type IllustrationsQueryType = {
  absolutePath: string;
  name: string;
  publicURL: string;
  extension: string;
  childImageSharp: {
    fluid: any;
  };
};
