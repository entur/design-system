import React, { useMemo } from 'react';
import type { IGatsbyImageData } from 'gatsby-plugin-image';
import { getGatsbyImageData } from 'gatsby-source-sanity';
import { DoDontCard } from '@components/Cards/DoDont';
import { PortableTextBlock } from '@portabletext/react';
import { SANITY_PROJECT } from 'src/utils/constants';
import { PortableText } from './PortableText';
import { graphql } from 'gatsby';

type GuidelineProps = {
  value: {
    variant?: 'success' | 'information' | 'warning' | 'negative';
    title?: string;
    text?: PortableTextBlock; // whatever PortableText expects in your setup
    image?: SanityImageAsset | string | null;
    alt?: string | null;
    hideFromScreenreaders?: boolean;
    noPadding?: boolean;
    textInBox?: boolean;
  };
};

export const GuidelineResolver = ({ value }: GuidelineProps) => {
  const {
    variant = 'success',
    title,
    text,
    image,
    alt,
    hideFromScreenreaders = false,
    noPadding = false,
    textInBox = false,
  } = value;

  const imageData = useMemo(() => getImageData(image), [image]);

  return (
    <DoDontCard
      imgSource={imageData}
      alt={hideFromScreenreaders ? '' : alt ?? undefined}
      variant={variant}
      title={title}
      noPadding={noPadding}
      textInBox={textInBox}
      aria-hidden={hideFromScreenreaders}
    >
      {text && <PortableText value={text} />}
    </DoDontCard>
  );
};

export const GuidelineFragment = graphql`
  fragment GuidelineFragment on SanityGuideline {
    _key
    _type
    variant
    title
    alt
    hideFromScreenreaders
    noPadding
    textInBox
    image {
      asset {
        gatsbyImageData
      }
    }
    _rawText(resolveReferences: { maxDepth: 10 })
  }
`;

type SanityImageAsset = {
  asset?: { gatsbyImageData?: IGatsbyImageData } | { _ref: string } | null;
  [k: string]: unknown;
};

function getImageData(
  img?: GuidelineProps['value']['image'],
): IGatsbyImageData | null {
  if (!img || typeof img === 'string') return null;
  if (!img.asset) return null;

  if ('gatsbyImageData' in img.asset && img.asset.gatsbyImageData) {
    return img.asset.gatsbyImageData;
  }

  try {
    return getGatsbyImageData(
      img as any,
      { fit: 'fill', placeholder: 'dominantColor' },
      SANITY_PROJECT,
    );
  } catch {
    return null;
  }
}
