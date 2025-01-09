import { SecondaryButton } from '@entur/button';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';
import { DownloadIcon } from '@entur/icons';

export const DownloadWord = () => {
  const query = useStaticQuery(graphql`
    query WordFiles {
      file(
        sourceInstanceName: { eq: "downloads" }
        name: { eq: "Entur_wordmaler" }
      ) {
        extension
        name
        publicURL
      }
    }
  `);
  return (
    <SecondaryButton
      size="small"
      as="a"
      href={query.file.publicURL}
      download
      style={{ marginBottom: '2.5rem' }}
    >
      <DownloadIcon />
      {query.file.name}.{query.file.extension}
    </SecondaryButton>
  );
};
