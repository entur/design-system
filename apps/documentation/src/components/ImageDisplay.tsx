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
      className={classNames('image-display', `preset--${preset}`, className)}
      {...rest}
    >
      {src !== undefined && <img src={src} alt={alt} />}
      {fluidSource !== undefined && (
        <Img fluid={fluidSource} alt={alt} style={{ objectFit: 'contain' }} />
      )}
      {downloadSources !== undefined && (
        <Tooltip placement="top" content="Last ned …">
          <div
            className={classNames('image-display__download-container', {
              'image-display__download-container--show': alwaysShowDownload,
            })}
          >
            <OverflowMenu
              buttonIcon={<DownloadIcon />}
              placement="bottom-end"
              aria-label={`Trykk for å åpne nedlastingsvalg for illustrasjon ${name}`}
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
                      className="image-display__download-container__menu__item"
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
