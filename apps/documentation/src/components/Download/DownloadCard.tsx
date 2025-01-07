import { SecondaryButton } from '@entur/button';
import { DownloadIcon } from '@entur/icons';
import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

export const DownloadCard = () => {
  const query = useStaticQuery(graphql`
    query CardFiles {
      file(
        sourceInstanceName: { eq: "downloads" }
        name: { eq: "EN_Visittkortmal" }
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
