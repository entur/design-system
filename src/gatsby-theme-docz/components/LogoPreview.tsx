import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { SegmentedChoice, SegmentedControl } from '@entur/form';
import { Contrast } from '@entur/layout';
import Logo from './Logo.svg';
import LogoContrast from './LogoContrast.svg';
import { TertiaryButton } from '@entur/button';
import { DownloadIcon } from '@entur/icons';

const LogoPreview = () => {
  const query = useStaticQuery(graphql`
    query LogoFiles {
      allFile(filter: { sourceInstanceName: { eq: "downloads" } }) {
        edges {
          node {
            extension
            dir
            publicURL
          }
        }
      }
    }
  `);
  const [logoView, setLogoView] = useState<string | null>('normal');
  let Wrapper = logoView === 'contrast' ? Contrast : 'div';

  const files = query.allFile.edges;
  return (
    <div>
      <div style={{ width: '50%', marginBottom: '1.5rem' }}>
        <SegmentedControl
          label="Visning"
          onChange={selectedValue => setLogoView(selectedValue)}
          selectedValue={logoView}
        >
          <SegmentedChoice value="normal">Entur Logo Blue</SegmentedChoice>
          <SegmentedChoice value="contrast">Entur Logo White</SegmentedChoice>
        </SegmentedControl>
      </div>
      <Wrapper
        style={{
          width: '100%',
          padding: '4rem',
          minHeight: '22rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <img
          src={logoView === 'contrast' ? LogoContrast : Logo}
          style={{ height: '5rem' }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: '2rem',
          }}
        >
          <TertiaryButton
            style={{ marginRight: '0.5rem' }}
            as="a"
            href={files[0].node.publicURL}
            download
          >
            <DownloadIcon />
            Entur Logoer RGB
          </TertiaryButton>
          <TertiaryButton as="a" href={files[0].node.publicURL} download>
            <DownloadIcon />
            Entur Logoer CMYK
          </TertiaryButton>
        </div>
      </Wrapper>
    </div>
  );
};

export default LogoPreview;
