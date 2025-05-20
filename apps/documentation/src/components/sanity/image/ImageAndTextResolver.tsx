import React from 'react';
import { graphql } from 'gatsby';
import { ImageAndTextType } from '../types';
import { ImageDisplay } from '@components/Media/ImageDisplay';
import { PortableText } from '../PortableText';
import './ImageAndText.scss';
import classNames from 'classnames';

type Props = {
  value: ImageAndTextType;
};

export const ImageAndTextResolver = ({ value }: Props) => {
  const { image, _rawText, addMargin } = value;
  console.log(value);

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
    _rawText
  }
`;
