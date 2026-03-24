import React from 'react';
import { Link as GatsbyLink, graphql } from 'gatsby';
import { getGatsbyImageData } from 'gatsby-source-sanity';
import { MediaCard, NavigationCard } from '@entur/layout';
import { Link } from '@entur/typography';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import { getIconByName } from 'src/utils/utils';
import { ImageDisplay } from '@components/Media/ImageDisplay';
import { SANITY_PROJECT } from 'src/utils/constants';
import { LinkType } from '../types';

import './LinkResolver.scss';

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
    linkDescription,
    linkCategory,
    image,
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
    case 'mediacard': {
      const imageData =
        image?.asset && 'gatsbyImageData' in image.asset
          ? image.asset.gatsbyImageData
          : image
          ? getGatsbyImageData(
              // @ts-expect-error Images inserted inline from Sanity do not contain gatsbyImageData when deeply resolved
              image,
              {},
              SANITY_PROJECT,
            )
          : null;

      return (
        <MediaCard
          as={GatsbyLink}
          to={href ?? ''}
          title={linkText ?? ''}
          description={linkDescription ?? ''}
          className="sanity-media-card"
          headingLevel="h3"
          hideArrow
          category={linkCategory}
        >
          {imageData && (
            <ImageDisplay
              imgSource={imageData}
              alt=""
              preset="full-width-image"
            />
          )}
        </MediaCard>
      );
    }
    case 'button':
      return (
        <PrimaryButton
          as="a"
          {...linkProps}
          style={{ marginBlockEnd: '2rem ' }}
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
          style={{ marginBlockEnd: '2rem ' }}
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
          style={{ marginBlockEnd: '2rem ' }}
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
    linkDescription
    linkCategory
    image {
      asset {
        gatsbyImageData
      }
    }
  }
`;
