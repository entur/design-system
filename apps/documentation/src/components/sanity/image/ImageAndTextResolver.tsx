import React from 'react';
import { graphql } from 'gatsby';
import classNames from 'classnames';
import { ImageDisplay } from '@components/Media/ImageDisplay';
import { PortableText } from '../PortableText';
import { getGatsbyImageData } from 'gatsby-source-sanity';
import { ImageAndTextType } from '../types';
import './ImageAndText.scss';
import { getImage } from 'gatsby-plugin-image';

type Props = {
  value: ImageAndTextType;
};

export const ImageAndTextResolver = ({ value }: Props) => {
  const { image, _rawText, addMargin, showDownload } = value;
  console.log('what', image.asset.gatsbyImageData);
  const imageData =
    image.asset.gatsbyImageData ??
    getGatsbyImageData(
      {
        _id: image.asset._id,
        url: image.asset.url,
        assetId: image.assetId,
        extension: image.asset.extension,
        metadata: image.asset.metadata,
      },
      {},
      { projectId: 'npa0lfls', dataset: 'production' },
    );
  console.log('hei', imageData);

  return (
    <div
      className={classNames('image-and-text', {
        'image-and-text--add-margin': addMargin,
      })}
    >
      <ImageDisplay
        imgSource={imageData}
        alt={''}
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
