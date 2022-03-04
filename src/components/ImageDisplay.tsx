import React from 'react';

import { IconButton } from '@entur/button';
import { DownloadIcon } from '@entur/icons';
import { Tooltip } from '@entur/tooltip';

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
  src: string;
  download?: boolean;
  alt?: string;
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  download = false,
  alt = '',
  ...rest
}) => {
  return (
    <div className="image-display">
      <div className="image-display__image" {...rest}>
        <img src={src} alt={alt} />
      </div>
      {download && (
        <Tooltip content="Last ned illustrasjon" placement="top">
          <IconButton
            as="a"
            download
            href={src}
            className="image-display__download"
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export { ImageDisplay, BorderWrapper };
