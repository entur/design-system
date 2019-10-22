import React from 'react';
import { DownloadIcon } from '@entur/icons';
import './ImageDisplay.scss';

function BorderWrapper(props) {
  return (
    <div
      className="border-wrapper"
      style={{ gridTemplateColumns: props.threeGrid ? '1fr 1fr 1fr' : '1fr' }}
    >
      {props.children}
    </div>
  );
}

function ImageDisplay(props) {
  const [showIcon, setShowIcon] = React.useState(false);
  return (
    <div
      className="image-display"
      onMouseOver={() => setShowIcon(true)}
      onMouseLeave={() => setShowIcon(false)}
    >
      <a
        className="image-display__download-icon"
        style={{ display: showIcon ? 'block' : 'none' }}
        href={props.src}
        download
      >
        <DownloadIcon />
      </a>

      <div className="image-display__image">
        <img src={props.src} />
      </div>
    </div>
  );
}

export { ImageDisplay, BorderWrapper };
