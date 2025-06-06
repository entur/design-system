import React from 'react';
import { graphql } from 'gatsby';
import classNames from 'classnames';
import { ImageDisplay } from '@components/Media/ImageDisplay';
import { PortableText } from '../PortableText';
import { ImageAndTextType } from '../types';
import './ImageAndText.scss';

type Props = {
  value: ImageAndTextType;
};

export const ImageAndTextResolver = ({ value }: Props) => {
  const { image, _rawText, addMargin, showDownload } = value;

  return (
    <div
      className={classNames('image-and-text', {
        'image-and-text--add-margin': addMargin,
      })}
    >
      <ImageDisplay
        imgSource={image.asset.gatsbyImageData}
        alt={''}
        preset="contain-full-width"
        className="image-and-text__image"
        alwaysShowDownload={showDownload}
        downloadSources={
          showDownload
            ? [
                {
                  src: image.asset.gatsbyImageData.images.fallback?.src,
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
