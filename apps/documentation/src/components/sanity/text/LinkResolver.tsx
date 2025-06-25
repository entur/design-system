import React from 'react';
import { graphql } from 'gatsby';
import { NavigationCard } from '@entur/layout';
import { Link } from '@entur/typography';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import { getIconByName } from 'src/utils/utils';
import { LinkType } from '../types';

type Props = {
  value: LinkType;
};

export const LinkResolver = ({ value }: Props) => {
  const { linkText, linkAddress, linkType, iconName } = value;
  const Icon = getIconByName(iconName);

  switch (linkType) {
    case 'navigationcard':
      return (
        <NavigationCard
          compact
          title={linkText ?? ''}
          href={linkAddress}
          titleIcon={Icon ? <Icon /> : undefined}
          style={{ maxWidth: '22.5rem' }}
        ></NavigationCard>
      );
    case 'button':
      return (
        <PrimaryButton as="a" href={linkAddress}>
          {linkText}
          {Icon ? <Icon /> : undefined}
        </PrimaryButton>
      );
    case 'button-secondary':
      return (
        <SecondaryButton as="a" href={linkAddress}>
          {linkText}
          {Icon ? <Icon /> : undefined}
        </SecondaryButton>
      );
    default:
      return (
        <Link href={linkAddress}>
          {linkText}
          {Icon ? <Icon /> : undefined}
        </Link>
      );
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
