import React from 'react';
import { graphql } from 'gatsby';
import { PortableText } from '../PortableText';
import { GridContainer, GridItem } from '@entur/grid';
import { GroupType } from '../types';
import { Text } from '@entur/typography/beta';

import './Group.scss';

type Props = {
  value: GroupType;
};

export const GroupResolver = ({ value }: Props) => {
  const { content } = value;

  if (!content || content?.length == 0) return null;

  if (content.length <= 2)
    return (
      <GridContainer spacing="medium" rowSpacing="none" className="page__group">
        {content.map((block, index) => (
          <GridItem
            key={(block as any)._key || `block-${index}`}
            small={12}
            medium={6}
          >
            <PortableText value={block} />
          </GridItem>
        ))}
      </GridContainer>
    );
  if (content.length >= 3)
    return (
      <GridContainer spacing="medium" rowSpacing="none" className="page__group">
        {content.map((block, index) => (
          <GridItem
            key={(block as any)._key || `block-${index}`}
            small={12}
            medium={4}
          >
            <PortableText value={block} />
          </GridItem>
        ))}
      </GridContainer>
    );

  return <Text variant="code-text">ERROR IN SANITY GROUP COMPONENT</Text>;
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
