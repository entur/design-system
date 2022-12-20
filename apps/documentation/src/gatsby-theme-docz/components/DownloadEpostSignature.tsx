import React from 'react';
import { DownloadIcon } from '@entur/icons';
import { graphql, useStaticQuery } from 'gatsby';
import { TertiaryButton } from '@entur/button';
export const DownloadEpostSignature = () => {
  const query = useStaticQuery(graphql`
    query EpostFiles {
      file(
        sourceInstanceName: { eq: "downloads" }
        name: { eq: "En_signatur_logo" }
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
