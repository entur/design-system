import React from 'react';
import { graphql } from 'gatsby';
import { PortableText } from '../PortableText';
import { GridContainer, GridItem } from '@entur/grid';
import { GroupType } from '../types';
import { CodeText } from '@entur/typography';

type Props = {
  value: GroupType;
};

export const GroupResolver = ({ value }: Props) => {
  const { content } = value;

  if (!content || content?.length == 0) return null;

  if (content.length == 1) return <PortableText value={content?.[0]} />;
  if (content.length == 2)
    return (
      <GridContainer spacing="medium">
        {content.map(block => (
          <GridItem small={12} medium={6}>
            <PortableText value={block} />
          </GridItem>
        ))}
      </GridContainer>
    );
  if (content.length >= 3)
    return (
      <GridContainer spacing="medium">
        {content.map(block => (
          <GridItem small={12} medium={4}>
            <PortableText value={block} />
          </GridItem>
        ))}
      </GridContainer>
    );

  return <CodeText>ERROR IN SANITY GROUP COMPONENT</CodeText>;
};

export const GroupFragment = graphql`
  fragment GroupFragment on SanityGroup {
    _key
    _type
    content {
      ...ImageAndTextFragment
      ...TextBlockFragment
      ...LinkFragment
    }
  }
`;
