import React from 'react';
import { graphql } from 'gatsby';
import { getGatsbyImageData } from 'gatsby-source-sanity';
import classNames from 'classnames';
import { ImageDisplay } from '@components/Media/ImageDisplay';
import { PortableText } from '../PortableText';
import { ImageAndTextType } from '../types';

import './ImageAndText.scss';

type Props = {
  value: ImageAndTextType;
};

export const ImageAndTextResolver = ({ value }: Props) => {
  const {
    image,
    _rawText,
    addMargin,
    showDownload,
    imageDescription,
    hideFromScreenreaders,
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

  return (
    <div
      className={classNames('image-and-text', {
        'image-and-text--add-margin': addMargin,
      })}
    >
      <ImageDisplay
        imgSource={imageData}
        alt={imageDescription}
        preset="contain-full-width"
        className="image-and-text__image"
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
      <PortableText value={_rawText} />
    </div>
  );
};

export const ImageAndTextFragment = graphql`
  fragment ImageAndTextFragment on SanityImageAndText {
    _key
    _type
    order
    image {
      asset {
        gatsbyImageData
      }
    }
    addMargin
    showDownload
    _rawText
  }
`;
