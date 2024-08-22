import React from 'react';
import Img, { FluidObject } from 'gatsby-image';

import { IconButton } from '@entur/button';
import { DownloadIcon } from '@entur/icons';
import { OverflowMenu, OverflowMenuItem } from '@entur/menu';

import './ImageDisplay.scss';
import { Tooltip } from '@entur/tooltip';
import classNames from 'classnames';

type ImageDisplayProps = {
  src?: string;
  fluidSource?: FluidObject;
  name?: string;
  downloadSources?: Array<{ src: string; format: string; label?: string }>;
  alt?: string;
  alwaysShowDownload?: boolean;
  className?: string;
  preset?: string;
};

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  fluidSource,
  name,
  downloadSources,
  alt = '',
  alwaysShowDownload = false,
  className,
  preset,
  ...rest
}) => {
  return (
    <div
      className={classNames('image-display', className, {
        'preset--logo-display': preset === 'logo-display',
      })}
      {...rest}
    >
      {src !== undefined && <img src={src} alt={alt} />}
      {fluidSource !== undefined && (
        <Img fluid={fluidSource} alt={alt} style={{ objectFit: 'contain' }} />
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
