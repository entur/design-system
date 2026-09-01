import { graphql, useStaticQuery } from 'gatsby';

export type ChangelogFile = {
  name: string;
  publicURL: string;
};

export type PackageVersion = {
  name: string;
  version: string;
  publishedAt: string | null;
};

export const useGetChangelog = (): {
  allFile: { nodes: ChangelogFile[] };
  allNpmPackageVersion: { nodes: PackageVersion[] };
} => {
  const query = useStaticQuery(graphql`
    query PackageChangelog {
      allFile(filter: { sourceInstanceName: { eq: "changelog" } }) {
        nodes {
          name
          publicURL
        }
      }
      allNpmPackageVersion {
        nodes {
          name
          version
          publishedAt
        }
      }
    }
  `);
  return query;
};
