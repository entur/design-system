import React from 'react';
import { PortableTextBlock } from '@portabletext/react';
import { PortableText } from './PortableText';
import { TextBlocksType } from './types';

type Props = {
  value: TextBlocksType;
};

export const TextBlocksResolver = ({ value }: Props) => {
  const textBlocksCount = value._rawItems.length;
  if (textBlocksCount === 0) {
    return null;
  }
  if (textBlocksCount === 1) {
    return <PortableText value={value._rawItems[0]} />;
  }
  return (
    <>
      {value._rawItems.map((item: PortableTextBlock, _key: number) => (
        <PortableText key={_key} value={item} />
      ))}
    </>
  );
};
