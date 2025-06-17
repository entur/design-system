import React from 'react';
import { graphql } from 'gatsby';
import BaseCardDesignEntur from '@components/Cards/BaseCardDesignEntur';
import { PortableText } from '../PortableText';
import { TextBlocksType } from '../types';

import './TextBlocks.scss';

type Props = {
  value: TextBlocksType;
};

export const TextBlocksResolver = ({ value }: Props) => {
  const textBlocksCount = value?._rawItems?.length ?? value?.items?.length;
  const textBlocksVariant = value.variant;
  if (textBlocksCount === 0) return null;

  return (
    <VariantWrapper variant={textBlocksVariant}>
      <PortableText value={value._rawItems ?? value.items} />
    </VariantWrapper>
  );
};

const VariantWrapper = ({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant?: string;
}) => {
  switch (variant) {
    case 'information':
      return (
        <BaseCardDesignEntur className="text-blocks">
          {children}
        </BaseCardDesignEntur>
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
    _rawItems(resolveReferences: { maxDepth: 10 })
  }
`;
