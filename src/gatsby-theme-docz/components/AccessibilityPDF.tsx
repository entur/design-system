import { Link } from '@entur/typography/dist';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

export const AccessibilityPDF = () => {
  const query = useStaticQuery(graphql`
    query DownloadAllyPDF {
      file(
        sourceInstanceName: { eq: "downloads" }
        name: {
          eq: "Tilgjengelighetsinformasjon fra et brukerperspektiv våren 2019"
        }
      ) {
        extension
        name
        publicURL
      }
    }
  `);
  return (
    <Link href={query.file.publicURL} target="_blank">
      Tilgjengelighetsundersøkelsen kan du lese her.
    </Link>
  );
};
