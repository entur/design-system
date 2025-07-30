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
  const { linkText, linkAddress, linkType, iconName, downloadFile } = value;
  const Icon = getIconByName(iconName);

  // For download links, use the file URL instead of linkAddress
  const href =
    linkType === 'download' && downloadFile?.asset?.url
      ? downloadFile.asset.url + '?&dl='
      : linkAddress;

  switch (linkType) {
    case 'navigationcard':
      return (
        <NavigationCard
          compact
          title={linkText ?? ''}
          href={href}
          titleIcon={Icon ? <Icon /> : undefined}
          style={{ maxWidth: '22.5rem' }}
        ></NavigationCard>
      );
    case 'button':
      return (
        <PrimaryButton as="a" href={href}>
          {linkText}
          {Icon ? <Icon /> : undefined}
        </PrimaryButton>
      );
    case 'button-secondary':
      return (
        <SecondaryButton as="a" href={href}>
          {linkText}
          {Icon ? <Icon /> : undefined}
        </SecondaryButton>
      );
    case 'download':
      return (
        <SecondaryButton
          as="a"
          size="small"
          href={href}
          download={downloadFile?.asset?.originalFilename}
        >
          {linkText}
          {Icon ? <Icon /> : undefined}
        </SecondaryButton>
      );
    default:
      return (
        <Link href={href}>
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
    downloadFile {
      asset {
        _id
        url
        originalFilename
      }
    }
  }
`;
