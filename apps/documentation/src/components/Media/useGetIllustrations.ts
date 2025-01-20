import { useMemo } from 'react';
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
            gatsbyImageData(layout: CONSTRAINED)
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
  const illustrationsQuery = (
    query.pngFiles.illustrations as IllustrationsQueryType[]
  ).concat(query.otherFiles.illustrations as IllustrationsQueryType[]);

  const illustrations = useMemo(() => {
    return processIllustrationsQuery(illustrationsQuery);
  }, []);

  return illustrations;
};

export type IllustrationsQueryType = {
  absolutePath: string;
  name: string;
  publicURL: string;
  extension: string;
  childImageSharp: {
    gatsbyImageData: any;
  };
};

export type IllustrationListItem = {
  categories: string[];
  name: string;
  sanitizedName: string;
  uniqueName: string;
  imgSource: any;
  publicUrl: string;
  publicUrls: Array<{ src: string; format: string }>;
  publicUrlPNG?: string;
  publicUrlSVG?: string;
  isContrast: boolean;
  isDarkmode: boolean;
  hasBackground: boolean;
  extension: string;
};

const ACCEPTED_EXTENSIONS = ['png', 'svg', 'pdf'];

const processIllustrationsQuery = (
  illustrationsQuery: IllustrationsQueryType[],
) =>
  illustrationsQuery
    .filter(
      illustration =>
        ACCEPTED_EXTENSIONS.includes(illustration.extension.toLowerCase()) &&
        illustration.absolutePath.includes('/downloads/illustrations/'),
    )
    // Process raw GraphQL-data into info about illustration
    .map(illustration => {
      const illustrationName = illustration.name.replace(/-|_/g, ' ');
      const sanitizedName =
        illustration.name.charAt(0) +
        illustration.name
          .toLowerCase()
          .replace(' contrast', '')
          .replace(' darkmode', '')
          .replace(' default', '')
          .replace(' circle', '')
          .replace(' dark', '')
          .slice(1);
      const categories = illustration.absolutePath
        .split('/downloads/illustrations/')?.[1]
        ?.split('/')
        .filter(
          category =>
            // exclude file extension and file name as categories
            !ACCEPTED_EXTENSIONS.includes(category.toLowerCase()) &&
            !category.includes('.'),
        )
        .map(category => category.toLowerCase());
      const publicUrl = illustration.publicURL;
      const imgSource = illustration.childImageSharp?.gatsbyImageData;
      const isContrast = illustrationName.toLowerCase().includes('contrast');
      const isDarkmode = /darkmode|dark/.test(
        illustrationName.toLowerCase().replace(/\s+|-|_/g, ''),
      );
      const hasBackground =
        illustrationName.toLowerCase().includes('circle') ||
        illustrationName.toLowerCase().includes('frame') ||
        illustrationName.toLowerCase().includes('background');

      return {
        name: illustrationName,
        sanitizedName,
        uniqueName: categories?.join('-') + illustrationName,
        categories,
        extension: illustration.extension,
        publicUrl,
        publicUrls: [],
        imgSource,
        isContrast,
        isDarkmode,
        hasBackground,
      } as IllustrationListItem;
    })
    // Merge svg and png version of the same illustration
    .reduce((mergedIllustrationsList, illustration) => {
      const matchedIllustration = mergedIllustrationsList.find(
        illustrationInList =>
          illustration.uniqueName === illustrationInList.uniqueName,
      );

      const publicUrl = {
        src: illustration.publicUrl,
        format: illustration.extension,
      };
      if (matchedIllustration) {
        matchedIllustration.publicUrls.push(publicUrl);
        if (matchedIllustration.imgSource === undefined)
          matchedIllustration.imgSource = illustration.imgSource;
      } else {
        illustration.publicUrls.push(publicUrl);
        mergedIllustrationsList.push(illustration);
      }

      return mergedIllustrationsList;
    }, [] as IllustrationListItem[]);
