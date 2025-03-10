import React from 'react';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';

import { IconButton } from '@entur/button';
import { DownloadIcon } from '@entur/icons';
import { OverflowMenu, OverflowMenuItem } from '@entur/menu';

import { Tooltip } from '@entur/tooltip';
import classNames from 'classnames';

import './ImageDisplay.scss';

export type ImageDisplayProps = {
  imgSource?: IGatsbyImageData | string;
  name?: string;
  downloadSources?: Array<{ src: string; format: string; label?: string }>;
  alt?: string;
  alwaysShowDownload?: boolean;
  className?: string;
  style?: React.CSSProperties;
  preset?: string;
};

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imgSource,
  name,
  downloadSources,
  alt = '',
  alwaysShowDownload = false,
  className,
  preset,
  style,
  ...rest
}) => {
  // Check if imgSource is a string (SVG URL)
  const isSvg = typeof imgSource === 'string' && imgSource.endsWith('.svg');

  return (
    <div
      className={classNames('image-display', `preset--${preset}`, className)}
      {...rest}
      style={style}
    >
      {isSvg ? (
        <img src={imgSource} alt={alt} className="image-display__image" />
      ) : (
        imgSource !== undefined && (
          <GatsbyImage image={imgSource as IGatsbyImageData} alt={alt} />
        )
      )}

      {downloadSources !== undefined && (
        <Tooltip placement={'bottom'} content="Last ned …">
          <div
            className={classNames('image-display__download-container', {
              'image-display__download-container--show': alwaysShowDownload,
            })}
          >
            <OverflowMenu
              button={
                <IconButton aria-label={`Last ned illustrasjon ${name}`}>
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
                      {downloadSrc.label ??
                        `Last ned som ${downloadSrc.format}`}
                    </OverflowMenuItem>
                  ),
              )}
            </OverflowMenu>
          </div>
        </Tooltip>
      )}
    </div>
  );
};
