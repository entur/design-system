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
  const {
    linkText,
    linkAddress,
    linkType,
    linkAddressType,
    iconName,
    downloadFile,
  } = value;
  const Icon = getIconByName(iconName);

  // Determine the href based on linkAddressType
  const href =
    linkAddressType === 'file' && downloadFile?.asset?.url
      ? downloadFile.asset.url + '?&dl='
      : linkAddress;

  const linkProps = {
    href,
    download:
      linkAddressType === 'file'
        ? downloadFile?.asset?.originalFilename
        : undefined,
  };

  switch (linkType) {
    case 'navigationcard':
      return (
        <NavigationCard
          compact
          title={linkText ?? ''}
          titleIcon={Icon ? <Icon /> : undefined}
          style={{ maxWidth: '22.5rem' }}
          {...linkProps}
        ></NavigationCard>
      );
    case 'button':
      return (
        <PrimaryButton
          as="a"
          {...linkProps}
          style={{ marginBlockEnd: '1rem ' }}
        >
          {linkText}
          {Icon ? <Icon /> : undefined}
        </PrimaryButton>
      );
    case 'button-secondary':
      return (
        <SecondaryButton
          as="a"
          {...linkProps}
          style={{ marginBlockEnd: '1rem ' }}
        >
          {linkText}
          {Icon ? <Icon /> : undefined}
        </SecondaryButton>
      );
    case 'button-secondary-small':
      return (
        <SecondaryButton
          as="a"
          size="small"
          {...linkProps}
          style={{ marginBlockEnd: '1rem ' }}
        >
          {linkText}
          {Icon ? <Icon /> : undefined}
        </SecondaryButton>
      );
    default:
      return (
        <Link {...linkProps}>
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
    linkAddressType
    iconName
    downloadFile {
      asset {
        _id
        url
        originalFilename
      }
    }
  }
`;
