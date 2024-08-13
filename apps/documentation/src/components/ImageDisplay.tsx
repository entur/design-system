import React from 'react';
import Img from 'gatsby-image';

import { IconButton } from '@entur/button';
import { DownloadIcon } from '@entur/icons';
import { OverflowMenu, OverflowMenuItem } from '@entur/menu';

import './ImageDisplay.scss';

type BorderWrapperProps = {
  threeGrid?: boolean;
  children: React.ReactNode;
};

const BorderWrapper: React.FC<BorderWrapperProps> = ({
  threeGrid,
  children,
}) => {
  return (
    <div
      className="border-wrapper"
      style={{ gridTemplateColumns: threeGrid ? '1fr 1fr 1fr' : '1fr' }}
    >
      {children}
    </div>
  );
};

type ImageDisplayProps = {
  src?: string;
  fluidSource?: any;
  name?: string;
  downloadSources?: Array<{ src: string; format: string }>;
  alt?: string;
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  fluidSource,
  name,
  downloadSources = [],
  alt = '',
  ...rest
}) => {
  return (
    <div className="image-display" {...rest}>
      {src !== undefined && <img src={src} alt={alt} />}
      {fluidSource !== undefined && (
        <Img fluid={fluidSource} alt={alt} style={{ objectFit: 'contain' }} />
      )}
      {downloadSources && (
        <div className="image-display__download-container">
          <OverflowMenu
            button={
              <IconButton
                className="image-display__download"
                aria-label={`Last ned illustrasjon ${name}`}
              >
                <DownloadIcon />
              </IconButton>
            }
            position="left"
          >
            {downloadSources.map(
              downloadSrc =>
                downloadSrc.src !== undefined && (
                  <OverflowMenuItem
                    as="a"
                    href={downloadSrc.src}
                    download
                    key={downloadSrc.src}
                    onSelect={() => undefined}
                  >
                    Last ned som {downloadSrc.format}
                  </OverflowMenuItem>
                ),
            )}
          </OverflowMenu>
        </div>
      )}
    </div>
  );
};

export { ImageDisplay, BorderWrapper };
