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
  return (
    <div className="image-display">
      <a
        className="image-display__download-icon"
        href={props.src}
        download
        aria-label="Last ned bilde"
      >
        <DownloadIcon />
      </a>

      <div className="image-display__image">
        <img src={props.src} alt="" />
      </div>
    </div>
  );
}

export { ImageDisplay, BorderWrapper };
