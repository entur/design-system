import React from 'react';
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

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, ...rest }) => {
  return (
    <div className="image-display">
      <div className="image-display__image" {...rest}>
        <img src={src} alt="" />
      </div>
    </div>
  );
};

export { ImageDisplay, BorderWrapper };
