import React from 'react';
import { graphql } from 'gatsby';
import { BannerAlertBox } from '@entur/alert';
import { Contrast } from '@entur/layout';
import BaseCardDesignEntur from '@components/Cards/BaseCardDesignEntur';
import { PortableText } from '../PortableText';
import { TextBlocksType } from '../types';

import './TextBlocks.scss';

type Props = {
  value: TextBlocksType;
  npmPackage?: string;
};

export const TextBlocksResolver = ({ value, npmPackage }: Props) => {
  const textBlocksCount = value?._rawItems?.length ?? value?.items?.length;
  const textBlocksVariant = value.variant;
  if (textBlocksCount === 0) return null;

  return (
    <VariantWrapper variant={textBlocksVariant} value={value}>
      <PortableText
        value={value._rawItems ?? value.items}
        npmPackage={npmPackage}
      />
    </VariantWrapper>
  );
};

const VariantWrapper = ({
  children,
  variant,
  value,
}: {
  children: React.ReactNode;
  variant?: string;
  value: TextBlocksType;
}) => {
  switch (variant) {
    case 'information':
      return (
        <BaseCardDesignEntur className="text-blocks">
          {children}
        </BaseCardDesignEntur>
      );
    case 'contrast':
      return (
        <BaseCardDesignEntur as={Contrast} className="text-blocks">
          {children}
        </BaseCardDesignEntur>
      );
    case 'alert':
      return (
        <BannerAlertBox
          variant={value.alertType || 'information'}
          title={value.title}
          className="text-blocks"
        >
          {children}
        </BannerAlertBox>
      );
    default:
      return <>{children}</>;
  }
};

export const TextBlockFragment = graphql`
  fragment TextBlockFragment on SanityTextBlocks {
    _key
    _type
    variant
    alertType
    title
    _rawItems(resolveReferences: { maxDepth: 10 })
  }
`;
