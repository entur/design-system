import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { TertiaryButton } from '@entur/button';
import { DownloadIcon } from '@entur/icons';

export const DownloadBackground = () => {
  const query = useStaticQuery(graphql`
    query BackgroundFiles {
      file(
        sourceInstanceName: { eq: "downloads" }
        name: { eq: "En_Skjermbakgrunn" }
      ) {
        extension
        name
        publicURL
      }
    }
  `);
  return (
    <TertiaryButton
      as="a"
      href={query.file.publicURL}
      download
      style={{ marginBottom: '2.5rem' }}
    >
      <DownloadIcon />
      {query.file.name}.{query.file.extension}
    </TertiaryButton>
  );
};
