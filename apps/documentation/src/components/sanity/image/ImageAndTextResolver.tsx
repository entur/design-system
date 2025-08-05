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
        alwaysShowDownload={showDownload}
        downloadSources={
          showDownload
            ? [
                {
                  src: imageData.images.fallback?.src + '&dl=',
                  format: 'png',
                },
              ]
            : undefined
        }
        aria-hidden={hideFromScreenreaders}
      />
      <PortableText value={text} />
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
    # Guideline specific fields
    guidelineVariant
    guidelineTitle
    noPadding
    textInBox
    _rawText(resolveReferences: { maxDepth: 10 })
  }
`;
