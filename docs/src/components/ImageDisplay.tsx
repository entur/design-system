import React from 'react';
import { DownloadIcon } from '@entur/icons';
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
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src }) => {
  return (
    <div className="image-display">
      <div className="image-display__image">
        <img src={src} alt="" />
      </div>
    </div>
  );
};

export { ImageDisplay, BorderWrapper };
