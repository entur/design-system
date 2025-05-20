import { PortableTextProps } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

export type SanityImageType = {
  _type: string;
  asset: {
    gatsbyImageData: any;
  };
};

export type ImageAndTextType = {
  _type: string;
  order: 'image-first' | 'text-first';
  image: SanityImageType;
  text: PortableTextBlock;
  _rawText: any[];
};

export type TextBlocksType = {
  _type: string;
  _rawItems: PortableTextBlock[];
};

export type PageType = {
  _type: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  npmPackage?: string;
  content: PortableTextProps['value'];
};
