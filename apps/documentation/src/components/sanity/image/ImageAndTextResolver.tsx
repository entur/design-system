import React from 'react';
import { graphql } from 'gatsby';
import { ImageAndTextType } from '../types';
import { GatsbyImage } from 'gatsby-plugin-image';
import { PortableText } from '../PortableText';
import './ImageAndText.scss';

type Props = {
  value: ImageAndTextType;
};

export const ImageAndTextResolver = ({ value }: Props) => {
  const { image, _rawText } = value;

  return (
    <div className="image-and-text__image">
      test
      <GatsbyImage
        image={image.asset.gatsbyImageData}
        alt={''}
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
    _rawText
  }
`;
