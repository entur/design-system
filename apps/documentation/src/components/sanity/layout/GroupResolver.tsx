import React from 'react';
import { graphql } from 'gatsby';
import { PortableText } from '../PortableText';
import { GridContainer, GridItem } from '@entur/grid';
import { GroupType } from '../types';

type Props = {
  value: GroupType;
};

export const GroupResolver = ({ value }: Props) => {
  const { content } = value;

  if (!content || content?.length === 0) return null;

  const allMediaCards = content.every(
    block =>
      (block as any)._type === 'link' &&
      (block as any).linkType === 'mediacard',
  );

  const mediumSize = allMediaCards ? 6 : content.length <= 2 ? 6 : 4;

  return (
    <GridContainer spacing="medium" rowSpacing="none" className="page__group">
      {content.map((block, index) => (
        <GridItem
          key={(block as any)._key || `block-${index}`}
          small={12}
          medium={mediumSize}
        >
          {/* One block per cell, so the card can fill the cell. Text blocks still need the rhythm inside them */}
          <PortableText
            value={block}
            container={(block as any)._type === 'textBlocks'}
          />
        </GridItem>
      ))}
    </GridContainer>
  );
};

export const GroupFragment = graphql`
  fragment GroupFragment on SanityGroup {
    _key
    _type
    content {
      ...MediaFragment
      ...ImageAndTextFragment
      ...TextBlockFragment
      ...LinkFragment
      ...GuidelineFragment
    }
  }
`;
