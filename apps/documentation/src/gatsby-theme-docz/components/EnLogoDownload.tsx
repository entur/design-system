import React from 'react';
import EnIcon from './App_ikon.png';

import { graphql, useStaticQuery } from 'gatsby';

import { DownloadIcon } from '@entur/icons';
import { SecondaryButton } from '@entur/button';
import { colors } from '@entur/tokens';
const EnLogoDownload = () => {
  const query = useStaticQuery(graphql`
    query Logo {
      file(
        sourceInstanceName: { eq: "downloads" }
        name: { eq: "EN-app-logo-512x512" }
      ) {
        extension
        dir
        publicURL
      }
    }
  `);
  const file = query.file;

  return (
    <div>
      <div
        style={{
          width: '100%',
          padding: '4rem',
          minHeight: '27rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: colors.greys.grey80,
        }}
      >
        <img
          src={EnIcon}
          width="100%"
          alt="Entur logoen som brukes for Entur-appen"
        />
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
          }}
        >
          <SecondaryButton
            size="small"
            style={{ marginRight: '0.5rem' }}
            as="a"
            href={file.publicURL}
            download
          >
            <DownloadIcon />
            Entur App-logo
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};

export default EnLogoDownload;
