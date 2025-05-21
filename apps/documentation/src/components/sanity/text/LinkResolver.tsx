import React from 'react';
import { graphql } from 'gatsby';
import * as icons from '@entur/icons';
import { NavigationCard } from '@entur/layout';
import { Link } from '@entur/typography';
import { LinkType } from '../types';

type Props = {
  value: LinkType;
};

type IconName = keyof typeof icons;

export const LinkResolver = ({ value }: Props) => {
  const { linkText, linkAddress, linkType, iconName } = value;
  const Icon = iconName ? icons[iconName as IconName] : null;

  switch (linkType) {
    case 'navigationcard':
      return (
        <NavigationCard
          compact
          title={linkText ?? ''}
          href={linkAddress}
          titleIcon={Icon ? <Icon /> : undefined}
        ></NavigationCard>
      );
    default:
      return <Link href={linkAddress}>{linkText}</Link>;
  }
};

export const LinkFragment = graphql`
  fragment LinkFragment on SanityLink {
    _key
    _type
    linkAddress
    linkText
    linkType
    iconName
  }
`;
