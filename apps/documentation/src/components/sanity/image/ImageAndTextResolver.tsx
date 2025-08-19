import React from 'react';
import { graphql } from 'gatsby';
import { getGatsbyImageData } from 'gatsby-source-sanity';
import classNames from 'classnames';
import { ImageDisplay } from '@components/Media/ImageDisplay';
import { DoDontCard } from '@components/Cards/DoDont';
import { PortableText } from '../PortableText';
import { ImageAndTextType } from '../types';

import './ImageAndText.scss';

type Props = {
  value: ImageAndTextType;
};

export const ImageAndTextResolver = ({ value }: Props) => {
  const {
    variant = 'standard',
    image,
    text,
    showDownload,
    imageDescription,
    hideFromScreenreaders,
    imageDisplayPreset = 'default',
    order,
    extraDownloadFiles = [],
    // Guideline specific fields
    guidelineVariant = 'success',
    guidelineTitle,
    noPadding = false,
    textInBox = false,
  } = value;

  if (!image || typeof image === 'string' || !('asset' in image)) return null;
  const imageData =
    'gatsbyImageData' in image.asset
      ? image.asset.gatsbyImageData
      : getGatsbyImageData(
          // @ts-expect-error Images inserted inline from Sanity do not contain
          // gatsbyImageData because of 'resolveReferences: { maxDepth: 10 }' on TextBlock query.
          // We therefore need to create a GatsbyImage from the resolved data.
          image,
          {},
          { projectId: 'npa0lfls', dataset: 'production' },
        );
  if (imageData === null) return null;

  if (variant === 'guideline') {
    return (
      <DoDontCard
        imgSource={imageData}
        alt={imageDescription}
        variant={guidelineVariant}
        title={guidelineTitle}
        noPadding={noPadding}
        textInBox={textInBox}
        aria-hidden={hideFromScreenreaders}
      >
        <PortableText value={text} />
      </DoDontCard>
    );
  }

  return (
    <div className={'image-and-text'}>
      {order === 'text-first' && <PortableText value={text} />}
      <ImageDisplay
        imgSource={imageData}
        alt={imageDescription}
        preset={
          imageDisplayPreset === 'default'
            ? 'contain-full-width'
            : imageDisplayPreset
        }
        className={classNames('image-and-text__image', {
          'eds-contrast': variant === 'contrast',
        })}
        alwaysShowDownload={showDownload || extraDownloadFiles.length > 0}
        downloadSources={
          showDownload || extraDownloadFiles.length > 0
            ? (() => {
                const sources: Array<{
                  src: string;
                  format: string;
                  label?: string;
                }> = [];

                // Main image download (if showDownload is enabled)
                if (showDownload) {
                  sources.push({
                    src: imageData.images.fallback?.src + '&dl=',
                    format: 'png',
                    label: 'Last ned som PNG',
                  });
                }

                // Extra download files
                extraDownloadFiles.forEach(file => {
                  if (
                    file.fileType === 'uploaded' &&
                    file.uploadedFile?.asset?.url
                  ) {
                    const fileFormat = file.uploadedFile.asset.originalFilename
                      ?.split('.')
                      ?.at(-1);
                    sources.push({
                      src: file.uploadedFile.asset.url + '?&dl=',
                      format: fileFormat?.toUpperCase() || 'file',
                      label: file.downloadLabel,
                    });
                  } else if (file.fileType === 'link' && file.fileLink) {
                    sources.push({
                      src: file.fileLink,
                      format: file.fileFormat?.toLowerCase() || 'file',
                      label:
                        file.downloadLabel ||
                        `Last ned som ${
                          file.fileFormat?.toUpperCase() || 'fil'
                        }`,
                    });
                  }
                });

                return sources;
              })()
            : undefined
        }
        aria-hidden={hideFromScreenreaders}
      />
      {order !== 'text-first' && <PortableText value={text} />}
    </div>
  );
};

export const ImageAndTextFragment = graphql`
  fragment ImageAndTextFragment on SanityImageAndText {
    _key
    _type
    variant
    order
    image {
      asset {
        gatsbyImageData
      }
    }
    imageDescription
    hideFromScreenreaders
    showDownload
    imageDisplayPreset
    extraDownloadFiles {
      fileType
      uploadedFile {
        asset {
          _id
          url
          originalFilename
        }
      }
      fileLink
      downloadLabel
      fileFormat
    }
    # Guideline specific fields
    guidelineVariant
    guidelineTitle
    noPadding
    textInBox
    _rawText(resolveReferences: { maxDepth: 10 })
  }
`;
