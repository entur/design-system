import { PortableTextProps } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { getGatsbyImageData } from 'gatsby-source-sanity';

export type SanityImageType = {
  _type: string;
  asset: {
    gatsbyImageData: any;
  };
};

export type SaintyInlineImageType = {
  _type: string;
  asset: {
    _id: string;
    url: string;
    assetId: string;
    extension: string;
    metadata: any;
  };
  assetId: string;
};

export type ImageAndTextType = {
  _type: string;
  order: 'image-first' | 'text-first';
  image: SanityImageType | Parameters<typeof getGatsbyImageData>[0];
  imageDescription?: string;
  hideFromScreenreaders?: boolean;
  text: PortableTextBlock;
  _rawText: any[];
  addMargin: boolean;
  showDownload?: boolean;
};

export type LinkType = {
  _type: string;
  linkAddress?: string;
  linkText?: string;
  linkType?: 'text' | 'navigationcard' | 'button' | 'button-secondary';
  iconName?: string;
};

export type InlineIcon = {
  _type: string;
  iconName?: string;
  iconDescription?: string;
  hideFromScreenreaders?: boolean;
};

export type TextBlocksType = {
  _type: string;
  _rawItems: PortableTextBlock[];
  items: PortableTextBlock[];
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
