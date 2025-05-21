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
  addMargin: boolean;
};

export type LinkType = {
  _type: string;
  linkAddress?: string;
  linkText?: string;
  linkType?: 'text' | 'navigationcard' | 'button';
  iconName?: string;
};

export type TextBlocksType = {
  _type: string;
  _rawItems: PortableTextBlock[];
  variant?: 'normal' | 'information';
};

export type GroupType = {
  _type: string;
  content: Array<PortableTextProps['value']>;
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
