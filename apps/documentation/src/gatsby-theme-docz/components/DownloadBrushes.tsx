import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { TertiaryButton } from '@entur/button';
import { DownloadIcon } from '@entur/icons';

export const DownloadBrushes = () => {
  const query = useStaticQuery(graphql`
    query BrushesFile {
      file(
        sourceInstanceName: { eq: "downloads" }
        name: { eq: "EN_TUR_Streker_Brushes" }
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
      aria-label="Last ned Entur-brushes"
    >
      <DownloadIcon />
      {query.file.name}.{query.file.extension}
    </TertiaryButton>
  );
};
